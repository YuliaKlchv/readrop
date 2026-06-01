package com.skilloport.dto;

import com.skilloport.model.AppUser;

/** Public user shape returned to the frontend: { name, email, plan } — no id, no hash. */
public record PublicUser(String name, String email, String plan) {
    public static PublicUser from(AppUser user) {
        return new PublicUser(user.getName(), user.getEmail(), user.getPlan());
    }
}
