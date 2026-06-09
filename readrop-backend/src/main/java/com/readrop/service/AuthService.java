package com.readrop.service;

import com.readrop.dto.LoginRequest;
import com.readrop.dto.SignupRequest;
import com.readrop.error.ApiException;
import com.readrop.model.AppUser;
import com.readrop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

/** User registration, authentication and lookup. */
@Service
public class AuthService {

    private static final String INVALID_CREDENTIALS = "Invalid email or password";

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AppUser signup(SignupRequest request) {
        SignupRequest r = request == null ? new SignupRequest(null, null, null, null) : request;

        if (isBlank(r.name())) {
            throw ApiException.badRequest("Please enter your name.");
        }
        if (!Validation.emailOk(r.email())) {
            throw ApiException.badRequest("Please enter a valid email address.");
        }
        String pwProblem = Validation.passwordProblem(r.password());
        if (pwProblem != null) {
            throw ApiException.badRequest(pwProblem);
        }

        String email = normalize(r.email());
        if (users.existsByEmail(email)) {
            throw ApiException.conflict("An account with this email already exists.");
        }

        return users.save(new AppUser(r.name().trim(), email,
                passwordEncoder.encode(r.password()), "member", r.city()));
    }

    @Transactional(readOnly = true)
    public AppUser login(LoginRequest request) {
        String email = request == null ? null : request.email();
        String password = request == null ? null : request.password();
        if (!Validation.emailOk(email) || isBlank(password)) {
            throw ApiException.unauthorized(INVALID_CREDENTIALS);
        }
        AppUser user = users.findByEmail(normalize(email))
                .orElseThrow(() -> ApiException.unauthorized(INVALID_CREDENTIALS));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw ApiException.unauthorized(INVALID_CREDENTIALS);
        }
        return user;
    }

    @Transactional(readOnly = true)
    public AppUser requireUser(Long uid) {
        if (uid == null) {
            throw ApiException.unauthorized("Not authenticated");
        }
        return users.findById(uid)
                .orElseThrow(() -> ApiException.unauthorized("Not authenticated"));
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
