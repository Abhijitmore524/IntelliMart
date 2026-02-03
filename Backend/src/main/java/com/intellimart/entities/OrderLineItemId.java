package com.intellimart.entities;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderLineItemId implements Serializable {

    // These fields hold the IDs from the parent tables
    private Long orderId; 
    private Long productId;
    
    // Lombok ensures correct equals() and hashCode() for this key
}