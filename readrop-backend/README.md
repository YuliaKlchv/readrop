# Readrop — Java Backend (Spring Boot)

Backend for the Readrop free book giveaway platform. Built with Java 21, a
layered architecture, a relational database with SQL migrations, automated
tests, static analysis, containers, and a CI/CD pipeline. All tooling is
**free / open-source**.

Serves the `/api` contract the React frontend calls (via the Vite proxy on
port **3000**).

Open this folder directly in IntelliJ as a Maven project.

## Stack
| Area | Technology |
|------|------------|
| Language / runtime | Java 21, Spring Boot 3.3 |
| Web / security | Spring Web, Spring Security (JWT in an httpOnly cookie) |
| Persistence | Spring Data JPA, **PostgreSQL** (prod), **H2** (dev/tests) |
| Migrations | Flyway (`db/migration`) |
| Tests | JUnit 5, Mockito, AssertJ, Spring MockMvc, WireMock |
| Quality | Checkstyle, JaCoCo, SonarQube (Community) |
| Containers | Docker (multi-stage), docker-compose, Kubernetes/OpenShift manifests |
| CI/CD | Jenkins (`Jenkinsfile`) |
| Ops | Spring Boot Actuator (health/readiness/liveness probes) |

## Architecture (clean, layered)
```
web/        Thin REST controllers (HTTP only) + SPA/fallback
service/    Business rules & validation (AuthService, BookService, SubscriberService)
repository/ Spring Data JPA interfaces
model/      JPA entities (AppUser, Book, BookClaim)
dto/        Request/response records
security/   JWT issuing/verification, cookie handling, filter chain
error/      ApiException + global exception handler
config/     Demo data seeding
```

## Run

### Option A — zero setup (H2 in-memory)
```bash
mvn spring-boot:run
```
API on http://localhost:3000. H2 console: http://localhost:3000/h2-console.

### Option B — PostgreSQL via Docker
```bash
docker compose up --build
```
Starts PostgreSQL + the backend (profile `postgres`) on http://localhost:3000.

### Run the frontend against it
```bash
cd ../readrop
npm run dev       # Vite proxies /api -> :3000
```

## Demo account (seeded on first run)
`demo@readrop.app` / `ReadropDemo123!`

## API
| Method | Path | Auth | Body / Result |
|--------|------|------|---------------|
| POST | `/api/signup` | – | `{ name, email, password, city? }` → `{ user }` + cookie |
| POST | `/api/login` | – | `{ email, password }` → `{ user }` + cookie |
| POST | `/api/logout` | – | clears cookie → `{ ok: true }` |
| GET  | `/api/me` | cookie | `{ user }` |
| POST | `/api/forgot-password` | – | `{ ok: true }` |
| GET  | `/api/books` | – | `{ books, count }` — list available books |
| POST | `/api/books` | cookie | `{ title, author, genre, condition, city, description? }` → `{ book }` |
| GET  | `/api/books/my` | cookie | `{ books, count }` — user's own listings |
| POST | `/api/books/{id}/claim` | cookie | `{ message? }` → `{ claim }` |
| GET  | `/api/subscribers` | cookie | `{ count, subscribers: [...] }` |
| GET  | `/actuator/health` | – | liveness/readiness for orchestration |

## Tests
```bash
mvn test          # unit + integration + wiremock
```
- `service/*Test` — pure unit tests (Mockito)
- `web/ApiIntegrationTest` — full stack over H2 (MockMvc + Security + Flyway)
- `external/WiremockExampleTest` — stubbing an external HTTP dependency

## Quality
```bash
mvn verify                       # runs Checkstyle (report)
mvn clean verify sonar:sonar \   # needs a SonarQube server
    -Dsonar.host.url=http://localhost:9000 -Dsonar.login=<token>
```
Coverage report: `target/site/jacoco/index.html`.

## Containers & deployment
- `Dockerfile` — multi-stage build, non-root, OpenShift-friendly, actuator healthcheck.
- `docker-compose.yml` — local PostgreSQL + app.
- `deploy/k8s/` — PostgreSQL + backend Deployment/Service with probes & resource limits.
- `deploy/openshift/route.yaml` — HTTPS Route (edge termination).

## CI/CD
`Jenkinsfile` runs: build → test (JUnit report) → Checkstyle → SonarQube (main) →
package (archive jar) → Docker image (main).

## Configuration
Key properties (override via env): `PORT`, `SPRING_PROFILES_ACTIVE` (`postgres`),
`DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`, `COOKIE_SECURE`, `APP_SEED_DEMO`,
`APP_DATA_DIR`.
