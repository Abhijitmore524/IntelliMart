package com.intellimart.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.intellimart.entities.User;
import com.intellimart.repos.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserServiceInterface {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void resetPassword(String email, String newPass) {
        // ✅ Ignores soft-deleted users
        User user = userRepo.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("Active identity not found for this email."));

        user.setPassword(passwordEncoder.encode(newPass));
        userRepo.save(user);
    }
}