package com.readrop.dto;

import com.readrop.model.AppUser;

/** Public user shape returned to the frontend: { name, email } — no id, no hash. */
public record PublicUser(String name, String email) {
    public static PublicUser from(AppUser user) {
        return new PublicUser(user.getName(), user.getEmail());
    }
}
