FROM openjdk:17.0.2-jdk
WORKDIR /app

# Copy the built JAR into the container
COPY target/banking-management-system-0.0.1-SNAPSHOT.jar app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]