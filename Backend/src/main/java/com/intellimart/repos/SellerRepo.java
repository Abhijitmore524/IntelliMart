package com.intellimart.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intellimart.entities.Seller;

@Repository
public interface SellerRepo extends JpaRepository<Seller, Long> {

    // check duplicate company name
    boolean existsByCompanyName(String companyName);

    // used when seller adds products
    Optional<Seller> findByUser_Id(Long userId);

    // admin listing
    List<Seller> findByIsDeletedFalse();

    // ✅ JWT based lookup (for seller payments + orders)
    Optional<Seller> findByUser_Email(String email);
}
