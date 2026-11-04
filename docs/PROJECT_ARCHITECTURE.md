# RozgaarMitra - Full-Stack Architecture Documentation

This document describes the architectural principles, layers, communication patterns, and security mechanisms of **ROZGAARMITRA**.

---

## 1. High-Level Architecture

RozgaarMitra follows a decoupled, client-server single-page application (SPA) architecture:

```
[ Browser / Mobile Client ]
         |
         | (HTTP / REST + JSON, JWT Bearer)
         v
[ Vite + React Frontend SPA ] :5173
         |
         | (REST APIs via Axios)
         v
[ Spring Boot 3.3 Backend ] :8080
    ├── Spring Security (JWT Filter & AuthenticationEntryPoint)
    ├── REST Controllers Layer
    ├── Service / Business Logic Layer (Validation & Ownership Checks)
    ├── Spring Data JPA Repositories
    └── Hibernate ORM 6.5
         |
         | (JDBC / SQL)
         v
[ MySQL 8.0 Database ] :3306
```

---

## 2. Backend Layered Architecture

The backend (`com.rozgaarmitra`) is designed with strict separation of concerns:

1. **`entity/`**: Pure JPA entities (`User`, `Worker`, `Employer`, `Job`, `Application`) mapping directly to relational database tables.
2. **`repository/`**: Spring Data JPA repositories handling query execution, filtering, and database persistence.
3. **`service/`**: Domain business logic, transaction boundaries (`@Transactional`), ownership validation (e.g. only the employer who created a job can edit it or review its applicants), and business rule enforcement.
4. **`dto/`**: Data Transfer Objects preventing entity recursion, protecting sensitive database fields (such as password hashes), and structuring API request and response bodies.
5. **`controller/`**: REST endpoints exposing HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`), handling input validation (`@Valid`), and mapping response status codes.
6. **`security/`**: JWT token utility (`JwtUtils`), `UserDetailsServiceImpl`, authentication filters (`AuthTokenFilter`), and stateless security configuration (`SecurityConfig`).
7. **`exception/`**: Centralized error handling (`GlobalExceptionHandler`) converting domain exceptions into standard JSON error bodies with validation maps.

---

## 3. Frontend Architecture

The frontend (`frontend/src`) is built with React 18 and Vite:

1. **`layouts/`**: Reusable page framing including responsive `Navbar`, sticky `Footer`, and `ProtectedRoute` enforcing client-side authorization before page rendering.
2. **`pages/`**:
   - `auth/`: Login and role-specific registration pages (`RegisterWorkerPage`, `RegisterEmployerPage`).
   - `worker/`: Worker dashboard, job search and filter view, detailed job description with 1-click apply, application history, and editable trade profile.
   - `employer/`: Employer dashboard with applicant stats, job publishing form, job management table with status toggles, and applicant evaluation view.
3. **`components/`**: Clean, modular UI components (`JobCard`, `ApplicationCard`, `Alert`, `LoadingSpinner`, `EmptyState`, `Modal`).
4. **`services/`**: Centralized Axios API abstraction (`api.js`, `authService.js`, `jobService.js`, `workerService.js`, `employerService.js`) handling token injection and 401 interceptors.
5. **`hooks/`**: `useAuth` hook managing global authentication context, local storage persistence, and role queries (`isWorker`, `isEmployer`).

---

## 4. Security Model

1. **Password Hashing**: BCrypt with salt rounds is utilized. Passwords are never stored or logged in plain text.
2. **Stateless JWT**: Sessions are stateless (`SessionCreationPolicy.STATELESS`). The backend issues signed HMAC-SHA256 tokens valid for 24 hours.
3. **CORS Configuration**: Configured in `SecurityConfig.java` to support requests from Vite development servers and production domains.
4. **Role Enforcement**:
   - `@PreAuthorize("hasRole('WORKER')")` restricts worker endpoints.
   - `@PreAuthorize("hasRole('EMPLOYER')")` restricts employer endpoints.
   - Fine-grained service layer ownership checks verify that an employer only accesses applications submitted to their own jobs.
