package com.readrop.dto;

/** Body for POST /api/books — list a book for giveaway. */
public record CreateBookRequest(String title, String author, String genre, String condition,
                                String description, String city) {
}
