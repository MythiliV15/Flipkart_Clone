package com.ecommerce.flipkart_backend.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String status;
    private String imageUrl;
}