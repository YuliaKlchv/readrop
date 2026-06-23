package com.readrop.service;

import com.readrop.dto.LoginRequest;
import com.readrop.dto.SignupRequest;
import com.readrop.error.ApiException;
import com.readrop.model.AppUser;
import com.readrop.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository users;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void signup_persists_user_with_normalized_email_and_hashed_password() {
        when(users.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("GoodPass123!")).thenReturn("HASH");
        when(users.save(any(AppUser.class))).thenAnswer(inv -> inv.getArgument(0));

        AppUser saved = authService.signup(
                new SignupRequest("  Alice ", "Alice@Example.com", "GoodPass123!", "Berlin"));

        assertThat(saved.getEmail()).isEqualTo("alice@example.com");
        assertThat(saved.getName()).isEqualTo("Alice");
        assertThat(saved.getPasswordHash()).isEqualTo("HASH");
        assertThat(saved.getPlan()).isEqualTo("member");
    }

    @Test
    void signup_always_assigns_member_plan() {
        when(users.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("HASH");
        when(users.save(any(AppUser.class))).thenAnswer(inv -> inv.getArgument(0));

        AppUser saved = authService.signup(
                new SignupRequest("Bob", "bob@example.com", "GoodPass123!", null));

        assertThat(saved.getPlan()).isEqualTo("member");
    }

    @Test
    void signup_rejects_blank_name() {
        assertThatThrownBy(() -> authService.signup(
                new SignupRequest(" ", "x@example.com", "GoodPass123!", null)))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.BAD_REQUEST);
        verify(users, never()).save(any());
    }

    @Test
    void signup_rejects_weak_password() {
        assertThatThrownBy(() -> authService.signup(
                new SignupRequest("Bob", "bob@example.com", "short", null)))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("at least 12 characters");
    }

    @Test
    void signup_rejects_duplicate_email_with_conflict() {
        when(users.existsByEmail("dup@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(
                new SignupRequest("Dup", "dup@example.com", "GoodPass123!", null)))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void login_succeeds_with_correct_credentials() {
        AppUser user = new AppUser("Bob", "bob@example.com", "HASH", "member");
        when(users.findByEmail("bob@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("GoodPass123!", "HASH")).thenReturn(true);

        AppUser result = authService.login(new LoginRequest("Bob@Example.com", "GoodPass123!"));

        assertThat(result).isSameAs(user);
    }

    @Test
    void login_fails_for_unknown_email() {
        when(users.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(
                new LoginRequest("nobody@example.com", "GoodPass123!")))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void login_fails_for_wrong_password() {
        AppUser user = new AppUser("Bob", "bob@example.com", "HASH", "member");
        when(users.findByEmail("bob@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "HASH")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("bob@example.com", "wrong")))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void login_rejects_blank_password_without_repository_lookup() {
        assertThatThrownBy(() -> authService.login(new LoginRequest("bob@example.com", " ")))
                .isInstanceOf(ApiException.class)
                .hasMessage("Invalid email or password");

        verify(users, never()).findByEmail(anyString());
    }

    @Test
    void requireUser_rejects_missing_uid() {
        assertThatThrownBy(() -> authService.requireUser(null))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
