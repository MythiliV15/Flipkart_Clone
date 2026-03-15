package com.ecommerce.flipkart_backend.service;

import com.ecommerce.flipkart_backend.dto.request.ProductRequest;
import com.ecommerce.flipkart_backend.dto.response.ProductResponse;
import com.ecommerce.flipkart_backend.entity.Product;
import com.ecommerce.flipkart_backend.entity.User;
import com.ecommerce.flipkart_backend.repository.ProductRepository;
import com.ecommerce.flipkart_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ProductResponse createProduct(ProductRequest request, Long vendorId) {
        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        product.setIsDeleted(false);
        product.setVendor(vendor);
        product.setImageUrl(request.getImageUrl());

        Product saved = productRepository.save(product);
        return mapToResponse(saved);
    }

    public ProductResponse updateProduct(Long productId, ProductRequest request, Long vendorId) {
        Product product = productRepository.findByIdAndNotDeleted(productId);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }
        if (!product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized: You can only update your own products");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        product.setImageUrl(request.getImageUrl());

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    public void deleteProduct(Long productId, Long vendorId) {
        Product product = productRepository.findByIdAndNotDeleted(productId);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }
        if (!product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own products");
        }
        product.setIsDeleted(true);
        productRepository.save(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findByIsDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByVendor(Long vendorId) {
        return productRepository.findByVendorIdAndIsDeletedFalse(vendorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findByIdAndNotDeleted(productId);
        if (product == null) {
            throw new RuntimeException("Product not found");
        }
        return mapToResponse(product);
    }

    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.searchByName(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndIsDeletedFalse(category)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());
        response.setStatus(product.getStatus());
        response.setImageUrl(product.getImageUrl());
        response.setVendorId(product.getVendor().getId());
        response.setVendorName(product.getVendor().getName());
        return response;
    }

    public Product getProductEntityById(Long productId) {
        return productRepository.findByIdAndNotDeleted(productId);
    }
}