package com.intellimart.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.intellimart.entities.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {

    private Long orderId;
    private Long customerId;
    private Status status;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
}
