# SkillOport

SkillOport is a full-stack project for a weekly creative micro-skill platform.
This repository contains both:

- a React/Vite frontend
- a Java Spring Boot backend

The frontend and backend are kept in separate folders, but they belong to the
same application and share the same `/api` contract.

## Repository Structure

```text
SkillOport/
├── skilloport/          # Frontend: React + Vite
└── skilloport-backend/  # Backend: Java 21 + Spring Boot + Maven
```

## Frontend

Location: `skilloport/`

Main technologies:

- React 18
- React Router
- Vite
- CSS Modules

What it does:

- renders the public website
- handles signup/login/register/admin UI flows
- calls the backend through `/api`
- falls back to a browser demo mode if no backend is running

Frontend quick start:

```bash
cd skilloport
npm install
npm run dev
```

The frontend runs on `http://localhost:5173/`.

## Backend

Location: `skilloport-backend/`

Main technologies:

- Java 21
- Spring Boot 3.3
- Spring Web
- Spring Security
- Spring Data JPA
- Flyway
- H2 and PostgreSQL
- Maven

What it does:

- exposes the `/api` endpoints used by the frontend
- handles authentication with JWT in an httpOnly cookie
- stores users and subscriber leads
- protects admin-related API routes
- provides tests, Docker support, and deployment configs

Backend quick start:

```bash
cd skilloport-backend
mvn spring-boot:run
```

The backend runs on `http://localhost:3000/`.

This backend project is intended to be opened directly in IntelliJ as a Maven
project.

## Run The Full App Locally

1. Start the backend:

```bash
cd skilloport-backend
mvn spring-boot:run
```

2. Start the frontend in a second terminal:

```bash
cd skilloport
npm install
npm run dev
```

3. Open:

- Frontend: `http://localhost:5173/`
- Backend API: `http://localhost:3000/`

## Demo Account

When the backend seeds demo data, you can use:

- Email: `demo@skilloport.app`
- Password: `SkillOportDemo123!`

## More Details

- Frontend notes: [skilloport/README.md](skilloport/README.md)
- Backend details: [skilloport-backend/README.md](skilloport-backend/README.md)
