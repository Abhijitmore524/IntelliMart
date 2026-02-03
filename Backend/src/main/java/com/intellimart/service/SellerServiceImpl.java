package com.intellimart.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.intellimart.dto.SellerDto;
import com.intellimart.dto.UserDto;
import com.intellimart.entities.Roles;
import com.intellimart.entities.Seller;
import com.intellimart.entities.User;
import com.intellimart.repos.SellerRepo;
import com.intellimart.repos.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SellerServiceImpl implements SellerServiceInterface {

    private final SellerRepo sellerRepository;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;

    // ================= CREATE =================

    @Override
    public String addSeller(SellerDto dto) {

        if (userRepository.existsByEmail(dto.getUser().getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(dto.getUser().getName());
        user.setEmail(dto.getUser().getEmail());
        user.setNumber(dto.getUser().getNumber());
        user.setGender(dto.getUser().getGender());
        user.setPassword(passwordEncoder.encode(dto.getUser().getPassword()));
        user.setRole(Roles.ROLE_SELLER);

        Seller seller = new Seller();
        seller.setCompanyName(dto.getCompanyName());
        seller.setUser(user);
        seller.setDeleted(false);

        sellerRepository.save(seller);

        return "Seller created successfully";
    }

    // ================= READ =================

    @Override
    public List<SellerDto> getAllSellers() {

        return sellerRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ================= UPDATE =================

    @Override
    public SellerDto updateSeller(Long id, SellerDto dto) {

        Seller s = sellerRepository.findById(id).orElseThrow();

        s.setCompanyName(dto.getCompanyName());

        if (s.getUser() != null && dto.getUser() != null) {
            s.getUser().setName(dto.getUser().getName());
            s.getUser().setEmail(dto.getUser().getEmail());
            s.getUser().setNumber(dto.getUser().getNumber());
            s.getUser().setGender(dto.getUser().getGender());
        }

        return toDto(sellerRepository.save(s));
    }

    // ================= DELETE =================

    @Override
    public String deleteSeller(Long id) {

        Seller s = sellerRepository.findById(id).orElseThrow();

        s.setDeleted(true);

        if (s.getUser() != null) {
            s.getUser().setIsDeleted(true);
        }

        sellerRepository.save(s);

        return "Seller deleted";
    }

    // ================= MAPPER =================

    private SellerDto toDto(Seller seller) {

        SellerDto dto = new SellerDto();
        dto.setId(seller.getId());
        dto.setCompanyName(seller.getCompanyName());

        if (seller.getUser() != null) {
            User u = seller.getUser();

            UserDto ud = new UserDto();
            ud.setName(u.getName());
            ud.setEmail(u.getEmail());
            ud.setNumber(u.getNumber());
            ud.setGender(u.getGender());

            dto.setUser(ud);
        }

        return dto;
    }
}
