# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src

# Download dependencies and build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built artifact from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create directory for environment files
RUN mkdir -p /app/config

# Expose the application port
EXPOSE 8080

# Run the application with environment-specific configuration
CMD ["java", "-jar", "app.jar"]
