package com.ecommerce.flipkart_backend.controller;

import com.ecommerce.flipkart_backend.dto.request.ProductRequest;
import com.ecommerce.flipkart_backend.dto.response.ProductResponse;
import com.ecommerce.flipkart_backend.service.ProductService;
import com.ecommerce.flipkart_backend.service.OrderService;
import com.ecommerce.flipkart_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendor")
@PreAuthorize("hasRole('VENDOR')")
public class VendorController {

    private final ProductService productService;
    private final UserService userService;
    private final OrderService orderService;

    @Autowired
    public VendorController(ProductService productService, UserService userService, OrderService orderService) {
        this.productService = productService;
        this.userService = userService;
        this.orderService = orderService;
    }

    private Long getVendorId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.getUserIdByEmail(email);
    }

    @GetMapping("/analysis")
    public ResponseEntity<Map<String, Object>> getAnalysis(Authentication authentication) {
        Long vendorId = getVendorId(authentication);
        return ResponseEntity.ok(orderService.getVendorAnalysis(vendorId));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponse> addProduct(
            @RequestBody ProductRequest request,
            Authentication authentication) {
        // TODO: Extract vendor ID from JWT token properly
        // For now, using placeholder
        Long vendorId = getVendorId(authentication);
        return ResponseEntity.ok(productService.createProduct(request, vendorId));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request,
            Authentication authentication) {
        Long vendorId = getVendorId(authentication);
        return ResponseEntity.ok(productService.updateProduct(id, request, vendorId));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {
        Long vendorId = getVendorId(authentication);
        productService.deleteProduct(id, vendorId);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            Authentication authentication) {
        Long vendorId = getVendorId(authentication);
        return ResponseEntity.ok(productService.getProductsByVendor(vendorId));
    }
}