package com.intellimart.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.Status;

public interface OrderServiceInterface {

    // ===== OLD (keep) =====
    OrderDto placeOrder(Long customerId, Long addressId);

    // ===== NEW (JWT) =====
    OrderDto placeOrder(Authentication auth, Long addressId);

    List<OrderDto> getCustomerOrdersByEmail(String email);

    List<OrderDto> getCustomerOrdersById(Long customerId);

    OrderDto getOrderById(Long orderId);

    List<OrderDto> getAllOrders();

    OrderDto updateOrderStatus(Long orderId, Status status);

    List<SellerOrderDto> getSellerOrders(Long sellerId);

    List<SellerOrderDto> getSellerOrdersByAuth(Authentication auth);
}
