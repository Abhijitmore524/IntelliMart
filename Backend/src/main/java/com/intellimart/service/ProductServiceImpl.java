package com.intellimart.service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.intellimart.dto.ProductDto;
import com.intellimart.entities.*;
import com.intellimart.repos.*;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductServiceInterface {

    private final ProductRepo productRepo;
    private final SellerRepo sellerRepo;
    private final UserRepo userRepo;
    private final Cloudinary cloudinary;

    @Override
    public List<ProductDto> getAllProducts(int page, int size) {
        return productRepo.findAllByIsDeletedFalse(PageRequest.of(page, size))
                .getContent()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<ProductDto> getProductsByCategory(ProductCategory category) {
        return productRepo.findByPcategoryAndIsDeletedFalse(category)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Long id) {
        // ✅ FETCH LOGIC: Only finds products that are not marked as deleted
        Product product = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product node not found in inventory"));
        return toDto(product);
    }

    @Override
    public List<ProductDto> searchProducts(String query, String category, Double minPrice, Double maxPrice, String sortBy) {
        Specification<Product> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("isDeleted"), false));

            if (query != null && !query.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"));
            }
            if (category != null && !category.trim().isEmpty()) {
                try {
                    predicates.add(cb.equal(root.get("pcategory"), ProductCategory.valueOf(category.toUpperCase())));
                } catch (IllegalArgumentException e) {}
            }
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.by("price").ascending();
        if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("id").descending();
        }

        return productRepo.findAll(spec, sort).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProducts(String query) {
        return productRepo.findByNameContainingIgnoreCaseAndIsDeletedFalse(query)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto addProduct(Authentication auth, ProductDto dto, MultipartFile image) {
        Seller seller = getSellerFromAuth(auth);
        String imageUrl = uploadToCloudinary(image);
        Product p = new Product();
        p.setName(dto.getName());
        p.setPcategory(ProductCategory.valueOf(dto.getPcategory().toUpperCase()));
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setDescription(dto.getDescription());
        p.setSeller(seller);
        p.setDeleted(false);
        p.setImageUrl(imageUrl);
        return toDto(productRepo.save(p));
    }

    @Override
    public ProductDto updateProduct(Authentication auth, Long id, ProductDto dto, MultipartFile image) {
        Product p = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        validateOwnership(auth, p);
        p.setName(dto.getName());
        p.setPcategory(ProductCategory.valueOf(dto.getPcategory().toUpperCase()));
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setDescription(dto.getDescription());
        if (image != null && !image.isEmpty()) {
            p.setImageUrl(uploadToCloudinary(image));
        }
        return toDto(productRepo.save(p));
    }

    @Override
    public String deleteProduct(Authentication auth, Long id) {
        Product p = productRepo.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        validateOwnership(auth, p);
        p.setDeleted(true);
        productRepo.save(p);
        return "Product deleted";
    }

    @Override
    public List<ProductDto> getSellerProducts(Authentication auth) {
        Seller seller = getSellerFromAuth(auth);
        return productRepo.findBySeller_IdAndIsDeletedFalse(seller.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProductDto updateProductByAdmin(Long id, ProductDto dto, MultipartFile image) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setName(dto.getName());
        p.setPcategory(ProductCategory.valueOf(dto.getPcategory().toUpperCase()));
        p.setPrice(dto.getPrice());
        p.setUnitsAvailable(dto.getUnitsAvailable());
        p.setDescription(dto.getDescription());
        if (image != null && !image.isEmpty()) {
            p.setImageUrl(uploadToCloudinary(image));
        }
        return toDto(productRepo.save(p));
    }

    @Override
    public String deleteProductByAdmin(Long id) {
        Product p = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setDeleted(true);
        productRepo.save(p);
        return "Product deleted by admin";
    }

    private String uploadToCloudinary(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            Map<?, ?> res = cloudinary.uploader().upload(file.getBytes(), Map.of());
            return res.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary Upload Failure: " + e.getMessage());
        }
    }

    private Seller getSellerFromAuth(Authentication auth) {
        User user = userRepo.findByEmailAndIsDeletedFalse(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sellerRepo.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Seller profile not linked to user"));
    }

    private void validateOwnership(Authentication auth, Product p) {
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return;
        Seller seller = getSellerFromAuth(auth);
        if (!p.getSeller().getId().equals(seller.getId()))
            throw new RuntimeException("Unauthorized Access: Asset Ownership Mismatch");
    }

    // ✅ FINAL CORRECTED MAPPER
    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        if (p.getPcategory() != null) dto.setPcategory(p.getPcategory().name());
        dto.setPrice(p.getPrice());
        dto.setUnitsAvailable(p.getUnitsAvailable());
        dto.setImageUrl(p.getImageUrl());
        dto.setDescription(p.getDescription());

        if (p.getSeller() != null) {
            dto.setSellerId(p.getSeller().getId());
            // Fixed undefined method getFirstName error by using getName()
            if (p.getSeller().getUser() != null) {
                dto.setSellerName(p.getSeller().getUser().getName());
            }
        }
        return dto;
    }
}