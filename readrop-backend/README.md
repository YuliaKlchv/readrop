# Readrop Backend

Spring Boot backend for the Readrop free book-sharing platform. This backend is intentionally kept small, readable, and testable so it works well as a Java/Test Automation Engineer portfolio project rather than a heavily abstracted demo.

## Tech Stack

- Java 21
- Spring Boot 3
- Spring Security
- JWT authentication in an `httpOnly` cookie
- Spring Data JPA
- Flyway
- H2 for local development and automated tests
- PostgreSQL for Docker and production-style runtime
- Maven
- JUnit 5
- Mockito
- Spring Boot integration tests
- WireMock
- JaCoCo

## Why This Backend Fits a Test Automation Portfolio

- The API is small enough to understand quickly but has real auth, persistence, validation, and state transitions.
- The project includes unit, integration, and external dependency testing patterns.
- The backend runs on a fixed local port, which keeps local automation and CI setup simple.
- Docker, SonarQube, JaCoCo, and Jenkins notes are included so the project can be extended into CI/CD demonstrations later.

## Java 21 Requirement

This project requires Java 21. The Maven enforcer blocks other versions.

Check the active JDK:

```bash
java -version
mvn -version
```

On macOS, if your shell is not already using Java 21:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

## Run Locally

The backend runs on fixed port `localhost:3000`. Automatic port switching is intentionally not supported.

```bash
cd readrop-backend
mvn spring-boot:run
```

Useful local URLs:

- API base: `http://localhost:3000/api`
- Health endpoint: `http://localhost:3000/actuator/health`
- H2 console: `http://localhost:3000/h2-console`

## Demo Login

- Email: `demo@readrop.app`
- Password: `ReadropDemo123!`

Demo data is created by [`DemoSeeder.java`](/Users/yuliaklchv/Readrop/readrop-backend/src/main/java/com/readrop/config/DemoSeeder.java:1) when `APP_SEED_DEMO=true`.

## API Overview

Current core endpoints:

- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/books`
- `POST /api/books`
- `GET /api/books/my`
- `POST /api/books/{id}/claim`
- `GET /api/subscribers`

Current auth model:

- Login and signup return a session cookie named `sid`.
- The cookie is `httpOnly`, `SameSite=Lax`, and path `/`.
- JWT is not stored in `localStorage`.
- Protected endpoints rely on the cookie being sent back by the browser/client.

Current limitation:

- `GET /api/subscribers` requires authentication but does not enforce a role model yet.
- Treat it as a documented limitation, not as a finished admin authorization design.

## Run Tests

```bash
cd readrop-backend
mvn test
```

Current automated coverage includes:

- Service tests for auth and book logic
- Spring Boot integration tests for auth, cookie, and book flows
- A simple WireMock example for third-party HTTP stubbing

## JaCoCo Coverage

`mvn test` generates JaCoCo reports automatically.

Important outputs:

- XML: `target/site/jacoco/jacoco.xml`
- HTML: `target/site/jacoco/index.html`
- Exec data: `target/jacoco.exec`

No strict coverage gate is enforced yet. The goal is usable, honest coverage for a portfolio project, not inflated percentages.

## Local H2 Setup

Default local profile uses H2 in-memory storage from [`application.properties`](/Users/yuliaklchv/Readrop/readrop-backend/src/main/resources/application.properties:1).

Characteristics:

- zero-setup local boot
- Flyway migrations still run
- demo data can be enabled for quick manual testing
- ideal for service and integration tests

## PostgreSQL and Docker Runtime

The backend supports PostgreSQL through the `postgres` profile and standard Spring datasource environment variables.

Build and run with Docker Compose:

```bash
cd readrop-backend
docker compose up --build
```

Backend expectations in Docker:

- Java 21 runtime
- fixed port `3000`
- PostgreSQL datasource via environment variables
- demo data can be enabled explicitly
- JWT secret can be supplied via `JWT_SECRET` or persisted in `APP_DATA_DIR/.jwtsecret`

Important runtime environment variables:

- `PORT=3000`
- `SPRING_PROFILES_ACTIVE=postgres`
- `SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/readrop`
- `SPRING_DATASOURCE_USERNAME=readrop`
- `SPRING_DATASOURCE_PASSWORD=readrop`
- `JWT_SECRET=<32+ byte secret>` for production-style secret injection
- `APP_DATA_DIR=/app/data` if using file-based secret persistence
- `APP_SEED_DEMO=true|false`
- `COOKIE_SECURE=true|false`

Notes:

- The Docker image defaults `APP_SEED_DEMO=false`.
- The local `docker-compose.yml` turns demo seeding back on for quick testing.
- Do not hardcode production secrets in the repository.

## SonarQube Backend Scan

SonarQube support is prepared through Maven and [`sonar-project.properties`](/Users/yuliaklchv/Readrop/readrop-backend/sonar-project.properties:1).

Typical command:

```bash
cd readrop-backend
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<token>
```

Prepared inputs:

- source path: `src/main/java`
- test path: `src/test/java`
- JaCoCo XML coverage path: `target/site/jacoco/jacoco.xml`
- Surefire reports: `target/surefire-reports`

## Future Jenkins Backend Stages

Useful backend CI stages for a later Jenkins pipeline:

1. Verify Java 21.
2. Run `mvn clean test`.
3. Publish JUnit reports from `target/surefire-reports`.
4. Publish JaCoCo report from `target/site/jacoco`.
5. Run SonarQube analysis.
6. Optionally package the backend JAR or Docker image after tests pass.

See the detailed notes in [`test-documentation/backend/automation-plan.md`](/Users/yuliaklchv/Readrop/readrop-backend/test-documentation/backend/automation-plan.md:1).
