package com.readrop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HexFormat;

/** Issues and verifies HS256 session tokens. Payload: { uid, iat, exp }. */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final SecretKey key;
    private final long expiresMs;

    public JwtService(
            @Value("${app.data-dir}") String dataDir,
            @Value("${app.jwt.secret:}") String configuredSecret,
            @Value("${app.jwt.expires-days}") long expiresDays) {
        this.expiresMs = expiresDays * 24L * 60L * 60L * 1000L;
        this.key = Keys.hmacShaKeyFor(resolveSecret(configuredSecret, Path.of(dataDir)));
        log.info("JWT service initialized (HS256)");
    }

    public String sign(Long uid) {
        Date now = new Date();
        return Jwts.builder()
                .claim("uid", uid)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiresMs))
                .signWith(key)
                .compact();
    }

    /** Returns the principal if the token is valid, otherwise null. */
    public UserPrincipal verify(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token).getPayload();
            Number uid = claims.get("uid", Number.class);
            return uid == null ? null : new UserPrincipal(uid.longValue());
        } catch (Exception e) {
            return null;
        }
    }

    private static byte[] resolveSecret(String configuredSecret, Path dataDir) {
        if (configuredSecret != null && !configuredSecret.isBlank()) {
            return validateSecret(configuredSecret.trim().getBytes(StandardCharsets.UTF_8));
        }
        return loadOrCreateSecret(dataDir);
    }

    private static byte[] loadOrCreateSecret(Path dataDir) {
        try {
            Files.createDirectories(dataDir);
            Path secretFile = dataDir.resolve(".jwtsecret");
            String secret;
            if (Files.exists(secretFile)) {
                secret = Files.readString(secretFile, StandardCharsets.UTF_8).trim();
            } else {
                byte[] random = new byte[32];
                SECURE_RANDOM.nextBytes(random);
                secret = HexFormat.of().formatHex(random);
                Files.writeString(secretFile, secret, StandardCharsets.UTF_8);
                trySetOwnerReadWrite(secretFile);
            }
            return validateSecret(secret.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Could not load/create JWT secret", e);
        }
    }

    private static byte[] validateSecret(byte[] bytes) {
        if (bytes.length < 32) {
            throw new IllegalStateException(
                    "JWT secret must be at least 32 bytes for HS256; got " + bytes.length);
        }
        return bytes;
    }

    private static void trySetOwnerReadWrite(Path file) {
        try {
            Files.setPosixFilePermissions(file, PosixFilePermissions.fromString("rw-------"));
        } catch (UnsupportedOperationException | java.io.IOException ignored) {
            // non-POSIX filesystem; best effort
        }
    }
}
