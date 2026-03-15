package com.ecommerce.flipkart_backend.dto.response;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String status;
    private String imageUrl;
    private Long vendorId;
    private String vendorName;
}