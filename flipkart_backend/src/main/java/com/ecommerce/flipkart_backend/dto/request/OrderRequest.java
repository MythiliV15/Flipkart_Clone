package com.ecommerce.flipkart_backend.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private String shippingAddress;
    private String paymentMethod;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}