package com.intellimart.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.intellimart.dto.ApiResponse;
import com.intellimart.dto.ProductDto;
import com.intellimart.service.ProductServiceInterface;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceInterface productService;

    // ✅ FIX: Added missing endpoint for fetching a single product node by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "price_asc") String sortBy) {
        return ResponseEntity.ok(productService.searchProducts(query, category, minPrice, maxPrice, sortBy));
    }

    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(Authentication auth,
            @RequestPart("data") ProductDto dto,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(productService.addProduct(auth, dto, image));
    }

    @PreAuthorize("hasAuthority('ROLE_SELLER') or hasAuthority('ROLE_ADMIN')")
    @PutMapping(value="/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProduct(Authentication auth,
            @PathVariable Long id,
            @RequestPart("data") ProductDto dto,
            @RequestPart(value="image", required=false) MultipartFile image) {
        return ResponseEntity.ok(productService.updateProduct(auth, id, dto, image));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping(value = "/admin/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProductAdminJson(
            @PathVariable Long id,
            @RequestPart("data") ProductDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(productService.updateProductByAdmin(id, dto, image));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, productService.deleteProductByAdmin(id)));
    }
}