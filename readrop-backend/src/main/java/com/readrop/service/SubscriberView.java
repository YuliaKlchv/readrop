package com.readrop.service;

import java.time.Instant;

public record SubscriberView(String email, String plan, Instant createdAt, String kind,
                             String status, String dot) {

    static SubscriberView user(String email, String plan, Instant createdAt) {
        return new SubscriberView(email, plan, createdAt, "user", "Active", "green");
    }
}
