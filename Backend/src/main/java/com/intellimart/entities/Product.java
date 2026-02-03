package com.intellimart.entities;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private ProductCategory pcategory;

    private BigDecimal price;

    private int unitsAvailable;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Seller seller;

    // 🔥 IMPORTANT — prevents NULL ever again
    @Column(nullable = false)
    private boolean isDeleted = false;

    @Column(length = 1000)
    private String description;
}
