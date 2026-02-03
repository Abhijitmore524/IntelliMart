package com.intellimart.repos;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.intellimart.entities.CartItem;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Product;

public interface CartRepo extends JpaRepository<CartItem, Long> {
    
    // ✅ Crucial for checkout: Finds all active items for Customer 207
    List<CartItem> findByCustomer_IdAndIsDeletedFalse(Long customerId);

    // ✅ Bridge lookup: Finds items directly using User ID 120
    List<CartItem> findByCustomer_User_IdAndIsDeletedFalse(Long userId);

    // ✅ Prevents duplicate rows: Finds a specific active product for a customer
    Optional<CartItem> findByCustomerAndProductAndIsDeletedFalse(Customer customer, Product product);
}