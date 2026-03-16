package com.ecommerce.flipkart_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.flipkart_backend.dto.response.OrderResponse;
import com.ecommerce.flipkart_backend.entity.AuditLog;
import com.ecommerce.flipkart_backend.entity.Order;
import com.ecommerce.flipkart_backend.entity.User;
import com.ecommerce.flipkart_backend.entity.GlobalSettings;
import com.ecommerce.flipkart_backend.repository.AuditLogRepository;
import com.ecommerce.flipkart_backend.repository.GlobalSettingsRepository;
import com.ecommerce.flipkart_backend.repository.OrderRepository;
import com.ecommerce.flipkart_backend.repository.ProductRepository;
import com.ecommerce.flipkart_backend.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private GlobalSettingsRepository settingsRepository;

    public GlobalSettings getSettings() {
        return settingsRepository.getSettings();
    }

    public GlobalSettings updateSettings(GlobalSettings settings) {
        GlobalSettings currentSettings = settingsRepository.getSettings();
        currentSettings.setPlatformFee(settings.getPlatformFee());
        currentSettings.setOfferPercentage(settings.getOfferPercentage());
        currentSettings.setOfferEnabled(settings.getOfferEnabled());
        currentSettings.setOfferExpiry(settings.getOfferExpiry());
        return settingsRepository.save(currentSettings);
    }

    public List<Map<String, Object>> getTopProducts(int limit) {
        List<Object[]> results = orderRepository.findTopProducts(limit);
        List<Map<String, Object>> products = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> product = new HashMap<>();
            product.put("productId", result[0]);
            product.put("productName", result[1]);
            product.put("totalQuantity", result[2]);
            product.put("totalRevenue", result[3]);
            products.add(product);
        }
        
        return products;
    }

    public List<Map<String, Object>> getDailyRevenue(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Object[]> results = orderRepository.findDailyRevenue(startDate);
        List<Map<String, Object>> revenue = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> day = new HashMap<>();
            day.put("date", result[0]);
            day.put("revenue", result[1]);
            day.put("orderCount", result[2]);
            revenue.add(day);
        }
        
        return revenue;
    }

    public Map<String, Object> getTotalStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        
        Object[] revenueResult = orderRepository.calculateTotalRevenue();
        Double totalRevenue = revenueResult[0] != null ? (Double) revenueResult[0] : 0.0;
        
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAuditLogsByOrder(Long orderId) {
        List<AuditLog> logs = auditLogRepository.findByOrderId(orderId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (AuditLog log : logs) {
            Map<String, Object> logMap = new HashMap<>();
            logMap.put("id", log.getId());
            logMap.put("action", log.getAction());
            logMap.put("performedBy", log.getPerformedBy());
            logMap.put("timestamp", log.getTimestamp());
            result.add(logMap);
        }
        
        return result;
    }

    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            userMap.put("active", user.isActive());
            result.add(userMap);
        }
        
        return result;
    }

    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomer().getId());
        response.setCustomerName(order.getCustomer().getName());
        response.setTotalAmount(order.getTotalAmount());
        response.setPlatformFee(order.getPlatformFee());
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
}