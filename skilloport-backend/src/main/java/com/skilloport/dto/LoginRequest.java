package com.skilloport.dto;

/** Body for POST /api/auth/login. */
public record LoginRequest(String email, String password) {
}
