# Regression Checklist

## Core functionality
- [ ] Login with valid credentials works.
- [ ] Invalid login returns an error.
- [ ] Registration validation prevents bad inputs.
- [ ] Give Book form submits successfully.
- [ ] Discover claim flow works for authenticated users.
- [ ] Guest is redirected to login for protected pages.
- [ ] Dashboard loads for authenticated users.
- [ ] Navigation links route correctly.

## UI stability
- [ ] Header and logo render consistently.
- [ ] Responsive page layout remains intact on tablet/mobile widths.
- [ ] Buttons and form fields remain accessible and usable.
- [ ] Alerts and error messages display correctly.
- [ ] Book card list and discover stack render without overflow.

## Auth behavior
- [ ] User stays authenticated after page refresh.
- [ ] Logout clears session and redirects.
- [ ] Protected routes require authentication.
- [ ] Backend API requests use cookies for auth.

## Test automation readiness
- [ ] Data-testid values present for key form fields and buttons.
- [ ] Cucumber feature files cover major flows.
- [ ] Selenium step definitions use stable selectors.
- [ ] Jasmine utility tests cover validation helpers.
