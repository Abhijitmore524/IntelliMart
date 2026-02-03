package com.intellimart.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Payment details.
 * Used to communicate payment status and Razorpay IDs to the frontend.
 */
@Data // ✅ Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // ✅ Generates a no-argument constructor
@AllArgsConstructor // ✅ Generates a constructor with all fields
public class PaymentDto {

    private Long id;

    private Long orderId;

    private BigDecimal amount;

    /**
     * ✅ FIX: This field provides the setPaymentStatus(String) method.
     * It stores the name of the PaymentStatus enum (e.g., "SUCCESS", "PENDING").
     */
    private String paymentStatus;

    private String razorpayOrderId;

    private String razorpayPaymentId;
}