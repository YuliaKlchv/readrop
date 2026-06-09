package com.readrop.repository;

import com.readrop.model.BookClaim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookClaimRepository extends JpaRepository<BookClaim, Long> {

    List<BookClaim> findByBookId(Long bookId);

    List<BookClaim> findByClaimerId(Long claimerId);
}
