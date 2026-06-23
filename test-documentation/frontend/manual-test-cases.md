# Frontend Manual Test Cases

## Login with valid credentials
- Test ID: FT-001
- Title: Login with valid credentials
- Priority: High
- Preconditions: Frontend running at `http://localhost:4173`; backend running at `http://localhost:3000`; user exists or demo mode enabled.
- Test data: email `demo@readrop.app`, password `ReadropDemo123!`
- Steps:
  1. Navigate to `/login`.
  2. Enter valid email and password.
  3. Click `Log in`.
- Expected result: User is redirected to `/dashboard` or logged-in home state; page shows dashboard heading.
- Actual result: 
- Status: 
- Notes: 

## Login with invalid credentials
- Test ID: FT-002
- Title: Login with invalid credentials
- Priority: High
- Preconditions: Frontend and backend running.
- Test data: email `bad@example.com`, password `WrongPass123!`
- Steps:
  1. Navigate to `/login`.
  2. Enter invalid credentials.
  3. Click `Log in`.
- Expected result: Error message appears: `Invalid email or password.`; user stays on login page.
- Actual result: 
- Status: 
- Notes: 

## Logout
- Test ID: FT-003
- Title: Logout
- Priority: High
- Preconditions: User is logged in.
- Test data: None.
- Steps:
  1. Navigate to dashboard or any protected page.
  2. Click the logout control.
- Expected result: User is signed out and redirected to the public homepage or login page.
- Actual result: 
- Status: 
- Notes: 

## Register new user
- Test ID: FT-004
- Title: Register new user
- Priority: High
- Preconditions: Frontend and backend running.
- Test data: name `Test User`, email `test.user+e2e@example.com`, password `ReadropDemo123!`, confirm password `ReadropDemo123!`
- Steps:
  1. Navigate to `/register`.
  2. Fill in name, email, password, confirm password.
  3. Click `Create free account`.
- Expected result: User sees thank-you or success page; account is created; user may be logged in.
- Actual result: 
- Status: 
- Notes: 

## Register validation errors
- Test ID: FT-005
- Title: Register validation errors
- Priority: Medium
- Preconditions: Frontend running.
- Test data: name blank, email `bad-email`, password `short`, confirm `mismatch`
- Steps:
  1. Navigate to `/register`.
  2. Enter invalid email, weak password, and mismatched confirmation.
- Expected result: Inline validation messages appear; `Create free account` remains disabled until the form is valid.
- Actual result: 
- Status: 
- Notes: 

## Browse books
- Test ID: FT-006
- Title: Browse books
- Priority: High
- Preconditions: Frontend and backend running; books available.
- Test data: None.
- Steps:
  1. Navigate to `/books`.
  2. Verify the page renders at least one book card.
  3. Inspect book title, author, genre, and status.
- Expected result: Book cards are visible and the list is populated.
- Actual result: 
- Status: 
- Notes: 

## Discover books
- Test ID: FT-007
- Title: Discover books
- Priority: High
- Preconditions: Frontend running.
- Test data: None.
- Steps:
  1. Navigate to `/discover`.
  2. Confirm the discovery card renders.
  3. Click the claim or skip actions if available.
- Expected result: Discovery flow loads books and action buttons are visible.
- Actual result: 
- Status: 
- Notes: 

## Claim a book as logged-in user
- Test ID: FT-008
- Title: Claim a book as logged-in user
- Priority: High
- Preconditions: User logged in; discover books available.
- Test data: demo user credentials or authenticated session.
- Steps:
  1. Navigate to `/discover`.
  2. Click the claim book action.
- Expected result: Claim success message appears and the book state updates appropriately.
- Actual result: 
- Status: 
- Notes: 

## Claim a book as guest user
- Test ID: FT-009
- Title: Claim a book as guest user
- Priority: High
- Preconditions: User not logged in.
- Test data: None.
- Steps:
  1. Navigate to `/discover`.
  2. Click the claim book action.
- Expected result: Guest is redirected to `/login` and cannot claim without authentication.
- Actual result: 
- Status: 
- Notes: 

## Give/list a new book
- Test ID: FT-010
- Title: Give/list a new book
- Priority: High
- Preconditions: User logged in.
- Test data: title `Test Book`, author `Test Author`, genre `Fiction`, city `Berlin`, condition `Good`
- Steps:
  1. Navigate to `/give`.
  2. Fill the book form.
  3. Submit the form.
- Expected result: New book is submitted; user is redirected to `/books` and listing appears.
- Actual result: 
- Status: 
- Notes: 

## Dashboard access
- Test ID: FT-011
- Title: Dashboard access
- Priority: High
- Preconditions: User logged in.
- Test data: None.
- Steps:
  1. Navigate to `/dashboard`.
- Expected result: Dashboard page loads with stats and a `Dashboard` heading.
- Actual result: 
- Status: 
- Notes: 

## Protected page redirect
- Test ID: FT-012
- Title: Protected page redirect
- Priority: High
- Preconditions: User not logged in.
- Test data: None.
- Steps:
  1. Navigate to `/give` or `/dashboard`.
- Expected result: User is redirected to `/login`.
- Actual result: 
- Status: 
- Notes: 

## Community page behavior
- Test ID: FT-013
- Title: Community page behavior
- Priority: Medium
- Preconditions: Frontend running.
- Test data: None.
- Steps:
  1. Navigate to `/community`.
  2. Verify page content and discussion list or cards.
- Expected result: Community content loads and navigation functions.
- Actual result: 
- Status: 
- Notes: 

## Messages page behavior
- Test ID: FT-014
- Title: Messages page behavior
- Priority: Medium
- Preconditions: User logged in.
- Test data: None.
- Steps:
  1. Navigate to `/messages`.
  2. Confirm conversations or message UI appear.
- Expected result: Messages page shows conversations and allows selection of a chat.
- Actual result: 
- Status: 
- Notes: 

## Navigation links
- Test ID: FT-015
- Title: Navigation links
- Priority: Medium
- Preconditions: Frontend running.
- Test data: None.
- Steps:
  1. Click each top nav link.
- Expected result: Each link navigates to the correct page with expected content.
- Actual result: 
- Status: 
- Notes: 

## Responsive UI checks
- Test ID: FT-016
- Title: Responsive UI checks
- Priority: Medium
- Preconditions: Frontend running.
- Test data: None.
- Steps:
  1. Resize browser to tablet and mobile widths.
  2. Verify the header, nav menu, and main content adapt.
- Expected result: Layout adjusts without broken elements; mobile menu toggles.
- Actual result: 
- Status: 
- Notes: 

## Basic accessibility checks
- Test ID: FT-017
- Title: Basic accessibility checks
- Priority: Medium
- Preconditions: Frontend running.
- Test data: None.
- Steps:
  1. Use keyboard navigation through forms and links.
  2. Verify label associations and focus states.
  3. Confirm `aria-label` and role attributes on interactive elements.
- Expected result: All controls are reachable by keyboard and have accessible labels.
- Actual result: 
- Status: 
- Notes: 
