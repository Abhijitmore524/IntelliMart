package com.intellimart.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name ="orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate orderDate;

    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    private Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private Set<OrderLineItem> lineItems;

    @OneToOne(mappedBy = "order")
    @JsonIgnore
    @ToString.Exclude
    private Payment payment;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;
}
