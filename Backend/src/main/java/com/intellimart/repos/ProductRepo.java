package com.intellimart.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.intellimart.entities.Product;
import com.intellimart.entities.ProductCategory;

public interface ProductRepo extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findAllByIsDeletedFalse();
    Optional<Product> findByIdAndIsDeletedFalse(Long id);
    Page<Product> findAllByIsDeletedFalse(Pageable pageable);
    List<Product> findByPcategoryAndIsDeletedFalse(ProductCategory pcategory);
    
    // ✅ SELLER PRODUCTS
    List<Product> findBySeller_IdAndIsDeletedFalse(Long sellerId);
    List<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);
}