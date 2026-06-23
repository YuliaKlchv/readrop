# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace

# Cache dependencies first.
COPY pom.xml .
RUN mvn -q -B -e dependency:go-offline

# Build the application (skip tests in the image build; CI runs them).
COPY src ./src
COPY config ./config
RUN mvn -q -B -DskipTests clean package

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Run as a non-root user (OpenShift-friendly: arbitrary UID, group root).
RUN useradd -r -u 1001 -g root appuser \
    && mkdir -p /app/data \
    && chown -R 1001:0 /app \
    && chmod -R g=u /app
USER 1001

COPY --from=build /workspace/target/readrop-backend-*.jar app.jar

ENV PORT=3000 \
    SPRING_PROFILES_ACTIVE=postgres \
    APP_DATA_DIR=/app/data \
    APP_SEED_DEMO=false
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:3000/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
