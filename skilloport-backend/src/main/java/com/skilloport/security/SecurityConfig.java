package com.skilloport.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Map;

@Configuration
public class SecurityConfig {

    private final JwtCookieFilter jwtCookieFilter;

    @Value("${app.bcrypt.strength}")
    private int bcryptStrength;

    public SecurityConfig(JwtCookieFilter jwtCookieFilter) {
        this.jwtCookieFilter = jwtCookieFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(fo -> fo.sameOrigin()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Only these two endpoints require an authenticated session.
                        .requestMatchers("/api/me", "/api/subscribers").authenticated()
                        // Everything else stays open: public API endpoints, the static
                        // SPA, and unknown API paths handled by the fallback controller.
                        .anyRequest().permitAll())
                // Return JSON 401 instead of redirecting to a login page.
                .exceptionHandling(eh -> eh.authenticationEntryPoint(jsonUnauthorizedEntryPoint()))
                .addFilterBefore(jwtCookieFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** Emits {"error":"Not authenticated"} with 401, matching the Node middleware. */
    private AuthenticationEntryPoint jsonUnauthorizedEntryPoint() {
        ObjectMapper mapper = new ObjectMapper();
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            mapper.writeValue(response.getOutputStream(), Map.of("error", "Not authenticated"));
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt cost 12, matching the Node bcryptjs hashes stored in the DB.
        return new BCryptPasswordEncoder(bcryptStrength);
    }
}
