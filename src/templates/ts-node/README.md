# {{PROJECT_NAME}}

Full-stack application created with [duonexx](https://github.com/duonexx).

## Architecture

This project is built using the **Dual-Mode** fullstack pattern:

- **In Development**:
  - Frontend dev server runs on `http://localhost:5173` (Vite HMR).
  - Backend server runs on `http://localhost:3000`.
  - Frontend proxies all requests matching `/api` directly to the backend. You call `/api/...` seamlessly without CORS.
- **In Production**:
  - Running `npm run build` builds the frontend directly into `backend/public`.
  - Running `npm start` runs the backend server on port `3000`.
  - Backend serves all `/api/*` routes, serves static client assets, and provides SPA fallback (`index.html`) for client-side routing.

## Getting Started

### Development
```bash
npm run dev:full
```
Runs both the frontend dev server and backend concurrently.

### Production Build
```bash
npm run build
```

### Production Start
```bash
npm run start
```
