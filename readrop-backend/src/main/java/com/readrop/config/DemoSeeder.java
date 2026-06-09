package com.readrop.config;

import com.readrop.model.AppUser;
import com.readrop.model.Book;
import com.readrop.repository.BookRepository;
import com.readrop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Seeds demo account and sample book listings on startup. */
@Configuration
@ConditionalOnProperty(name = "app.seed-demo", havingValue = "true")
public class DemoSeeder {

    private static final Logger log = LoggerFactory.getLogger(DemoSeeder.class);

    private static final String DEMO_NAME = "Demo Admin";
    private static final String DEMO_EMAIL = "demo@readrop.app";
    private static final String DEMO_PASSWORD = "ReadropDemo123!";
    private static final String DEMO_CITY = "Berlin";

    @Bean
    CommandLineRunner seedDemo(UserRepository users, BookRepository books,
                               PasswordEncoder encoder) {
        return args -> {
            if (users.existsByEmail(DEMO_EMAIL)) {
                return;
            }
            AppUser demo = users.save(new AppUser(DEMO_NAME, DEMO_EMAIL,
                    encoder.encode(DEMO_PASSWORD), "member", DEMO_CITY));
            log.info("Seeded demo account {}", DEMO_EMAIL);

            books.save(new Book("The Hitchhiker's Guide to the Galaxy", "Douglas Adams",
                    "Sci-Fi", "GOOD", "A classic. All 5 parts of the trilogy included.", "Berlin",
                    demo.getId()));
            books.save(new Book("Sapiens", "Yuval Noah Harari",
                    "Non-Fiction", "GREAT", "Barely read, excellent condition.", "Berlin",
                    demo.getId()));
            books.save(new Book("1984", "George Orwell",
                    "Dystopia", "WORN", "Well-loved copy. Still very readable.", "Hamburg",
                    demo.getId()));
            books.save(new Book("Dune", "Frank Herbert",
                    "Sci-Fi", "GOOD", null, "Munich", demo.getId()));
            log.info("Seeded 4 demo book listings");
        };
    }
}
