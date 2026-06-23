# Frontend Automation Plan

## Goals
- Provide stable UI regression coverage for Readrop frontend.
- Enable Cucumber BDD scenarios that match business-critical flows.
- Support Selenium WebDriver tests for browser-level validation.
- Keep automation lightweight and compatible with the existing React app.

## Scope
- Login and registration flows
- Book discovery and claim actions
- Book listing via Give Book
- Protected page access and redirects
- Dashboard access for authenticated users

## Recommended approach
1. Keep the frontend routes and data-testid selectors stable.
2. Use Cucumber feature files for high-level scenarios.
3. Implement Selenium WebDriver step definitions in `readrop/e2e/step-definitions`.
4. Use `HEADLESS=true` for CI-friendly E2E runs and `HEADLESS=false` for local debugging.
5. Keep Jasmine reserved for small utility tests, not React components.

## Delivery plan
- `readrop/e2e/features`: feature scenarios.
- `readrop/e2e/step-definitions`: browser glue code.
- `readrop/e2e/support`: configuration, hooks, and shared world state.
- `readrop/spec`: Jasmine specs for `src/lib/validation.js`.
- `readrop/Dockerfile` and `.dockerignore`: containerize the frontend.

## CI recommendations
- `npm install`
- `npm run build`
- `npm run test:jasmine`
- `npm run test:e2e`

## Backend assumptions
- Backend is running at `http://localhost:3000`.
- Frontend dev server runs at `http://localhost:4173` by default.
- Auth cookies are httpOnly and shared through `/api` proxy.
