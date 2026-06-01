package com.skilloport.web;

import com.skilloport.dto.ForgotRequest;
import com.skilloport.dto.LoginRequest;
import com.skilloport.dto.PublicUser;
import com.skilloport.dto.SignupRequest;
import com.skilloport.model.AppUser;
import com.skilloport.security.CookieService;
import com.skilloport.security.JwtService;
import com.skilloport.security.UserPrincipal;
import com.skilloport.service.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Thin HTTP layer for auth — delegates all rules to {@link AuthService}. */
@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, JwtService jwtService, CookieService cookieService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.cookieService = cookieService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody(required = false) SignupRequest body) {
        AppUser user = authService.signup(body);
        return withSession(HttpStatus.CREATED, user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) LoginRequest body) {
        AppUser user = authService.login(body);
        return withSession(HttpStatus.OK, user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieService.clear().toString())
                .body(Map.of("ok", true));
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal UserPrincipal principal) {
        AppUser user = authService.requireUser(principal == null ? null : principal.uid());
        return Map.of("user", PublicUser.from(user));
    }

    @PostMapping("/forgot-password")
    public Map<String, Boolean> forgotPassword(@RequestBody(required = false) ForgotRequest body) {
        // Intentionally always succeeds — no account enumeration.
        return Map.of("ok", true);
    }

    private ResponseEntity<Map<String, Object>> withSession(HttpStatus status, AppUser user) {
        String token = jwtService.sign(user.getId());
        return ResponseEntity.status(status)
                .header(HttpHeaders.SET_COOKIE, cookieService.build(token).toString())
                .body(Map.of("user", PublicUser.from(user)));
    }
}
