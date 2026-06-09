# Readrop

Readrop is a free book giveaway platform — list the books you've finished and let
someone nearby take them for free.

This repository contains both:

- a React/Vite frontend
- a Java Spring Boot backend

The frontend and backend are kept in separate folders but share the same `/api` contract.

## Repository Structure

```text
SkillOport/
├── readrop/          # Frontend: React + Vite
└── readrop-backend/  # Backend: Java 21 + Spring Boot + Maven
```

## Frontend

Location: `readrop/`

Main technologies:

- React 18
- React Router
- Vite
- CSS Modules

What it does:

- renders the public website (Home, Browse books, Give a book)
- handles signup/login/register/admin UI flows
- calls the backend through `/api`
- falls back to a browser demo mode if no backend is running

Frontend quick start:

```bash
cd readrop
npm install
npm run dev
```

The frontend runs on `http://localhost:5173/`.

## Backend

Location: `readrop-backend/`

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
- stores users, book listings, and claim requests
- protects admin-related API routes
- provides tests, Docker support, and deployment configs

Backend quick start:

```bash
cd readrop-backend
mvn spring-boot:run
```

The backend runs on `http://localhost:3000/`.

Open `readrop-backend/` directly in IntelliJ as a Maven project.

## Run The Full App Locally

1. Start the backend:

```bash
cd readrop-backend
mvn spring-boot:run
```

2. Start the frontend in a second terminal:

```bash
cd readrop
npm install
npm run dev
```

3. Open:

- Frontend: `http://localhost:5173/`
- Backend API: `http://localhost:3000/`

## Demo Account

When the backend seeds demo data, you can use:

- Email: `demo@readrop.app`
- Password: `ReadropDemo123!`

## More Details

- Frontend notes: [readrop/README.md](readrop/README.md)
- Backend details: [readrop-backend/README.md](readrop-backend/README.md)
