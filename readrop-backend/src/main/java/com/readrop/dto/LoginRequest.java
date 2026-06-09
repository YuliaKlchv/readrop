package com.readrop.dto;

/** Body for POST /api/login. */
public record LoginRequest(String email, String password) {
}
