package com.intellimart.repos;

import com.intellimart.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    boolean existsByEmail(String email);   
    boolean existsByNumber(String number);

}
