# RozgaarMitra - Production Deployment Guide

This guide provides step-by-step instructions for deploying **ROZGAARMITRA** to cloud production environments.

---

## 1. Production Architecture Overview

In production, the platform consists of three separate, independently scalable tiers:
1. **Database**: Managed MySQL (e.g. AWS RDS MySQL, Aiven for MySQL, or Railway MySQL).
2. **Backend**: Spring Boot container or Java runtime (e.g. Render, Railway, AWS EC2, or Docker on DigitalOcean).
3. **Frontend**: Static Web App on a global CDN (e.g. Vercel, Netlify, or AWS CloudFront/S3).

---

## 2. Step 1: Deploying the MySQL Database

### Using AWS RDS (or Aiven / Railway MySQL):
1. Create a MySQL 8.0 instance on your chosen provider.
2. Configure a security group allowing inbound traffic on port `3306` from your backend server's IP or VPC.
3. Connect using MySQL Workbench or CLI:
   ```bash
   mysql -h your-db-host.rds.amazonaws.com -u admin -p
   ```
4. Run the schema creation script from `database/schema.sql`:
   ```sql
   source /path/to/database/schema.sql;
   ```
5. Record your connection details securely:
   - Host: `your-db-host.rds.amazonaws.com`
   - Port: `3306`
   - Database Name: `rozgaarmitra_db`
   - Username: `admin`
   - Password: `<secure-password>`

---

## 3. Step 2: Deploying the Spring Boot Backend

### Option A: Deploy on Render / Railway (PaaS)
1. In your backend project root (`backend/`), configure your environment variables:
   ```env
   SERVER_PORT=8080
   DB_HOST=your-db-host.rds.amazonaws.com
   DB_PORT=3306
   DB_NAME=rozgaarmitra_db
   DB_USERNAME=admin
   DB_PASSWORD=your_secure_password
   JWT_SECRET=YourProductionSecretKeyMustBeVeryLongAndSecureHS256Key123456!
   JWT_EXPIRATION_MS=86400000
   ```
2. Build command:
   ```bash
   ./mvnw clean package -DskipTests
   ```
3. Start command:
   ```bash
   java -jar target/rozgaarmitra-backend-1.0.0.jar
   ```

### Option B: Containerize with Docker
Create a `Dockerfile` in `backend/`:
```dockerfile
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/rozgaarmitra-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 4. Step 3: Deploying the React Frontend

### Deploying on Vercel or Netlify:
1. Set the root directory of the site to `frontend/`.
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Set the Environment Variable:
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```
4. For Single Page Application client-side routing on Netlify, add a `frontend/public/_redirects` file:
   ```
   /*    /index.html   200
   ```
   For Vercel, a `vercel.json` rewrites rule handles this automatically:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 5. Security Checklist Before Going Live

- [ ] Changed the default `JWT_SECRET` to a 256-bit cryptographically random string.
- [ ] Switched `spring.jpa.hibernate.ddl-auto` from `update` to `validate` in production so Hibernate does not alter the live schema unexpectedly.
- [ ] Enabled HTTPS / SSL certificates for both frontend and backend domains.
- [ ] Confirmed that MySQL credentials are supplied exclusively through environment variables and never committed to Git.
