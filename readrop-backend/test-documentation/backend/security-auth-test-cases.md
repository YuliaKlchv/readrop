# Security and Authentication Test Cases

## SEC-AUTH-001 Valid Login Creates Cookie Session
- Test ID: `SEC-AUTH-001`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Valid account exists.
- Request data: Correct email and password.
- Steps:
  1. Send login request.
  2. Inspect body and `Set-Cookie`.
  3. Reuse cookie on `/api/me`.
- Expected status code: `200`, then `200` on `/api/me`
- Expected response: User object is returned and `sid` cookie authenticates follow-up requests.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Cookie-based auth must remain the primary browser session mechanism.

## SEC-AUTH-002 Invalid Password Is Rejected
- Test ID: `SEC-AUTH-002`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Known email exists.
- Request data: Valid email, invalid password.
- Steps:
  1. Send login request with wrong password.
- Expected status code: `401`
- Expected response: `{"error":"Invalid email or password"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Response must not reveal whether the email is valid.

## SEC-AUTH-003 Unknown Email Is Rejected
- Test ID: `SEC-AUTH-003`
- Endpoint: `/api/login`
- Method: `POST`
- Priority: `High`
- Preconditions: Email does not exist.
- Request data: Unknown email, any password.
- Steps:
  1. Send login request with non-existent email.
- Expected status code: `401`
- Expected response: `{"error":"Invalid email or password"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Prevents simple account enumeration.

## SEC-AUTH-004 /api/me Without Cookie Is Rejected
- Test ID: `SEC-AUTH-004`
- Endpoint: `/api/me`
- Method: `GET`
- Priority: `High`
- Preconditions: None.
- Request data: No cookie.
- Steps:
  1. Call `/api/me` anonymously.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Core session enforcement check.

## SEC-AUTH-005 Protected Endpoint Without Cookie Is Rejected
- Test ID: `SEC-AUTH-005`
- Endpoint: `/api/books`
- Method: `POST`
- Priority: `High`
- Preconditions: None.
- Request data: Valid book payload but no cookie.
- Steps:
  1. Send create-book request without authentication.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Repeat for `/api/books/my` and `/api/books/{id}/claim`.

## SEC-AUTH-006 Logout Clears Cookie
- Test ID: `SEC-AUTH-006`
- Endpoint: `/api/logout`
- Method: `POST`
- Priority: `High`
- Preconditions: User is logged in.
- Request data: No body.
- Steps:
  1. Log in and capture cookie.
  2. Send logout request.
  3. Call `/api/me` with the cleared cookie.
- Expected status code: `200`, then `401`
- Expected response: Clear-cookie header with empty `sid` and `Max-Age=0`.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Backend is stateless, so cookie clearing is the logout mechanism.

## SEC-AUTH-007 Invalid or Expired JWT Is Treated as Unauthenticated
- Test ID: `SEC-AUTH-007`
- Endpoint: `/api/me`
- Method: `GET`
- Priority: `High`
- Preconditions: Tampered token or expired token is available.
- Request data: Invalid `sid` cookie.
- Steps:
  1. Send request with fake or modified JWT cookie.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Current implementation ignores invalid tokens rather than surfacing parser details.

## SEC-AUTH-008 User Cannot Read Another User’s Private Book List
- Test ID: `SEC-AUTH-008`
- Endpoint: `/api/books/my`
- Method: `GET`
- Priority: `High`
- Preconditions: Two different users each have at least one book listing.
- Request data: Auth cookie for User A.
- Steps:
  1. Create a book under User A.
  2. Create a different book under User B.
  3. Call `/api/books/my` as User A.
- Expected status code: `200`
- Expected response: Only User A books are present.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Endpoint does not take a user id and therefore should not leak cross-user listings.

## SEC-AUTH-009 Claim Endpoint Requires Authentication
- Test ID: `SEC-AUTH-009`
- Endpoint: `/api/books/{id}/claim`
- Method: `POST`
- Priority: `High`
- Preconditions: Target book id is known.
- Request data: Valid claim body, no cookie.
- Steps:
  1. Send claim request anonymously.
- Expected status code: `401`
- Expected response: `{"error":"Not authenticated"}`
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: This is one of the most important protected-state transitions in the app.

## SEC-AUTH-010 Subscribers Endpoint Limitation Is Explicitly Documented
- Test ID: `SEC-AUTH-010`
- Endpoint: `/api/subscribers`
- Method: `GET`
- Priority: `High`
- Preconditions: Standard authenticated user exists.
- Request data: Auth cookie only.
- Steps:
  1. Log in as a normal member.
  2. Call `/api/subscribers`.
- Expected status code: `200`
- Expected response: Subscriber list is returned even though no role-based authorization exists.
- Actual result: `Pending execution`
- Status: `Draft`
- Notes: Treat this as a documented limitation until a real authorization model is implemented.
