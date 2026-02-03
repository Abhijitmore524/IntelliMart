package com.intellimart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long cartItemId;
    private Long productId;
    private String productName;
    // ✅ FIX: Named specifically to match React mapping
    private Double productPrice; 
    private String productImageUrl;
    private int quantity;
}