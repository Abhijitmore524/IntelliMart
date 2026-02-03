package com.intellimart.service;

import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import com.intellimart.dto.ProductDto;
import com.intellimart.entities.ProductCategory;

public interface ProductServiceInterface {

    // ================= STANDARD RETRIEVAL =================
    List<ProductDto> getAllProducts(int page, int size);
    List<ProductDto> getProductsByCategory(ProductCategory category);
    ProductDto getProductById(Long id);

    // ================= SEARCH & FILTER =================
    // ✅ Rich filtering used by the main search controller
    List<ProductDto> searchProducts(String query, String category, Double minPrice, Double maxPrice, String sortBy);
    
    // ✅ Simple search signature to resolve Implementation @Override errors
    List<ProductDto> searchProducts(String query);

    // ================= SELLER OPS =================
    ProductDto addProduct(Authentication auth, ProductDto dto, MultipartFile image);
    ProductDto updateProduct(Authentication auth, Long id, ProductDto dto, MultipartFile image);
    String deleteProduct(Authentication auth, Long id);
    List<ProductDto> getSellerProducts(Authentication auth);

    // ================= ADMIN OPS =================
    ProductDto updateProductByAdmin(Long id, ProductDto dto, MultipartFile image);
    String deleteProductByAdmin(Long id);
}