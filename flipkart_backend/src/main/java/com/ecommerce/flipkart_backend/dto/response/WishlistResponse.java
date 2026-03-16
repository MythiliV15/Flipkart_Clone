package com.ecommerce.flipkart_backend.dto.response;

import lombok.Data;

@Data
public class WishlistResponse {

    private Long id;
    private ProductInfo product;

    @Data
    public static class ProductInfo {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private Integer stock;
        private String category;
        private String imageUrl;
        private String vendorName;
    }
}
