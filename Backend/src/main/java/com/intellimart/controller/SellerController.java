package com.intellimart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.intellimart.dto.ProductDto;
import com.intellimart.dto.SellerOrderDto;
import com.intellimart.service.OrderServiceInterface;
import com.intellimart.service.ProductServiceInterface;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_SELLER')")
public class SellerController {

    private final OrderServiceInterface orderService;
    private final ProductServiceInterface productService;

    // ================= SELLER ORDERS =================

    @GetMapping("/orders")
    public ResponseEntity<List<SellerOrderDto>> sellerOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getSellerOrdersByAuth(auth));
    }

    // ================= SELLER PRODUCTS =================

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> sellerProducts(Authentication auth) {
        return ResponseEntity.ok(productService.getSellerProducts(auth));
    }

    // ✅ CREATE PRODUCT (multipart)
    @PostMapping(value = "/products", consumes = "multipart/form-data")
    public ResponseEntity<ProductDto> addProduct(
            Authentication auth,
            @RequestPart("data") ProductDto dto,
            @RequestPart("image") MultipartFile image) {

        return ResponseEntity.ok(productService.addProduct(auth, dto, image));
    }

    // ✅ UPDATE PRODUCT (multipart)
    @PutMapping(value = "/products/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ProductDto> updateProduct(
            Authentication auth,
            @PathVariable Long id,
            @RequestPart("data") ProductDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return ResponseEntity.ok(productService.updateProduct(auth, id, dto, image));
    }

    // DELETE PRODUCT
    @DeleteMapping("/products/{id}")
    public ResponseEntity<String> deleteProduct(
            Authentication auth,
            @PathVariable Long id) {

        return ResponseEntity.ok(productService.deleteProduct(auth, id));
    }
}
