package com.intellimart.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.PaymentDto;
import com.intellimart.entities.Orders;
import com.intellimart.entities.Payment;
import com.intellimart.entities.PaymentStatus;
import com.intellimart.repos.OrderRepo;
import com.intellimart.repos.PaymentRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentServiceInterface {

    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;
    private final RazorpayClient razorpayClient; // ✅ USES THE BEAN (rzp_test_SBDo89UP0tFzEp)
    private final OrderServiceImpl orderService; // ✅ TO CALL confirmOrderAndClearCart

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public PaymentDto createRazorpayOrder(Long orderId) {
        Orders order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        try {
            JSONObject orderRequest = new JSONObject();
            // Razorpay expects amount in PAISE (Amount * 100)
            orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal(100)).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + orderId);

            // ✅ This now uses the credentials from application.properties
            Order rzpOrder = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setRazorpayOrderId(rzpOrder.get("id"));
            payment.setPaymentStatus(PaymentStatus.PENDING);
            
            return toDto(paymentRepo.save(payment));
        } catch (Exception e) {
            // This is the "Authentication failed" trigger if keys don't match
            throw new RuntimeException("Razorpay Order creation failed: " + e.getMessage());
        }
    }

    @Override
    public PaymentDto verifyPayment(Long paymentId, String razorpayPaymentId, String razorpayOrderId, String signature) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", signature);

            // ✅ Verified using the secret from your properties file
            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setPaymentStatus(PaymentStatus.SUCCESS);
                
                // ✅ This triggers the logic to clear the cart ONLY after successful payment
                orderService.confirmOrderAndClearCart(payment.getOrder().getOrderId());
            } else {
                payment.setPaymentStatus(PaymentStatus.FAILED);
            }
            return toDto(paymentRepo.save(payment));
        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed");
        }
    }

    // ================= DATA LOOKUP METHODS =================

    @Override
    public List<PaymentDto> getCustomerPayments(Long userId) {
        return paymentRepo.findByOrder_Customer_User_Id(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getCustomerPaymentsByEmail(String email) {
        return paymentRepo.findByOrder_Customer_User_Email(email)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getSellerPayments(Long sellerId) {
        // Using your custom repo method for seller lookups
        return paymentRepo.findPaymentsBySeller(sellerId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getAllPayments() {
        return paymentRepo.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    // ================= DTO MAPPER =================

    private PaymentDto toDto(Payment p) {
        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        dto.setOrderId(p.getOrder().getOrderId());
        dto.setAmount(p.getAmount());

        // Null-safe status check
        if (p.getPaymentStatus() != null)
            dto.setPaymentStatus(p.getPaymentStatus().name());
        else
            dto.setPaymentStatus("PENDING");

        dto.setRazorpayOrderId(p.getRazorpayOrderId());
        dto.setRazorpayPaymentId(p.getRazorpayPaymentId());
        return dto;
    }
}