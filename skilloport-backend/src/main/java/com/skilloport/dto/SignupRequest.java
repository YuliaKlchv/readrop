package com.skilloport.dto;

/** Body for POST /api/signup — validated manually to preserve API error text. */
public record SignupRequest(String name, String email, String password, String plan) {
}
