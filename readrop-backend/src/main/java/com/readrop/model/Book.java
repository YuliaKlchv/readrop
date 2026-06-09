package com.readrop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** A book listed for free giveaway by a registered user. */
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String genre;

    /** GREAT, GOOD, or WORN. */
    @Column(nullable = false)
    private String condition;

    @Column(length = 600)
    private String description;

    @Column(nullable = false)
    private String city;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    /** AVAILABLE or CLAIMED. */
    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    protected Book() {
    }

    public Book(String title, String author, String genre, String condition,
                String description, String city, Long ownerId) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.condition = condition;
        this.description = description;
        this.city = city;
        this.ownerId = ownerId;
        this.status = "AVAILABLE";
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getGenre() { return genre; }
    public String getCondition() { return condition; }
    public String getDescription() { return description; }
    public String getCity() { return city; }
    public Long getOwnerId() { return ownerId; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void setStatus(String status) {
        this.status = status;
    }
}
