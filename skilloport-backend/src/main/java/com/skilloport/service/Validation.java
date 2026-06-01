package com.skilloport.service;

import java.util.regex.Pattern;

/** Server-authoritative input validation. */
public final class Validation {

    private static final Pattern EMAIL_RE =
            Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    private Validation() {
    }

    public static boolean emailOk(String v) {
        return v != null && EMAIL_RE.matcher(v.trim()).matches();
    }

    /** Returns the problem message, or null if the password is acceptable. */
    public static String passwordProblem(String p) {
        if (p == null || p.length() < 12) {
            return "Password must be at least 12 characters.";
        }
        if (!p.matches(".*[A-Z].*")) {
            return "Password needs an uppercase letter.";
        }
        if (!p.matches(".*[a-z].*")) {
            return "Password needs a lowercase letter.";
        }
        if (!p.matches(".*[0-9].*")) {
            return "Password needs a number.";
        }
        if (!p.matches(".*[!@#$%^&*].*")) {
            return "Password needs a special character (!@#$%^&*).";
        }
        return null;
    }
}
