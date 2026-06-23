# Backend Automation Plan

## Goal

Build a clean, portfolio-friendly backend automation pack that demonstrates practical Java testing skills without overengineering the service.

## Current Automated Layers

- Unit tests with JUnit 5 and Mockito
- Integration tests with Spring Boot, H2, Flyway, and MockMvc
- External HTTP stubbing example with WireMock
- Coverage reporting with JaCoCo

## Recommended Test Pyramid for This Project

### 1. Service Tests
- Fast feedback for validation and business rules in `AuthService` and `BookService`
- Good place for duplicate, ownership, and invalid input rules
- Low maintenance and ideal for regression around edge cases

### 2. Integration API Tests
- Verify controller, security, cookie, JPA, and Flyway wiring together
- Cover login, logout, protected endpoints, create-book, my-books, and claim flows
- Keep this layer small but meaningful

### 3. External Dependency Tests
- Keep WireMock example simple
- Use it later if the backend gains email, payment, notification, or partner-service integrations

## Scope for Automation

### Must Keep Automated
- Valid signup and login
- Negative login
- Protected endpoint access control
- Cookie creation and clearing
- Book creation validation
- Book ownership restrictions
- Claim state transitions

### Good Manual or Future Automation Candidates
- Browser-level session behavior
- Cross-browser cookie security checks
- Load and response-time testing under concurrency
- Role-based authorization once a real role model exists

## Data Strategy

- Use demo seeding for manual testing and smoke checks
- Use unique emails in integration tests to avoid collisions
- Keep unit tests fully isolated with mocks
- Prefer H2 for automated integration tests to keep setup simple

## CI and Reporting Plan

### Maven Test Command
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
mvn clean test
```

### Reports to Preserve
- JUnit XML: `target/surefire-reports`
- JaCoCo XML: `target/site/jacoco/jacoco.xml`
- JaCoCo HTML: `target/site/jacoco/index.html`
- Checkstyle: `target/checkstyle-result.xml`

## SonarQube Notes

Prepared inputs already exist:

- source path `src/main/java`
- test path `src/test/java`
- JaCoCo XML path `target/site/jacoco/jacoco.xml`
- Surefire reports `target/surefire-reports`

Suggested command:

```bash
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=<token>
```

## Future Jenkins Backend Stages

1. Verify Java 21 with `java -version` and `mvn -version`.
2. Run `mvn clean test`.
3. Archive `target/surefire-reports/*.xml`.
4. Archive `target/site/jacoco/**/*`.
5. Run SonarQube analysis with Maven.
6. Optionally package the JAR after test success.

## Practical Next Steps

1. Keep expanding negative API coverage, not just happy paths.
2. Add a few dedicated tests around JWT invalid/expired behavior if expiry configuration becomes testable.
3. Add role-based authorization tests only after the backend introduces real roles and policy rules.
4. Consider a small Postman or REST Assured collection later if cross-tool portfolio evidence is useful.
