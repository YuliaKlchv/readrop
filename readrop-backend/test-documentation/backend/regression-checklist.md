# Regression Checklist

## Build and Environment

- [ ] Java 21 is active.
- [ ] `mvn test` completes successfully.
- [ ] JaCoCo XML and HTML reports are generated.
- [ ] Backend still binds to fixed port `3000`.
- [ ] Automatic port switching has not been reintroduced.

## Authentication

- [ ] Valid signup returns `201` and cookie.
- [ ] Valid login returns `200` and cookie.
- [ ] Invalid login returns `401`.
- [ ] `/api/me` returns `401` without cookie.
- [ ] `/api/me` returns `401` with invalid cookie.
- [ ] Logout clears cookie.
- [ ] JWT is still handled via `httpOnly` cookie, not `localStorage`.

## Books

- [ ] `GET /api/books` remains public.
- [ ] `POST /api/books` requires authentication.
- [ ] `POST /api/books` rejects invalid condition.
- [ ] `GET /api/books/my` requires authentication.
- [ ] `GET /api/books/my` returns only current user books.
- [ ] `POST /api/books/{id}/claim` requires authentication.
- [ ] User cannot claim own book.
- [ ] Already claimed book cannot be claimed twice.

## Subscribers

- [ ] `/api/subscribers` still requires authentication.
- [ ] Documentation still states that `/api/subscribers` is not role-restricted yet.

## Data and Demo Setup

- [ ] Demo account login still works when demo seeding is enabled.
- [ ] Demo books load successfully when demo seeding is enabled.
- [ ] Disabling demo seeding does not break application startup.

## Docker and PostgreSQL

- [ ] Docker image still uses Java 21.
- [ ] Docker runtime exposes port `3000`.
- [ ] Docker/PostgreSQL startup works with datasource environment variables.
- [ ] No secrets are hardcoded into the repository.

## Static Analysis

- [ ] SonarQube command still points to JaCoCo XML output.
- [ ] Surefire reports remain available for CI archiving.
