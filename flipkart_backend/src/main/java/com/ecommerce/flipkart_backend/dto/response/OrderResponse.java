package com.ecommerce.flipkart_backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private Double totalAmount;
    private String status;
    private String stripePaymentId;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private String shippingAddress;

    @Data
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private Integer quantity;
        private Double priceAtPurchase;
        private String productImage;
    }
}