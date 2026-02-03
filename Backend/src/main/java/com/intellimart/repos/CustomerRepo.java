package com.intellimart.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.Customer;

public interface CustomerRepo extends JpaRepository<Customer, Long> {

    Optional<Customer> findByIdAndIsDeletedFalse(Long id);

    List<Customer> findAllByIsDeletedFalse();

    Optional<Customer> findByUser_Email(String email);

    // ✅ NEW: Find the customer record linked to a specific User ID
    Optional<Customer> findByUser_Id(Long userId);
}