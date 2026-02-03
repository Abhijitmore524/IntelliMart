package com.intellimart.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    public Order createOrder(double amount) throws Exception {

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        return razorpayClient.orders.create(options);
    }
}
