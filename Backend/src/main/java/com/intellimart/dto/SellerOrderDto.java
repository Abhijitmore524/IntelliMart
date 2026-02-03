package com.intellimart.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.intellimart.entities.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerOrderDto {

    private Long orderId;
    private String productName;
    private Integer quantity;
    private BigDecimal amount;
    private Status status;
    private LocalDate orderDate;
}
