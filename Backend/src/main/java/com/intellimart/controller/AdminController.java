package com.intellimart.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellimart.dto.*;
import com.intellimart.entities.Status;
import com.intellimart.service.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final SellerServiceInterface sellerService;
    private final OrderServiceInterface orderService;
    private final PaymentServiceInterface paymentService;
    private final ProductServiceInterface productService;
    private final CustomerServiceinterface customerService;

    // ================= PRODUCTS =================

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> products() {
        return ResponseEntity.ok(productService.getAllProducts(0, 500));
    }

    // ✅ FIXED: Supports Multipart for Image Choosing
    @PutMapping(value = "/products/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ProductDto> updateProductByAdmin(
            @PathVariable Long id,
            @RequestPart("data") String productDtoJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductDto dto = mapper.readValue(productDtoJson, ProductDto.class);
            return ResponseEntity.ok(productService.updateProductByAdmin(id, dto, image));
        } catch (Exception e) {
            throw new RuntimeException("Asset sync failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse> deleteProductByAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, productService.deleteProductByAdmin(id)));
    }

    // ================= SELLERS =================

    @GetMapping("/sellers")
    public ResponseEntity<List<SellerDto>> sellers() {
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    @PutMapping("/sellers/{id}")
    public ResponseEntity<?> updateSeller(@PathVariable Long id, @RequestBody SellerDto dto) {
        try {
            return ResponseEntity.ok(sellerService.updateSeller(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/sellers/{id}")
    public ResponseEntity<?> deleteSeller(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, sellerService.deleteSeller(id)));
    }

    // ================= CUSTOMERS =================

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDto>> customers() {
        return ResponseEntity.ok(customerService.getallcustomers());
    }

    // ✅ ADDED: Admin Customer Update Mapping
    @PutMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDto dto) {
        try {
            return ResponseEntity.ok(new ApiResponse(true, customerService.updatecustomer(id, dto)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ✅ ADDED: Admin Customer Delete Mapping
    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, customerService.deletecustomer(id)));
    }

    // ================= ORDERS =================

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> orders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ ADDED: Admin Order Trace Mapping
    @GetMapping("/orders/customer/{customerId}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getCustomerOrdersById(customerId));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            String normalized = status.trim().replace(" ", "").toUpperCase();
            Status st = Status.valueOf(normalized);
            return ResponseEntity.ok(orderService.updateOrderStatus(orderId, st));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Invalid status: " + status));
        }
    }

    // ================= PAYMENTS =================

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentDto>> payments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}