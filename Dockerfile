# Build stage using JDK 17
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy maven wrapper and pom.xml from backend/
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x ./mvnw

# Copy source code and build jar
COPY backend/src/ src/
RUN ./mvnw clean package -DskipTests

# Run stage using lightweight JRE 17
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/rozgaarmitra-backend-1.0.0.jar app.jar

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
