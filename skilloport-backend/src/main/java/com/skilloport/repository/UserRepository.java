package com.skilloport.repository;

import com.skilloport.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {

    // The email column is COLLATE NOCASE, so these comparisons are case-insensitive.
    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);
}
