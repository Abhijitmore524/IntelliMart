package com.intellimart.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.ApiResponse; // Added for consistent response
import com.intellimart.dto.PaymentDto;
import com.intellimart.repos.SellerRepo;
import com.intellimart.service.PaymentServiceInterface;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceInterface paymentService;
    private final SellerRepo sellerRepo;

    // ================= RAZORPAY =================

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/razorpay/{orderId}")
    public ResponseEntity<PaymentDto> create(@PathVariable Long orderId) {
        // Happy path only; exceptions are handled by GlobalExceptionHandler
        return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
    }

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verify(
            @RequestParam Long paymentId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpayOrderId,
            @RequestParam String signature) {
        
        // Verify logic moved to service; returns standardized ApiResponse
        paymentService.verifyPayment(
                paymentId,
                razorpayPaymentId,
                razorpayOrderId,
                signature
        );
        return ResponseEntity.ok(new ApiResponse(true, "Payment Verified Successfully"));
    }

    // ================= CUSTOMER =================

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/customer")
    public ResponseEntity<List<PaymentDto>> customer(Authentication auth) {
        // auth.getName() gets the email from your JWT
        return ResponseEntity.ok(
                paymentService.getCustomerPaymentsByEmail(auth.getName())
        );
    }

    // ================= SELLER =================

    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    @GetMapping("/seller")
    public ResponseEntity<List<PaymentDto>> seller(Authentication auth) {
        // Optimized seller lookup
        Long sellerId = sellerRepo.findByUser_Email(auth.getName())
                        .orElseThrow(() -> new RuntimeException("Seller not found"))
                        .getId();

        return ResponseEntity.ok(paymentService.getSellerPayments(sellerId));
    }

    // ================= ADMIN =================

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<PaymentDto>> all() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}