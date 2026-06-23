# Readrop Frontend

This repository contains the Readrop React frontend, a free book-sharing platform.

## Frontend setup

### Run locally
1. Navigate to the `readrop` folder.
2. Install dependencies:
   ```bash
   cd readrop
   npm install
   ```
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:4173`.

### Build for production
```bash
npm run build
```

## Testing

### Jasmine utility tests
```bash
npm run test:jasmine
```

### Cucumber / Selenium E2E tests
1. Start the backend on `http://localhost:3000`.
2. Start the frontend dev server in another terminal:
   ```bash
   npm run dev
   ```
3. Run headless E2E tests:
   ```bash
   npm run test:e2e
   ```
4. Run headed E2E tests:
   ```bash
   npm run test:e2e:headed
   ```

### Docker
Build the frontend container from `readrop`:
```bash
cd readrop
docker build -t readrop-frontend .
```

## Backend assumptions
- The backend API runs at `http://localhost:3000`.
- Vite proxies `/api` requests to `http://localhost:3000`.
- Auth is handled via httpOnly cookies.

## Demo login
- Email: `demo@readrop.app`
- Password: `ReadropDemo123!`

## Notes for test automation engineers
- The frontend uses `data-testid` attributes on critical controls for stable selectors.
- The API helper uses `credentials: include` for auth cookies.
- Keep the existing React Router v6 flow and Context API auth provider.
