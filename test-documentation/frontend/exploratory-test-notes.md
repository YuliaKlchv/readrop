# Exploratory Test Notes

## Observations
- The Discover page has a swipe-style claim flow; check that book actions are responsive and not blocked by animation timing.
- `Give a book` requires authentication and should redirect guests to login.
- The register page includes live password strength feedback that should be tested with different inputs.
- The site uses `Credentials: include` for auth, so backend cookie/session behavior should be verified with browser-based tests.

## Potential risk areas
- Route guards around `/give` and `/dashboard` may not handle refreshes consistently.
- Demo mode fallback could hide backend issues if the backend is unavailable.
- The `messages` page state is only loaded after auth, so slow API responses could lead to empty UI.
- The discover claim button may allow guest users to navigate to login without preserving the intended action.

## Test ideas
- Test that login persists after closing and reopening a browser tab.
- Verify register email suggestion behavior for common typo domains.
- Check that invalid book form values show fallback errors.
- Confirm the `claim-book-button` only exists on discover cards and is hidden on unavailable entries.
- Validate that the `forgot password` flow renders the correct page and messaging.
