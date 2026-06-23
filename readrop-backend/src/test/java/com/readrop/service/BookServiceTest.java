package com.readrop.service;

import com.readrop.dto.CreateBookRequest;
import com.readrop.error.ApiException;
import com.readrop.model.Book;
import com.readrop.model.BookClaim;
import com.readrop.repository.BookClaimRepository;
import com.readrop.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository books;
    @Mock
    private BookClaimRepository claims;

    @InjectMocks
    private BookService bookService;

    @Test
    void createBook_saves_with_correct_fields() {
        when(books.save(any(Book.class))).thenAnswer(inv -> inv.getArgument(0));

        Book saved = bookService.createBook(1L,
                new CreateBookRequest("Dune", "Frank Herbert", "Sci-Fi", "good", null, "Munich"));

        assertThat(saved.getTitle()).isEqualTo("Dune");
        assertThat(saved.getCondition()).isEqualTo("GOOD");
        assertThat(saved.getStatus()).isEqualTo("AVAILABLE");
        assertThat(saved.getOwnerId()).isEqualTo(1L);
    }

    @Test
    void createBook_rejects_missing_title() {
        assertThatThrownBy(() -> bookService.createBook(1L,
                new CreateBookRequest("", "Author", "Genre", "GOOD", null, "City")))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void createBook_rejects_invalid_condition() {
        assertThatThrownBy(() -> bookService.createBook(1L,
                new CreateBookRequest("Title", "Author", "Genre", "MINT", null, "City")))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Condition must be");
    }

    @Test
    void createBook_defaults_condition_to_good_when_missing() {
        when(books.save(any(Book.class))).thenAnswer(inv -> inv.getArgument(0));

        Book saved = bookService.createBook(1L,
                new CreateBookRequest("Dune", "Frank Herbert", "Sci-Fi", null, " ", "Munich"));

        assertThat(saved.getCondition()).isEqualTo("GOOD");
        assertThat(saved.getDescription()).isNull();
    }

    @Test
    void claimBook_marks_book_claimed_and_saves_claim() {
        Book book = new Book("Title", "Author", "Genre", "GOOD", null, "City", 2L);
        when(books.findById(10L)).thenReturn(Optional.of(book));
        when(books.save(any(Book.class))).thenAnswer(inv -> inv.getArgument(0));
        when(claims.save(any(BookClaim.class))).thenAnswer(inv -> inv.getArgument(0));

        BookClaim claim = bookService.claimBook(10L, 5L, "Please!");

        assertThat(book.getStatus()).isEqualTo("CLAIMED");
        assertThat(claim.getClaimerId()).isEqualTo(5L);
        verify(books).save(book);
    }

    @Test
    void claimBook_rejects_owner_claiming_own_book() {
        Book book = new Book("Title", "Author", "Genre", "GOOD", null, "City", 5L);
        when(books.findById(10L)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> bookService.claimBook(10L, 5L, null))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("own book");
    }

    @Test
    void claimBook_rejects_already_claimed_book() {
        Book book = new Book("Title", "Author", "Genre", "GOOD", null, "City", 2L);
        book.setStatus("CLAIMED");
        when(books.findById(10L)).thenReturn(Optional.of(book));

        assertThatThrownBy(() -> bookService.claimBook(10L, 5L, null))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void claimBook_rejects_unknown_book() {
        when(books.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.claimBook(999L, 5L, null))
                .isInstanceOf(ApiException.class)
                .extracting(e -> ((ApiException) e).getStatus())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }
}
