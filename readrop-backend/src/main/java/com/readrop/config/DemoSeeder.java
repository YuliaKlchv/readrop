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

    private static final String DEMO_NAME = "Demo User";
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

            books.save(new Book("The Midnight Library", "Matt Haig",
                    "Fiction", "GOOD",
                    "A clean copy for someone who enjoys emotional and thoughtful fiction.",
                    "Vienna", demo.getId()));

            books.save(new Book("Atomic Habits", "James Clear",
                    "Self-Improvement", "GREAT",
                    "Lightly used copy. A practical book about building better habits.",
                    "Vienna", demo.getId()));

            books.save(new Book("The Alchemist", "Paulo Coelho",
                    "Fiction", "GOOD",
                    "Small paperback edition, easy to carry and perfect for a quick inspiring read.",
                    "Vienna", demo.getId()));

            books.save(new Book("Clean Code", "Robert C. Martin",
                    "Technology", "WORN",
                    "Used developer book with some notes inside. Helpful for beginner software developers.",
                    "Vienna", demo.getId()));

            books.save(new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling",
                    "Fantasy", "GOOD",
                    "English edition with a slightly worn cover, but all pages are complete.",
                    "Vienna", demo.getId()));

            books.save(new Book("Die Verwandlung", "Franz Kafka",
                    "Classic", "GOOD",
                    "A short German classic in good readable condition.",
                    "Vienna", demo.getId()));

            books.save(new Book("Pride and Prejudice", "Jane Austen",
                    "Classic", "GREAT",
                    "Nice edition for readers who enjoy classic literature and social drama.",
                    "Vienna", demo.getId()));

            books.save(new Book("To Kill a Mockingbird", "Harper Lee",
                    "Classic", "GOOD",
                    "Readable English classic, suitable for literature lovers.",
                    "Vienna", demo.getId()));

            log.info("Seeded 12 demo book listings");
        };
    }
}
