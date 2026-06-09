package com.readrop.repository;

import com.readrop.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByStatusOrderByCreatedAtDesc(String status);

    List<Book> findByStatusAndGenreIgnoreCaseOrderByCreatedAtDesc(String status, String genre);

    List<Book> findByStatusAndCityIgnoreCaseOrderByCreatedAtDesc(String status, String city);

    List<Book> findByStatusAndGenreIgnoreCaseAndCityIgnoreCaseOrderByCreatedAtDesc(
            String status, String genre, String city);

    List<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
}
