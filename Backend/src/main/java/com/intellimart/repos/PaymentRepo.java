package com.intellimart.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.intellimart.entities.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

    // ✅ CUSTOMER BRIDGE: Navigate Payment -> Order -> Customer -> User (ID 120)
    List<Payment> findByOrder_Customer_User_Id(Long userId);

    // ✅ CUSTOMER BRIDGE: Find by User Email
    List<Payment> findByOrder_Customer_User_Email(String email);

    // ✅ SELLER BRIDGE: Custom query to find payments for a specific seller's items
    @Query("SELECT DISTINCT p FROM Payment p JOIN p.order o JOIN o.lineItems li WHERE li.product.seller.id = :sellerId")
    List<Payment> findPaymentsBySeller(@Param("sellerId") Long sellerId);

    // Standard lookup by Customer record (ID 207)
    List<Payment> findByOrder_Customer_Id(Long customerId);
}