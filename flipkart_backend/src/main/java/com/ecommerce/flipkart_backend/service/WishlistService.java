package com.ecommerce.flipkart_backend.service;

import com.ecommerce.flipkart_backend.dto.response.WishlistResponse;
import com.ecommerce.flipkart_backend.entity.Product;
import com.ecommerce.flipkart_backend.entity.User;
import com.ecommerce.flipkart_backend.entity.Wishlist;
import com.ecommerce.flipkart_backend.repository.ProductRepository;
import com.ecommerce.flipkart_backend.repository.UserRepository;
import com.ecommerce.flipkart_backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Avoid duplicates
        boolean alreadyExists = wishlistRepository.existsByUserIdAndProductId(userId, productId);
        if (!alreadyExists) {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            Wishlist saved = wishlistRepository.save(wishlist);
            return mapToResponse(saved, product);
        }

        // Return existing
        Wishlist existing = wishlistRepository.findByUserIdAndProductId(userId, productId);
        return mapToResponse(existing, product);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishlist(Long userId) {
        List<Wishlist> items = wishlistRepository.findByUserId(userId);
        return items.stream()
                .map(w -> mapToResponse(w, w.getProduct()))
                .collect(Collectors.toList());
    }

    private WishlistResponse mapToResponse(Wishlist wishlist, Product product) {
        WishlistResponse response = new WishlistResponse();
        response.setId(wishlist.getId());

        WishlistResponse.ProductInfo info = new WishlistResponse.ProductInfo();
        info.setId(product.getId());
        info.setName(product.getName());
        info.setDescription(product.getDescription());
        info.setPrice(product.getPrice());
        info.setStock(product.getStock());
        info.setCategory(product.getCategory());
        info.setImageUrl(product.getImageUrl());
        if (product.getVendor() != null) {
            info.setVendorName(product.getVendor().getName());
        }
        response.setProduct(info);
        return response;
    }
}
