package com.intellimart.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.intellimart.dto.CustomerDto;
import com.intellimart.dto.UserDto;
import com.intellimart.entities.Customer;
import com.intellimart.entities.Roles;
import com.intellimart.entities.User;
import com.intellimart.repos.CustomerRepo;
import com.intellimart.repos.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceimpl implements CustomerServiceinterface {

    private final CustomerRepo customerRepo;
    private final UserRepo userRepo;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;

    // ================= FIND BY ID (ADMIN) =================

    @Override
    public CustomerDto findById(Long id) {
        Customer customer = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toDto(customer);
    }

    // ================= REGISTER =================

    @Override
    public String addcustomer(CustomerDto dto) {
        // 1. Check for Duplicate Email
        if (userRepo.existsByEmail(dto.getUser().getEmail())) {
            throw new RuntimeException("Email already registered. Please use a different identity.");
        }

        // 2. ✅ NEW: Check for Duplicate Phone Number
        if (userRepo.existsByNumber(dto.getUser().getNumber())) {
            throw new RuntimeException("Phone number already exists in system records. Please change the number.");
        }

        UserDto uDto = dto.getUser();
        User user = new User();
        user.setName(uDto.getName());
        user.setEmail(uDto.getEmail());
        user.setNumber(uDto.getNumber());
        user.setGender(uDto.getGender());
        user.setPassword(passwordEncoder.encode(uDto.getPassword()));
        user.setRole(Roles.ROLE_CUSTOMER);
        user.setIsDeleted(false);

        User savedUser = userRepo.save(user);

        Customer customer = new Customer();
        customer.setUser(savedUser); 
        customer.setDeleted(false);
        customerRepo.save(customer);

        return "Customer registered successfully";
    }

    // ================= GET ALL =================

    @Override
    public List<CustomerDto> getallcustomers() {
        return customerRepo.findAllByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ================= DELETE =================

    @Override
    public String deletecustomer(Long id) {
        Customer c = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));
        c.setDeleted(true);
        if (c.getUser() != null) {
            c.getUser().setIsDeleted(true);
        }
        return "Customer deleted";
    }

    // ================= UPDATE BY ID =================

    @Override
    public String updatecustomer(Long id, CustomerDto dto) {
        Customer c = customerRepo.findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();
        UserDto ud = dto.getUser();
        if (ud != null) {
            if (ud.getName() != null) u.setName(ud.getName());
            if (ud.getNumber() != null) u.setNumber(ud.getNumber());
            if (ud.getGender() != null) u.setGender(ud.getGender());
            if (ud.getEmail() != null) u.setEmail(ud.getEmail());
            userRepo.save(u);
        }
        return "Updated";
    }

    // ================= FIND BY EMAIL =================

    @Override
    public CustomerDto findByEmail(String email) {
        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return toDto(c);
    }

    // ================= UPDATE BY EMAIL (FOR /ME ENDPOINT) =================

    @Override
    public String updateByEmail(String email, CustomerDto dto) {
        Customer c = customerRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User u = c.getUser();
        UserDto ud = dto.getUser();
        
        if (ud != null) {
            if (ud.getName() != null) u.setName(ud.getName());
            if (ud.getNumber() != null) u.setNumber(ud.getNumber());
            if (ud.getGender() != null) u.setGender(ud.getGender());
            if (ud.getEmail() != null) u.setEmail(ud.getEmail());
            userRepo.save(u);
        }
        return "Customer updated successfully";
    }

    // ================= FORGOT PASSWORD VERIFICATION =================

    @Override
    public void verifyEmailExists(String email) {
        // ✅ UPDATED: Only verify if the account is ACTIVE (not soft-deleted)
        userRepo.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("Account identity not found or deactivated."));
    }

    // ================= DTO MAPPER =================

    private CustomerDto toDto(Customer c) {
        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId()); 

        User u = c.getUser();
        if (u != null) {
            UserDto ud = new UserDto();
            ud.setId(u.getId());
            ud.setName(u.getName());
            ud.setEmail(u.getEmail());
            ud.setNumber(u.getNumber());
            ud.setGender(u.getGender());
            dto.setUser(ud);
        }
        return dto;
    }
}