package com.readrop.web;

import com.readrop.dto.CreateBookRequest;
import com.readrop.error.ApiException;
import com.readrop.model.AppUser;
import com.readrop.model.Book;
import com.readrop.model.BookClaim;
import com.readrop.security.UserPrincipal;
import com.readrop.service.AuthService;
import com.readrop.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final AuthService authService;

    public BookController(BookService bookService, AuthService authService) {
        this.bookService = bookService;
        this.authService = authService;
    }

    @GetMapping
    public Map<String, Object> listBooks(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String city) {
        List<Book> bookList = bookService.listBooks(genre, city);
        return Map.of("books", bookList, "count", bookList.size());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBook(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody(required = false) CreateBookRequest body) {
        requireAuth(principal);
        AppUser user = authService.requireUser(principal.uid());
        Book book = bookService.createBook(user.getId(), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("book", book));
    }

    @GetMapping("/my")
    public Map<String, Object> myBooks(@AuthenticationPrincipal UserPrincipal principal) {
        requireAuth(principal);
        List<Book> myBooks = bookService.getMyBooks(principal.uid());
        return Map.of("books", myBooks, "count", myBooks.size());
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<Map<String, Object>> claimBook(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        requireAuth(principal);
        String message = body != null ? body.get("message") : null;
        BookClaim claim = bookService.claimBook(id, principal.uid(), message);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("claim", claim));
    }

    private static void requireAuth(UserPrincipal principal) {
        if (principal == null) {
            throw ApiException.unauthorized("Not authenticated");
        }
    }
}
