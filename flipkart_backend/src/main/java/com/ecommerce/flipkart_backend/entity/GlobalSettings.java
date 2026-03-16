package com.ecommerce.flipkart_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "global_settings")
@Data
public class GlobalSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(value = 1, message = "Platform fee must be at least 1")
    @Max(value = 500, message = "Platform fee cannot exceed 500")
    private Double platformFee = 1.0;
    
    @Min(value = 0, message = "Offer percentage cannot be negative")
    private Double offerPercentage = 0.0;
    private Boolean offerEnabled = false;
    private LocalDateTime offerExpiry;
}
