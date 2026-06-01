package com.skilloport.config;

import com.skilloport.model.AppUser;
import com.skilloport.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds the demo login so local/dev runs always have one account:
 * demo@skilloport.app.
 */
@Configuration
@ConditionalOnProperty(name = "app.seed-demo", havingValue = "true")
public class DemoSeeder {

    private static final Logger log = LoggerFactory.getLogger(DemoSeeder.class);

    private static final String DEMO_NAME = "Demo Admin";
    private static final String DEMO_EMAIL = "demo@skilloport.app";
    private static final String DEMO_PASSWORD = "SkillOportDemo123!";
    private static final String DEMO_PLAN = "pro";

    @Bean
    CommandLineRunner seedDemo(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (users.existsByEmail(DEMO_EMAIL)) {
                return;
            }
            users.save(new AppUser(DEMO_NAME, DEMO_EMAIL, encoder.encode(DEMO_PASSWORD), DEMO_PLAN));
            log.info("Seeded demo account {}", DEMO_EMAIL);
        };
    }
}
