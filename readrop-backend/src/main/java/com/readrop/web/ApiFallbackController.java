package com.readrop.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Catch-all for unknown /api routes → 404 {"error":"Not found"}.
 * Concrete controller mappings take precedence over this one.
 */
@RestController
public class ApiFallbackController {

    @RequestMapping("/api/**")
    public ResponseEntity<Map<String, String>> notFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found"));
    }
}
