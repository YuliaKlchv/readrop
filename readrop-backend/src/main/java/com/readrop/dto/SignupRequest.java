package com.readrop.dto;

/** Body for POST /api/signup. */
public record SignupRequest(String name, String email, String password, String city) {
}
