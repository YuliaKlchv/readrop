# Service Test Cases

## AuthService

### SRV-AUTH-001 Signup Normalizes Email and Assigns Member Plan
- Preconditions: Repository returns `false` for duplicate email check.
- Action: Call `signup()` with mixed-case email and valid password.
- Expected result: Saved user email is lowercase, name is trimmed, plan is `member`, password is encoded.

### SRV-AUTH-002 Signup Rejects Blank Name
- Preconditions: None.
- Action: Call `signup()` with blank `name`.
- Expected result: `ApiException` with `400 BAD_REQUEST`.

### SRV-AUTH-003 Signup Rejects Duplicate Email
- Preconditions: Repository reports that normalized email already exists.
- Action: Call `signup()` with duplicate email.
- Expected result: `ApiException` with `409 CONFLICT`.

### SRV-AUTH-004 Login Rejects Unknown User
- Preconditions: Repository returns empty result for email lookup.
- Action: Call `login()` with unknown email.
- Expected result: `ApiException` with `401 UNAUTHORIZED`.

### SRV-AUTH-005 Login Rejects Blank Password
- Preconditions: None.
- Action: Call `login()` with blank password.
- Expected result: `ApiException` with `401 UNAUTHORIZED`, repository lookup can be skipped.

### SRV-AUTH-006 requireUser Rejects Null User Id
- Preconditions: None.
- Action: Call `requireUser(null)`.
- Expected result: `ApiException` with `401 UNAUTHORIZED`.

## BookService

### SRV-BOOK-001 createBook Persists Valid Listing
- Preconditions: Repository save returns the input entity.
- Action: Call `createBook()` with full valid request.
- Expected result: Book status is `AVAILABLE`, owner id is preserved, condition is normalized.

### SRV-BOOK-002 createBook Defaults Missing Condition to GOOD
- Preconditions: Repository save returns the input entity.
- Action: Call `createBook()` with `condition=null`.
- Expected result: Condition becomes `GOOD`.

### SRV-BOOK-003 createBook Rejects Invalid Condition
- Preconditions: None.
- Action: Call `createBook()` with condition outside `GOOD/GREAT/WORN`.
- Expected result: `ApiException` with `400 BAD_REQUEST`.

### SRV-BOOK-004 createBook Rejects Missing Required Fields
- Preconditions: None.
- Action: Call `createBook()` with missing `title`, `author`, `genre`, or `city`.
- Expected result: `ApiException` with `400 BAD_REQUEST`.

### SRV-BOOK-005 claimBook Rejects Unknown Book
- Preconditions: Repository returns empty for target id.
- Action: Call `claimBook()` with non-existent book id.
- Expected result: `ApiException` with `404 NOT_FOUND`.

### SRV-BOOK-006 claimBook Rejects Owner Claiming Own Book
- Preconditions: Book exists and `ownerId` equals `claimerId`.
- Action: Call `claimBook()`.
- Expected result: `ApiException` with `400 BAD_REQUEST`.

### SRV-BOOK-007 claimBook Rejects Already Claimed Book
- Preconditions: Book exists with status `CLAIMED`.
- Action: Call `claimBook()`.
- Expected result: `ApiException` with `409 CONFLICT`.

### SRV-BOOK-008 claimBook Updates Book Status and Stores Claim
- Preconditions: Book exists with status `AVAILABLE`.
- Action: Call `claimBook()` as a different user.
- Expected result: Book status becomes `CLAIMED` and a `PENDING` claim is stored.

## SubscriberService

### SRV-SUB-001 listSubscribers Returns Sorted Rows
- Preconditions: Repository returns multiple users with different `createdAt` values.
- Action: Call `listSubscribers()`.
- Expected result: Rows are mapped to `SubscriberView` and sorted newest first.

### SRV-SUB-002 listSubscribers Exposes Only Intended Fields
- Preconditions: Repository returns user records.
- Action: Call `listSubscribers()`.
- Expected result: View exposes email, plan, and created timestamp, not password hash.

## JwtService and CookieService

### SRV-JWT-001 sign and verify Produce a Valid Principal
- Preconditions: Stable secret source is available.
- Action: Generate token with `sign(uid)` and verify it with `verify(token)`.
- Expected result: Returned principal contains the original user id.

### SRV-JWT-002 verify Returns Null for Invalid Token
- Preconditions: Invalid token string is available.
- Action: Call `verify()` with tampered token.
- Expected result: Method returns `null`.

### SRV-COOKIE-001 build Creates Secure Session Cookie Shape
- Preconditions: CookieService initialized.
- Action: Build a cookie for a token.
- Expected result: Cookie is `httpOnly`, `SameSite=Lax`, `Path=/`, and uses configured lifetime.

### SRV-COOKIE-002 clear Creates Deletion Cookie
- Preconditions: CookieService initialized.
- Action: Call `clear()`.
- Expected result: Cookie value is empty and `Max-Age=0`.
