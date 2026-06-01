package com.skilloport.service;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

/** A row in the admin "subscribers" list — either a user or an unconverted lead. */
public record SubscriberView(
        String email,
        String plan,
        @JsonProperty("created_at") Instant createdAt,
        String kind,
        String status,
        String dot
) {
    public static SubscriberView user(String email, String plan, Instant createdAt) {
        return new SubscriberView(email, plan, createdAt, "user", "Active", "green");
    }

    public static SubscriberView lead(String email, Instant createdAt) {
        return new SubscriberView(email, "lead", createdAt, "lead", "Lead", "amber");
    }
}
