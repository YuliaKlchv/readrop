# API Test Cases

These cases document the current backend behavior. `Actual result` and `Status` are left as execution placeholders for manual or automated runs.

## Signup

### API-SIGNUP-001
- Test ID: `API-SIGNUP-001`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `High`
- Preconditions: Demo seeding may be enabled or disabled. Email used in this test must not exist.
- Request data: `{"name":"Alice Reader","email":"alice.reader@example.com","password":"GoodPass123!","city":"Vienna"}`
- Steps:
  1. Send `POST /api/signup` with valid JSON body.
  2. Capture response body and `Set-Cookie`.
- Expected status code: `201`
- Expected response: `user.email` matches request email in lowercase, session cookie `sid` is returned, no password hash is exposed.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Cookie should be `httpOnly` and usable for follow-up calls to `/api/me`.

### API-SIGNUP-002
- Test ID: `API-SIGNUP-002`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `High`
- Preconditions: `demo@readrop.app` exists or another duplicate email is prepared.
- Request data: `{"name":"Dup User","email":"demo@readrop.app","password":"GoodPass123!","city":"Berlin"}`
- Steps:
  1. Send signup request with an existing email.
- Expected status code: `409`
- Expected response: `{"error":"An account with this email already exists."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Duplicate email handling should be case-insensitive because email is normalized.

### API-SIGNUP-003
- Test ID: `API-SIGNUP-003`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: `{"name":" ","email":"alice.reader@example.com","password":"GoodPass123!","city":"Vienna"}`
- Steps:
  1. Send signup request with blank name.
- Expected status code: `400`
- Expected response: `{"error":"Please enter your name."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Confirms backend validation before persistence.

### API-SIGNUP-004
- Test ID: `API-SIGNUP-004`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: `{"name":"Alice Reader","email":"not-an-email","password":"GoodPass123!","city":"Vienna"}`
- Steps:
  1. Send signup request with invalid email format.
- Expected status code: `400`
- Expected response: `{"error":"Please enter a valid email address."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Use additional cases for uppercase and trailing-space email normalization.

### API-SIGNUP-005
- Test ID: `API-SIGNUP-005`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: `{"name":"Alice Reader","email":"alice.reader@example.com","password":"short","city":"Vienna"}`
- Steps:
  1. Send signup request with password below the minimum requirement.
- Expected status code: `400`
- Expected response: Password validation error, currently `Password must be at least 12 characters.`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Extend later with missing uppercase/number/special-character scenarios if validation rules are expanded.

### API-SIGNUP-006
- Test ID: `API-SIGNUP-006`
- Endpoint: `/api/signup`
- Method: `POST`
- Priority: `Medium`
- Preconditions: None.
- Request data: Empty body or missing required fields.
- Steps:
  1. Send `POST /api/signup` with `{}`.
  2. Repeat with no body.
- Expected status code: `400`
- Expected response: Error message for the first missing required field.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Current implementation converts `null` request body into an empty signup request object.

## Login

### API-LOGIN-001
- Test ID: `API-LOGIN-001`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Demo account or a valid registered account exists.
- Request data: `{"email":"demo@readrop.app","password":"ReadropDemo123!"}`
- Steps:
  1. Send login request with valid credentials.
  2. Inspect response body and cookie header.
- Expected status code: `200`
- Expected response: `{"user":{"name":"...","email":"demo@readrop.app"}}` and a `sid` cookie.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Cookie should include `HttpOnly`, `SameSite=Lax`, and `Path=/`.

### API-LOGIN-002
- Test ID: `API-LOGIN-002`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Demo account exists.
- Request data: `{"email":"demo@readrop.app","password":"wrong-password"}`
- Steps:
  1. Send login request with wrong password.
- Expected status code: `401`
- Expected response: `{"error":"Invalid email or password"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Error message should not reveal whether the email exists.

### API-LOGIN-003
- Test ID: `API-LOGIN-003`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Target email does not exist.
- Request data: `{"email":"missing@example.com","password":"GoodPass123!"}`
- Steps:
  1. Send login request with unknown email.
- Expected status code: `401`
- Expected response: `{"error":"Invalid email or password"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Confirms no account enumeration through login errors.

### API-LOGIN-004
- Test ID: `API-LOGIN-004`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `Medium`
- Preconditions: None.
- Request data: `{"email":"demo@readrop.app","password":" "}`
- Steps:
  1. Send login request with blank password.
- Expected status code: `401`
- Expected response: `{"error":"Invalid email or password"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Backend rejects malformed credential payloads as unauthorized, not as validation errors.

## Logout

### API-LOGOUT-001
- Test ID: `API-LOGOUT-001`
- Endpoint: `/api/logout`
- Method: `POST`
- Priority: `High`
- Preconditions: User is logged in and has a valid `sid` cookie.
- Request data: No request body.
- Steps:
  1. Send logout request with the current session cookie.
  2. Inspect `Set-Cookie`.
  3. Call `/api/me` with the cleared cookie.
- Expected status code: `200`
- Expected response: `{"ok":true}`, returned cookie has empty value and `Max-Age=0`, follow-up `/api/me` returns `401`.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Logout is cookie-clearing behavior because the backend is stateless.

### API-LOGOUT-002
- Test ID: `API-LOGOUT-002`
- Endpoint: `/api/logout`
- Method: `POST`
- Priority: `Low`
- Preconditions: No session cookie is present.
- Request data: No request body.
- Steps:
  1. Send logout request without authentication.
- Expected status code: `200`
- Expected response: `{"ok":true}` and clear-cookie header.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Current implementation is idempotent and not access-restricted.

## Current User

### API-ME-001
- Test ID: `API-ME-001`
- Endpoint: `/api/me`
- Method: `GET`
- Priority: `High`
- Preconditions: Valid login session exists.
- Request data: Auth cookie only.
- Steps:
  1. Log in successfully.
  2. Call `/api/me` with the returned cookie.
- Expected status code: `200`
- Expected response: `{"user":{"name":"...","email":"..."}}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Only public user fields should be exposed.

### API-ME-002
- Test ID: `API-ME-002`
- Endpoint: `/api/me`
- Method: `GET`
- Priority: `High`
- Preconditions: None.
- Request data: No cookie.
- Steps:
  1. Call `/api/me` without session cookie.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Core auth smoke case.

### API-ME-003
- Test ID: `API-ME-003`
- Endpoint: `/api/me`
- Method: `GET`
- Priority: `High`
- Preconditions: None.
- Request data: Invalid or expired `sid` cookie.
- Steps:
  1. Call `/api/me` with a tampered JWT cookie.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: The JWT filter should ignore invalid tokens and leave the request unauthenticated.

## Public Books

### API-BOOKS-001
- Test ID: `API-BOOKS-001`
- Endpoint: `/api/books`
- Method: `GET`
- Priority: `High`
- Preconditions: Demo data enabled or books already exist.
- Request data: Optional query params `genre` and `city`.
- Steps:
  1. Call `/api/books` without authentication.
- Expected status code: `200`
- Expected response: `{"books":[...],"count":N}` for available books only.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Endpoint is public by design.

### API-BOOKS-002
- Test ID: `API-BOOKS-002`
- Endpoint: `/api/books`
- Method: `GET`
- Priority: `Medium`
- Preconditions: Seeded or prepared data includes multiple genres/cities.
- Request data: `?genre=Sci-Fi&city=Berlin`
- Steps:
  1. Call `/api/books?genre=Sci-Fi&city=Berlin`.
  2. Verify returned rows match the filters.
- Expected status code: `200`
- Expected response: Only available books matching both filters are returned.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Repeat with only `genre` and only `city`.

### API-BOOKS-003
- Test ID: `API-BOOKS-003`
- Endpoint: `/api/books`
- Method: `GET`
- Priority: `Medium`
- Preconditions: Start backend with `APP_SEED_DEMO=false` and an empty database.
- Request data: None.
- Steps:
  1. Call `/api/books` on an empty dataset.
- Expected status code: `200`
- Expected response: `{"books":[],"count":0}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Important for UI empty-state handling.

## Create Book

### API-CREATE-BOOK-001
- Test ID: `API-CREATE-BOOK-001`
- Endpoint: `/api/books`
- Method: `POST`
- Priority: `High`
- Preconditions: Logged-in user with valid cookie.
- Request data: `{"title":"Dune","author":"Frank Herbert","genre":"Sci-Fi","condition":"GOOD","description":"Shared after reading","city":"Vienna"}`
- Steps:
  1. Authenticate.
  2. Send create-book request.
- Expected status code: `201`
- Expected response: `{"book":{...}}` with status `AVAILABLE`.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Lowercase condition input should be normalized to uppercase.

### API-CREATE-BOOK-002
- Test ID: `API-CREATE-BOOK-002`
- Endpoint: `/api/books`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: Valid JSON body but no auth cookie.
- Steps:
  1. Send create-book request without session cookie.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Core protected-endpoint check.

### API-CREATE-BOOK-003
- Test ID: `API-CREATE-BOOK-003`
- Endpoint: `/api/books`
- Method: `POST`
- Priority: `High`
- Preconditions: Logged-in user.
- Request data: Condition set to `MINT`.
- Steps:
  1. Authenticate.
  2. Send create-book request with invalid condition.
- Expected status code: `400`
- Expected response: `{"error":"Condition must be GREAT, GOOD, or WORN."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Allowed values are `GOOD`, `GREAT`, and `WORN`.

### API-CREATE-BOOK-004
- Test ID: `API-CREATE-BOOK-004`
- Endpoint: `/api/books`
- Method: `POST`
- Priority: `Medium`
- Preconditions: Logged-in user.
- Request data: Missing `title`, `author`, `genre`, or `city`.
- Steps:
  1. Send requests with one required field missing each time.
- Expected status code: `400`
- Expected response: Field-specific validation error such as `Title is required.`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Current validation stops at the first failing field.

## My Books

### API-MY-BOOKS-001
- Test ID: `API-MY-BOOKS-001`
- Endpoint: `/api/books/my`
- Method: `GET`
- Priority: `High`
- Preconditions: Logged-in user with at least one listing.
- Request data: Auth cookie only.
- Steps:
  1. Create one or more books under the test account.
  2. Call `/api/books/my`.
- Expected status code: `200`
- Expected response: Only the authenticated user’s own books are returned.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Use separate users to verify no cross-user data leakage.

### API-MY-BOOKS-002
- Test ID: `API-MY-BOOKS-002`
- Endpoint: `/api/books/my`
- Method: `GET`
- Priority: `High`
- Preconditions: None.
- Request data: No cookie.
- Steps:
  1. Call `/api/books/my` without authentication.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Protected-endpoint check for personal data.

## Claim Book

### API-CLAIM-001
- Test ID: `API-CLAIM-001`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `High`
- Preconditions: Two different users exist. The target book is `AVAILABLE` and belongs to another user.
- Request data: `{"message":"I can pick it up this week."}`
- Steps:
  1. Log in as the claimant.
  2. Send claim request for another user’s available book.
- Expected status code: `201`
- Expected response: `{"claim":{...,"status":"PENDING"}}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: After the claim, the target book status should become `CLAIMED`.

### API-CLAIM-002
- Test ID: `API-CLAIM-002`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: Valid claim payload but no cookie.
- Steps:
  1. Send claim request without authentication.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Protected-endpoint check.

### API-CLAIM-003
- Test ID: `API-CLAIM-003`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `High`
- Preconditions: Logged-in owner of the target book.
- Request data: `{"message":"Trying to claim my own listing"}`
- Steps:
  1. Authenticate as the book owner.
  2. Claim the owner’s own book.
- Expected status code: `400`
- Expected response: `{"error":"You cannot claim your own book."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Important negative ownership rule.

### API-CLAIM-004
- Test ID: `API-CLAIM-004`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `High`
- Preconditions: Book has already been claimed once and is no longer `AVAILABLE`.
- Request data: `{"message":"Second claim attempt"}`
- Steps:
  1. Claim an available book successfully.
  2. Attempt to claim the same book again as another user.
- Expected status code: `409`
- Expected response: `{"error":"This book is no longer available."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: This protects the book state transition from duplicate claiming.

### API-CLAIM-005
- Test ID: `API-CLAIM-005`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `Medium`
- Preconditions: Logged-in user.
- Request data: Target book id does not exist.
- Steps:
  1. Send claim request with a non-existent book id.
- Expected status code: `404`
- Expected response: `{"error":"Book not found."}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Useful for stale frontend list handling.

## Subscribers

### API-SUBSCRIBERS-001
- Test ID: `API-SUBSCRIBERS-001`
- Endpoint: `/api/subscribers`
- Method: `GET`
- Priority: `High`
- Preconditions: No auth cookie.
- Request data: None.
- Steps:
  1. Call `/api/subscribers` anonymously.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Confirms authentication is required.

### API-SUBSCRIBERS-002
- Test ID: `API-SUBSCRIBERS-002`
- Endpoint: `/api/subscribers`
- Method: `GET`
- Priority: `High`
- Preconditions: Any authenticated user exists.
- Request data: Auth cookie only.
- Steps:
  1. Log in as a normal member.
  2. Call `/api/subscribers`.
- Expected status code: `200`
- Expected response: Subscriber list is returned.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Current limitation: endpoint is authenticated but not role-restricted.
