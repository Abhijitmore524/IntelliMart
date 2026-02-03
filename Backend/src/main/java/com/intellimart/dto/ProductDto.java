package com.intellimart.dto;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {

    private Long id;
    private String name;
    private BigDecimal price;
    private String pcategory;
    private String description;
    private String imageUrl;
    private Integer unitsAvailable;
    private Long sellerId;
    
    // ✅ ADDED: To show the seller's name on the details page
    private String sellerName; 
}