package com.intellimart.service;

import java.util.List;
import com.intellimart.dto.PaymentDto;

public interface PaymentServiceInterface {

    PaymentDto createRazorpayOrder(Long orderId);

    PaymentDto verifyPayment(
            Long paymentId,
            String razorpayPaymentId,
            String razorpayOrderId,
            String signature);

    // CUSTOMER (JWT) - Standard lookup
    List<PaymentDto> getCustomerPaymentsByEmail(String email);

    // NEW: Numeric lookup for consistency with other services
    List<PaymentDto> getCustomerPayments(Long userId);

    // SELLER
    List<PaymentDto> getSellerPayments(Long sellerId);

    // ADMIN
    List<PaymentDto> getAllPayments();
}