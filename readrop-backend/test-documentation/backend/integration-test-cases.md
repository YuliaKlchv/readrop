# Integration Test Cases

These cases target the real Spring Boot stack with H2, Flyway, Spring Security, cookie auth, and controller-to-database flow.

## INT-001 Health Endpoint Is Public
- Preconditions: Application started successfully.
- Steps:
  1. Send `GET /actuator/health`.
- Expected result: `200 OK` with health payload.
- Notes: Basic smoke check for app startup and actuator exposure.

## INT-002 Login Then /api/me Returns Current User
- Preconditions: Demo account exists.
- Steps:
  1. Send valid login request.
  2. Capture `sid` cookie.
  3. Send `GET /api/me` with cookie.
- Expected result: Login returns `200`, `/api/me` returns `200`, and the email matches the logged-in user.
- Notes: Confirms end-to-end cookie session flow.

## INT-003 Invalid Login Does Not Create a Session
- Preconditions: Demo account exists.
- Steps:
  1. Send login request with wrong password.
- Expected result: `401 UNAUTHORIZED` and no usable authenticated session.
- Notes: Prevents false-positive auth state in UI tests.

## INT-004 Signup Creates Session Immediately
- Preconditions: Unique email is prepared.
- Steps:
  1. Send valid signup request.
  2. Capture cookie from response.
  3. Call `/api/me` with returned cookie.
- Expected result: Signup returns `201`, and the returned cookie works immediately.
- Notes: Useful for onboarding flow automation.

## INT-005 Logout Clears Cookie
- Preconditions: Valid logged-in session exists.
- Steps:
  1. Log in.
  2. Call `/api/logout`.
  3. Call `/api/me` with the cleared cookie.
- Expected result: Logout returns `200`, sets a deletion cookie, and `/api/me` returns `401`.
- Notes: Confirms stateless logout behavior.

## INT-006 Public Book List Works Without Authentication
- Preconditions: Demo books exist or manual data is present.
- Steps:
  1. Send `GET /api/books`.
- Expected result: `200 OK` and a JSON payload with `books` and `count`.
- Notes: Good UI smoke test dependency.

## INT-007 Authenticated User Can Create Book
- Preconditions: Valid user session exists.
- Steps:
  1. Log in or sign up.
  2. Send valid `POST /api/books`.
  3. Call `/api/books/my`.
- Expected result: Create returns `201`, and the new title appears in `/api/books/my`.
- Notes: Covers auth, validation, persistence, and response mapping together.

## INT-008 Create Book Rejects Invalid Condition
- Preconditions: Valid user session exists.
- Steps:
  1. Send create-book request with `condition=MINT`.
- Expected result: `400 BAD_REQUEST` with condition validation error.
- Notes: Useful negative API regression.

## INT-009 /api/books/my Is User-Scoped
- Preconditions: Two users exist and each has at least one book.
- Steps:
  1. Create a listing under User A.
  2. Create a different listing under User B.
  3. Call `/api/books/my` as User A.
- Expected result: Response includes User A listing and excludes User B listing.
- Notes: Confirms personal-data isolation.

## INT-010 Claim Endpoint Requires Authentication
- Preconditions: Available book id exists.
- Steps:
  1. Send claim request without cookie.
- Expected result: `401 UNAUTHORIZED`.
- Notes: Protected transition smoke check.

## INT-011 User Cannot Claim Own Book
- Preconditions: Logged-in user owns at least one available book.
- Steps:
  1. Create a book as the logged-in user.
  2. Claim the same book with the same cookie.
- Expected result: `400 BAD_REQUEST`.
- Notes: Business-rule protection test.

## INT-012 Already Claimed Book Returns Conflict
- Preconditions: Owner user and two claimer users exist.
- Steps:
  1. Owner creates an available book.
  2. Claimer One claims it successfully.
  3. Claimer Two tries to claim the same book.
- Expected result: First claim returns `201`, second claim returns `409`.
- Notes: Verifies state transition handling through the real stack.

## INT-013 Invalid JWT Cookie Is Rejected
- Preconditions: None.
- Steps:
  1. Send `GET /api/me` with fake `sid` cookie.
- Expected result: `401 UNAUTHORIZED`.
- Notes: Security filter should treat invalid token as unauthenticated request.

## INT-014 Subscribers Endpoint Is Authenticated but Not Role-Restricted
- Preconditions: Standard logged-in member exists.
- Steps:
  1. Call `/api/subscribers` without cookie.
  2. Call `/api/subscribers` with a normal member cookie.
- Expected result: Anonymous request returns `401`, authenticated member request returns `200`.
- Notes: Documented limitation for future authorization work.
