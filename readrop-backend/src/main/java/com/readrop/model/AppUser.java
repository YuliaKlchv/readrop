package com.readrop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    /** Stored lower-cased so uniqueness is effectively case-insensitive. */
    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hash — never exposed to clients. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String plan;

    @Column
    private String city;

    /** Filled by the DB default (CURRENT_TIMESTAMP). */
    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    protected AppUser() {
    }

    public AppUser(String name, String email, String passwordHash, String plan) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.plan = plan;
    }

    public AppUser(String name, String email, String passwordHash, String plan, String city) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.plan = plan;
        this.city = city;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getPlan() {
        return plan;
    }

    public String getCity() {
        return city;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
