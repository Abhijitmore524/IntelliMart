package com.intellimart.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.intellimart.entities.Orders;

@Repository
public interface OrderRepo extends JpaRepository<Orders, Long> {

    List<Orders> findByCustomer_IdAndIsDeletedFalse(Long customerId);

    List<Orders> findByIsDeletedFalse();

    @Query("""
        SELECT DISTINCT o FROM Orders o
        JOIN o.lineItems li
        JOIN li.product p
        WHERE p.seller.id = :sellerId
        AND o.isDeleted = false
    """)
    List<Orders> findOrdersBySeller(@Param("sellerId") Long sellerId);

    @Query("SELECT o FROM Orders o WHERE o.customer.id = :customerId AND o.isDeleted = false")
    List<Orders> findByCustomerId(@Param("customerId") Long customerId);

    List<Orders> findByCustomer_User_Email(String email);

    boolean existsByOrderIdAndIsDeletedFalse(Long orderId);
}
