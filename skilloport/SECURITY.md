# SkillOport Frontend Security Notes

This repository now contains the SkillOport frontend only. Real authentication,
session validation, and protected data access are enforced by the backend API,
typically the Spring Boot service running behind `/api`.

## What the frontend is responsible for

- Keeping secrets out of the browser bundle.
- Validating email and password inputs for UX before requests are sent.
- Showing generic login/reset responses to avoid account enumeration.
- Redirecting unauthenticated users away from protected routes such as `/admin`.
- Avoiding unsafe HTML injection; the UI uses standard React rendering.
- Falling back to a local demo mode only when no JSON API is reachable.

## What the backend must enforce

- Password hashing and credential verification.
- Session creation and validation with secure cookies.
- Authorization for protected endpoints such as `/api/me` and `/api/subscribers`.
- Rate limiting, audit logging, and TLS at deployment time.
- Database-level protection of user and subscriber data.

## Demo mode

When `/api` is unavailable, the frontend switches to a browser-only demo mode
implemented in `src/lib/api.js`.
That mode stores demo state in `localStorage` so the product can still be
explored, but it is not the production security model.

## Local development

Run the backend separately on port `3000`, then start the frontend with:

```bash
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3000`.
