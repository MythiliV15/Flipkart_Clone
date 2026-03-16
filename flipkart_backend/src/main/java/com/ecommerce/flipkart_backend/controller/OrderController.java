package com.ecommerce.flipkart_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.flipkart_backend.dto.request.OrderRequest;
import com.ecommerce.flipkart_backend.dto.response.OrderResponse;
import com.ecommerce.flipkart_backend.service.OrderService;
import com.ecommerce.flipkart_backend.service.StripeService;
import com.ecommerce.flipkart_backend.service.UserService;
import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private StripeService stripeService;

    private Long getCurrentUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.getUserIdByEmail(email);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication) {
        Long customerId = getCurrentUserId(authentication);
        OrderResponse order = orderService.createOrder(request, customerId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/checkout-session")
    public ResponseEntity<?> createCheckoutSession(@PathVariable Long id) {
        try {
            OrderResponse order = orderService.getOrderById(id);
            Map<String, String> session = stripeService.createCheckoutSession(id, order.getTotalAmount());
            return ResponseEntity.ok(session);
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        Long customerId = getCurrentUserId(authentication);
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        try {
            OrderResponse order = orderService.cancelOrder(id, email);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}