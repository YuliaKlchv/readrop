package com.readrop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** A request from a user to claim a free book. */
@Entity
@Table(name = "book_claims")
public class BookClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "claimer_id", nullable = false)
    private Long claimerId;

    @Column(length = 400)
    private String message;

    /** PENDING, ACCEPTED, or REJECTED. */
    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    protected BookClaim() {
    }

    public BookClaim(Long bookId, Long claimerId, String message) {
        this.bookId = bookId;
        this.claimerId = claimerId;
        this.message = message;
        this.status = "PENDING";
    }

    public Long getId() { return id; }
    public Long getBookId() { return bookId; }
    public Long getClaimerId() { return claimerId; }
    public String getMessage() { return message; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setStatus(String status) {
        this.status = status;
    }
}
