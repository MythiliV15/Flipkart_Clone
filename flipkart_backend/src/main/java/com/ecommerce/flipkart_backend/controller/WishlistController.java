package com.ecommerce.flipkart_backend.controller;

import com.ecommerce.flipkart_backend.dto.response.WishlistResponse;
import com.ecommerce.flipkart_backend.service.UserService;
import com.ecommerce.flipkart_backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userService.getUserIdByEmail(email);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        Long userId = getCurrentUserId(authentication);
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }

    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlist(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }
}
