package com.readrop.dto;

/** Body for POST /api/forgot-password. */
public record ForgotRequest(String email) {
}
