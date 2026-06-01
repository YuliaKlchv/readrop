package com.skilloport.repository;

import com.skilloport.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    Optional<Lead> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Lead> findByConvertedAtIsNull();
}
