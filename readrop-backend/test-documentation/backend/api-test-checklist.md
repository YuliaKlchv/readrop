# API Test Checklist

## Smoke

- [ ] `POST /api/signup` returns `201` with cookie for valid data.
- [ ] `POST /api/login` returns `200` with cookie for valid credentials.
- [ ] `POST /api/logout` returns `200` and clears cookie.
- [ ] `GET /api/me` returns `200` with valid cookie.
- [ ] `GET /api/books` returns `200` without authentication.
- [ ] `POST /api/books` returns `201` for authenticated user.
- [ ] `GET /api/books/my` returns `200` for authenticated user.
- [ ] `POST /api/books/{id}/claim` returns `201` for a valid claim.
- [ ] `GET /api/subscribers` returns `401` without cookie.

## Validation

- [ ] Signup rejects blank name.
- [ ] Signup rejects invalid email.
- [ ] Signup rejects weak password.
- [ ] Signup rejects duplicate email.
- [ ] Login rejects unknown email.
- [ ] Login rejects wrong password.
- [ ] Create-book rejects missing title.
- [ ] Create-book rejects missing author.
- [ ] Create-book rejects missing genre.
- [ ] Create-book rejects missing city.
- [ ] Create-book rejects invalid condition.
- [ ] Claim rejects non-existent book id.

## Authentication and Session

- [ ] Login cookie includes `HttpOnly`.
- [ ] Login cookie includes `SameSite=Lax`.
- [ ] Login cookie uses path `/`.
- [ ] `/api/me` rejects missing cookie.
- [ ] `/api/me` rejects invalid cookie.
- [ ] `/api/books` creation rejects missing cookie.
- [ ] `/api/books/my` rejects missing cookie.
- [ ] Claim endpoint rejects missing cookie.
- [ ] Logout clear-cookie has `Max-Age=0`.

## Data and Ownership

- [ ] `/api/books` shows only `AVAILABLE` books.
- [ ] `/api/books` supports `genre` filter.
- [ ] `/api/books` supports `city` filter.
- [ ] `/api/books/my` returns only the authenticated user’s books.
- [ ] Owner cannot claim own book.
- [ ] Already claimed book cannot be claimed again.
- [ ] Empty `GET /api/books` response returns `count: 0`.

## Documented Limitation

- [ ] `/api/subscribers` access for authenticated non-admin users is documented as a current limitation.
