package com.intellimart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.razorpay.RazorpayClient;

@Configuration
public class RazorpayConfig {

    // ✅ FIXED: Matches 'razorpay.key.id' in your properties file
    @Value("${razorpay.key.id}")
    private String key;

    // ✅ FIXED: Matches 'razorpay.key.secret' in your properties file
    @Value("${razorpay.key.secret}")
    private String secret;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {
        return new RazorpayClient(key, secret);
    }
}