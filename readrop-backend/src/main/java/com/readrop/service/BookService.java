package com.readrop.service;

import com.readrop.dto.CreateBookRequest;
import com.readrop.error.ApiException;
import com.readrop.model.Book;
import com.readrop.model.BookClaim;
import com.readrop.repository.BookClaimRepository;
import com.readrop.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class BookService {

    private static final Set<String> VALID_CONDITIONS = Set.of("GREAT", "GOOD", "WORN");

    private final BookRepository books;
    private final BookClaimRepository claims;

    public BookService(BookRepository books, BookClaimRepository claims) {
        this.books = books;
        this.claims = claims;
    }

    @Transactional
    public Book createBook(Long ownerId, CreateBookRequest req) {
        if (req == null) req = new CreateBookRequest(null, null, null, null, null, null);

        if (isBlank(req.title())) throw ApiException.badRequest("Title is required.");
        if (isBlank(req.author())) throw ApiException.badRequest("Author is required.");
        if (isBlank(req.genre())) throw ApiException.badRequest("Genre is required.");
        if (isBlank(req.city())) throw ApiException.badRequest("City is required.");

        String condition = req.condition() == null ? "GOOD" : req.condition().trim().toUpperCase();
        if (!VALID_CONDITIONS.contains(condition)) {
            throw ApiException.badRequest("Condition must be GREAT, GOOD, or WORN.");
        }

        String desc = isBlank(req.description()) ? null : req.description().trim();
        Book book = new Book(req.title().trim(), req.author().trim(), req.genre().trim(),
                condition, desc, req.city().trim(), ownerId);
        return books.save(book);
    }

    @Transactional(readOnly = true)
    public List<Book> listBooks(String genre, String city) {
        boolean hasGenre = !isBlank(genre);
        boolean hasCity = !isBlank(city);

        if (hasGenre && hasCity) {
            return books.findByStatusAndGenreIgnoreCaseAndCityIgnoreCaseOrderByCreatedAtDesc(
                    "AVAILABLE", genre, city);
        }
        if (hasGenre) {
            return books.findByStatusAndGenreIgnoreCaseOrderByCreatedAtDesc("AVAILABLE", genre);
        }
        if (hasCity) {
            return books.findByStatusAndCityIgnoreCaseOrderByCreatedAtDesc("AVAILABLE", city);
        }
        return books.findByStatusOrderByCreatedAtDesc("AVAILABLE");
    }

    @Transactional(readOnly = true)
    public List<Book> getMyBooks(Long ownerId) {
        return books.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    @Transactional
    public BookClaim claimBook(Long bookId, Long claimerId, String message) {
        Book book = books.findById(bookId)
                .orElseThrow(() -> ApiException.notFound("Book not found."));

        if (!"AVAILABLE".equals(book.getStatus())) {
            throw ApiException.conflict("This book is no longer available.");
        }
        if (book.getOwnerId().equals(claimerId)) {
            throw ApiException.badRequest("You cannot claim your own book.");
        }

        book.setStatus("CLAIMED");
        books.save(book);

        return claims.save(new BookClaim(bookId, claimerId, message));
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
