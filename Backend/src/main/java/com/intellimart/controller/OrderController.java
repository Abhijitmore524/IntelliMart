package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.intellimart.dto.OrderDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.entities.Status;
import com.intellimart.service.OrderServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServiceInterface orderService;

    /**
     * ✅ PLACE ORDER WITH ADDRESS
     * Matches Frontend: api.post(`/api/orders/place/${user.id}`, null, { params: { addressId } })
     * userId will be 120, which the Service will map to Customer 207
     */
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/place/{userId}")
    public ResponseEntity<OrderDto> place(
            @PathVariable Long userId,
            @RequestParam Long addressId) {

        return ResponseEntity.ok(
                orderService.placeOrder(userId, addressId)
        );
    }

    /**
     * ✅ GET CUSTOMER SPECIFIC ORDERS (FOR ADMIN)
     * Matches Frontend: api.get(`/api/orders/customer/${id}`)
     * This allows an Admin to see orders for any customer by their ID.
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(
                orderService.getCustomerOrdersById(customerId)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/customer")
    public ResponseEntity<List<OrderDto>> customer(Authentication auth) {
        return ResponseEntity.ok(
                orderService.getCustomerOrdersByEmail(auth.getName())
        );
    }

    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    @GetMapping("/seller")
    public ResponseEntity<List<SellerOrderDto>> seller(Authentication auth) {
        return ResponseEntity.ok(
                orderService.getSellerOrdersByAuth(auth)
        );
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<List<OrderDto>> all() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SELLER')")
    @PutMapping("/{orderId}/status/{status}")
    public ResponseEntity<OrderDto> update(
            @PathVariable Long orderId,
            @PathVariable Status status) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(orderId, status)
        );
    }
}