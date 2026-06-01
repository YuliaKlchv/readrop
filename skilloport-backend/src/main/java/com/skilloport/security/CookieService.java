package com.skilloport.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

/** Builds the auth cookie used by the SkillOport session flow. */
@Service
public class CookieService {

    private final String cookieName;
    private final boolean secure;
    private final long maxAgeSeconds;

    public CookieService(
            @Value("${app.cookie.name}") String cookieName,
            @Value("${app.cookie.secure}") boolean secure,
            @Value("${app.jwt.expires-days}") long expiresDays) {
        this.cookieName = cookieName;
        this.secure = secure;
        this.maxAgeSeconds = expiresDays * 24 * 60 * 60;
    }

    public ResponseCookie build(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .sameSite("Lax")
                .secure(secure)
                .path("/")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .sameSite("Lax")
                .secure(secure)
                .path("/")
                .maxAge(0)
                .build();
    }
}
