package com.ecommerce.flipkart_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String name;
    private String email;
    private Long userId;
    private boolean isAuthenticated;
}