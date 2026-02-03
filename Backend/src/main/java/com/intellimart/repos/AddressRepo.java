package com.intellimart.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.intellimart.entities.Address;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {

    // Fetch addresses directly by the primary key of the customer record
    List<Address> findByCustomer_Id(Long customerId);

    // Fetch addresses using the User ID linked to the Customer record
    List<Address> findByCustomer_User_Id(Long userId);

    // ✅ FIXED: use aid (not id)
    Optional<Address> findByAidAndCustomer_Id(Long aid, Long customerId);
}
