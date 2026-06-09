package com.readrop.security;

/** Authenticated identity carried in the JWT payload as { uid }. */
public record UserPrincipal(Long uid) {
}
