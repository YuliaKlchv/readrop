# Backend Performance Test Plan

## Objective

Keep performance testing lightweight and realistic for a portfolio backend. The goal is to validate basic responsiveness and create a clear path for future load testing, not to build a full performance lab now.

## Initial Endpoints in Scope

- `GET /api/books`
- `POST /api/login`
- `POST /api/books`
- `POST /api/books/{id}/claim`

## Suggested Local Response-Time Expectations

These are simple local-development targets, not production SLAs.

- `GET /api/books`: under `300 ms` for normal seeded data
- `POST /api/login`: under `500 ms`
- `POST /api/books`: under `500 ms`
- `POST /api/books/{id}/claim`: under `500 ms`

## Normal Load Definition

For this project, treat normal local load as:

- 1 to 10 concurrent users
- small dataset to moderate seeded dataset
- local H2 or Docker PostgreSQL
- no external network dependencies in the main flow

## Smoke-Level curl Checks

### Public Books
```bash
curl -s -o /dev/null -w "GET /api/books -> %{http_code} in %{time_total}s\n" \
  http://localhost:3000/api/books
```

### Login
```bash
curl -s -o /dev/null -w "POST /api/login -> %{http_code} in %{time_total}s\n" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@readrop.app","password":"ReadropDemo123!"}' \
  http://localhost:3000/api/login
```

### Create Book
```bash
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@readrop.app","password":"ReadropDemo123!"}' \
  http://localhost:3000/api/login

curl -s -b cookies.txt -o /dev/null \
  -w "POST /api/books -> %{http_code} in %{time_total}s\n" \
  -H "Content-Type: application/json" \
  -d '{"title":"Perf Test","author":"QA","genre":"Testing","condition":"GOOD","city":"Vienna"}' \
  http://localhost:3000/api/books
```

## What to Observe

- status code stability under repeated calls
- major response-time spikes
- excessive startup delay before the first request
- obvious DB bottlenecks around listing and claiming
- unexpected auth overhead for login and protected endpoints

## Useful Future Extensions

- `k6` for simple scripted API load
- JMeter for broader portfolio coverage
- Docker-based PostgreSQL performance comparison against local H2
- response-time trend capture in CI for smoke/perf visibility

## Out of Scope for Now

- distributed load generation
- browser rendering performance
- deep JVM profiling
- advanced throughput benchmarking
