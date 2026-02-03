package com.intellimart.service;

import java.util.List;
import com.intellimart.dto.CustomerDto;

public interface CustomerServiceinterface {

    CustomerDto findById(Long id);

    String addcustomer(CustomerDto dto);

    List<CustomerDto> getallcustomers();

    String deletecustomer(Long id);

    String updatecustomer(Long id, CustomerDto customerDto);

    CustomerDto findByEmail(String email);

    String updateByEmail(String email, CustomerDto dto);
    
    // ✅ NEW: Verify if account node exists
    void verifyEmailExists(String email);
}