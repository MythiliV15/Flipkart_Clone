package com.ecommerce.flipkart_backend.service;

import com.ecommerce.flipkart_backend.dto.request.OrderRequest;
import com.ecommerce.flipkart_backend.dto.response.OrderResponse;
import com.ecommerce.flipkart_backend.entity.Order;
import com.ecommerce.flipkart_backend.entity.OrderItem;
import com.ecommerce.flipkart_backend.entity.Product;
import com.ecommerce.flipkart_backend.entity.User;
import com.ecommerce.flipkart_backend.repository.OrderRepository;
import com.ecommerce.flipkart_backend.repository.ProductRepository;
import com.ecommerce.flipkart_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.LockModeType;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public OrderResponse createOrder(OrderRequest request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus("CREATED");
        order.setTotalAmount(0.0);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            // Pessimistic Lock - Lock the product row for update
            Product product = productRepository.findByIdForUpdate(itemRequest.getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found or deleted: " + itemRequest.getProductId());
            }

            // Check stock availability
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Decrement stock atomically
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItems.add(orderItem);

            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Create audit log
        auditLogService.createLog(order.getId(), "ORDER_CREATED", customer.getEmail());

        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerOrderByDateDesc(customerId);
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus, String performedBy) {
        // Pessimistic lock for status update
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String currentStatus = order.getStatus();

        // Rules:
        // 1. Cannot skip stages
        // 2. Once SHIPPED -> cannot cancel
        // 3. Once DELIVERED -> no further changes
        
        if ("DELIVERED".equals(currentStatus)) {
            throw new RuntimeException("Once DELIVERED, no further changes are allowed.");
        }

        if ("CANCELLED".equals(currentStatus)) {
            throw new RuntimeException("Order is already CANCELLED.");
        }

        if ("SHIPPED".equals(currentStatus) && "CANCELLED".equals(newStatus)) {
            throw new RuntimeException("Once SHIPPED, the order cannot be CANCELLED.");
        }

        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new RuntimeException("Invalid status transition from " + currentStatus + " to " + newStatus + ". Stages cannot be skipped.");
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);

        // Create audit log
        auditLogService.createLog(orderId, "STATUS_CHANGED_" + currentStatus + "_TO_" + newStatus, performedBy);

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String performedBy) {
        Order order = orderRepository.findByIdWithLock(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        // Cannot cancel shipped orders
        if ("SHIPPED".equals(order.getStatus()) || "DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        String oldStatus = order.getStatus();
        order.setStatus("CANCELLED");
        order = orderRepository.save(order);

        // Create audit log
        auditLogService.createLog(orderId, "ORDER_CANCELLED_" + oldStatus, performedBy);

        return mapToResponse(order);
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        // Lifecycle: CREATED → CONFIRMED → SHIPPED → DELIVERED → CANCELLED (Rules apply)
        if ("CREATED".equals(currentStatus)) {
            return "CONFIRMED".equals(newStatus) || "CANCELLED".equals(newStatus);
        }
        if ("CONFIRMED".equals(currentStatus)) {
            return "SHIPPED".equals(newStatus) || "CANCELLED".equals(newStatus);
        }
        if ("SHIPPED".equals(currentStatus)) {
            return "DELIVERED".equals(newStatus); // Cannot cancel after shipped as per rules
        }
        return false;
    }

    @Transactional
    public OrderResponse confirmOrderPayment(Long orderId, String stripePaymentId) {
        Order order = orderRepository.findByIdWithLock(orderId);
        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        if (!"CREATED".equals(order.getStatus())) {
            throw new RuntimeException("Order cannot be confirmed with status: " + order.getStatus());
        }

        order.setStatus("CONFIRMED");
        order.setStripePaymentId(stripePaymentId);
        order = orderRepository.save(order);

        auditLogService.createLog(orderId, "PAYMENT_CONFIRMED", "SYSTEM");

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setCustomerName(order.getCustomer().getName());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setStripePaymentId(order.getStripePaymentId());
        response.setCreatedAt(order.getCreatedAt());

        if (order.getOrderItems() != null) {
            List<OrderResponse.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                    .map(item -> {
                        OrderResponse.OrderItemResponse itemResponse = new OrderResponse.OrderItemResponse();
                        itemResponse.setProductId(item.getProduct().getId());
                        itemResponse.setProductName(item.getProduct().getName());
                        itemResponse.setQuantity(item.getQuantity());
                        itemResponse.setPriceAtPurchase(item.getPriceAtPurchase());
                        itemResponse.setProductImage(item.getProduct().getImageUrl());
                        return itemResponse;
                    })
                    .collect(Collectors.toList());
            response.setItems(itemResponses);
        }

        return response;
    }

    public Order getOrderEntityById(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }
}