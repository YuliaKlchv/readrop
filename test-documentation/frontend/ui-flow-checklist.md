# UI Flow Checklist

## Key user flows
- [ ] Open homepage and verify app title and logo.
- [ ] Log in with valid credentials.
- [ ] Register a new account.
- [ ] Navigate to `Browse books` and confirm cards render.
- [ ] Navigate to `Discover` and interact with book actions.
- [ ] Navigate to `Give a book` and submit a listing.
- [ ] Access `Dashboard` when authenticated.
- [ ] Access `Community` and verify page copy.
- [ ] Access `Messages` and validate chat list UI.
- [ ] Click `Forgot password` link and verify redirect.
- [ ] Use top navigation links across the site.
- [ ] Validate logout flow.

## Layout and navigation checks
- [ ] Header displays logo and nav links.
- [ ] Mobile/menu toggle appears at narrow widths.
- [ ] Form fields are labeled and keyboard accessible.
- [ ] Action buttons have clear visual states.
- [ ] Content cards are readable and not clipped.
- [ ] Footer links render correctly.

## Auth and redirect checks
- [ ] Guest trying to access `/dashboard` redirects to `/login`.
- [ ] Guest trying to access `/give` redirects to `/login`.
- [ ] Authenticated user stays signed in after refresh.
- [ ] Incorrect login shows an error and keeps form state.
