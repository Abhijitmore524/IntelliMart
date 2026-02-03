package com.intellimart.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.intellimart.dto.CartItemDto;
import com.intellimart.entities.CartItem;

public interface CartServiceInterface {

    // ===== OLD (userId based – keep) =====
    String addItemToCart(Long userId, Long productId, int quantity);

    List<CartItemDto> getCartDtos(Long userId);

    List<CartItem> getCartByCustomer(Long userId);

    String clearCart(Long userId);

    String updateQuantity(Long cartItemId, int quantity);

    String removeItemFromCart(Long cartItemId);

    // ===== NEW (JWT based – add) =====
    String addItemToCart(Authentication auth, Long productId, int quantity);

    List<CartItemDto> getCartDtos(Authentication auth);

    String updateQuantity(Authentication auth, Long cartItemId, int quantity);

    String removeItemFromCart(Authentication auth, Long cartItemId);

    String clearCart(Authentication auth);
}
