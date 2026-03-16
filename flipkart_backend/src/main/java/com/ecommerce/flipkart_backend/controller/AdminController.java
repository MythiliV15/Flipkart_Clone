package com.ecommerce.flipkart_backend.controller;

import com.ecommerce.flipkart_backend.entity.GlobalSettings;
import com.ecommerce.flipkart_backend.dto.response.OrderResponse;
import com.ecommerce.flipkart_backend.service.AdminService;
import com.ecommerce.flipkart_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/settings")
    public ResponseEntity<GlobalSettings> getSettings() {
        return ResponseEntity.ok(adminService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<GlobalSettings> updateSettings(@Valid @RequestBody GlobalSettings settings) {
        return ResponseEntity.ok(adminService.updateSettings(settings));
    }

    @GetMapping("/reports/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(adminService.getTopProducts(limit));
    }

    @GetMapping("/reports/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(adminService.getDailyRevenue(days));
    }

    @GetMapping("/reports/total-stats")
    public ResponseEntity<Map<String, Object>> getTotalStats() {
        return ResponseEntity.ok(adminService.getTotalStats());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            OrderResponse order = orderService.updateOrderStatus(id, newStatus, "ADMIN");
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/audit-logs/{orderId}")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminService.getAuditLogsByOrder(orderId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}