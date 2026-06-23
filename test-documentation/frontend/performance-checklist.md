# Performance Checklist

## Frontend performance
- [ ] App loads successfully in under 3 seconds on local dev.
- [ ] Main page assets are delivered quickly.
- [ ] No large layout shift occurs during initial render.
- [ ] Lazy data loading is stable for book lists.

## Build readiness
- [ ] `npm run build` completes without errors.
- [ ] Production bundle size is reasonable.
- [ ] No unnecessary large dependencies are added.

## CI pipeline
- [ ] Build can run in CI with `npm run build`.
- [ ] E2E tests run reliably in headless mode.
- [ ] Jasmine utility tests execute as part of verification.

## Notes
- Keep the `vite` proxy configuration for backend API requests.
- Ensure `credentials: include` is used for auth requests to support cookies.
