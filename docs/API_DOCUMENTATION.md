# RozgaarMitra - REST API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require the following HTTP header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register Worker
- **Method:** `POST`
- **Path:** `/auth/register/worker`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh.kumar@example.com",
  "password": "Password123!",
  "phoneNo": "9812345678",
  "qualification": "ITI Wireman Certificate",
  "experience": 4,
  "availability": "Immediate",
  "location": "Delhi NCR",
  "hoursWork": "FULL_TIME",
  "trade": "ELECTRICIAN"
}
```
- **Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "Ramesh Kumar",
  "email": "ramesh.kumar@example.com",
  "role": "WORKER",
  "profileId": 1
}
```

---

### 1.2 Register Employer
- **Method:** `POST`
- **Path:** `/auth/register/employer`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Anil Sharma",
  "email": "anil.sharma@example.com",
  "password": "Password123!",
  "phoneNo": "9876543210",
  "companyName": "Sharma Electricals",
  "industryType": "Commercial Contracting",
  "address": "45 Industrial Area, Delhi"
}
```
*(Note: `companyName` is optional for individual employers).*
- **Response:** `201 Created`

---

### 1.3 User Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "ramesh.kumar@example.com",
  "password": "Password123!"
}
```
- **Response:** `200 OK` (returns JWT token and user profile ID).

---

### 1.4 Get Current Authenticated User
- **Method:** `GET`
- **Path:** `/auth/me`
- **Access:** Authenticated (WORKER or EMPLOYER)
- **Response:** `200 OK`

---

## 2. Jobs Endpoints

### 2.1 Browse Open Jobs (with optional search)
- **Method:** `GET`
- **Path:** `/jobs`
- **Query Params:**
  - `category` (optional, e.g. `ELECTRICIAN`)
  - `location` (optional, e.g. `Delhi`)
- **Access:** Public
- **Response:** `200 OK` (Array of open `JobResponse` objects).

---

### 2.2 Get Job Details by ID
- **Method:** `GET`
- **Path:** `/jobs/{id}`
- **Access:** Public
- **Response:** `200 OK`

---

### 2.3 Create a Job Opening
- **Method:** `POST`
- **Path:** `/jobs`
- **Access:** Employer (`ROLE_EMPLOYER`)
- **Request Body:**
```json
{
  "jobTitle": "Lead Building Electrician",
  "jobCategory": "ELECTRICIAN",
  "description": "Full electrical layout and DB installation for 3-story office building.",
  "salary": 28000.0,
  "location": "Sector 62, Noida",
  "experienceRequired": 3,
  "vacancyCount": 2,
  "lastDateToApply": "2026-11-20"
}
```
- **Response:** `201 Created`

---

### 2.4 Update Job
- **Method:** `PUT`
- **Path:** `/jobs/{id}`
- **Access:** Employer (Only the owner employer)
- **Response:** `200 OK`

---

### 2.5 Update Job Status (Open/Closed)
- **Method:** `PATCH`
- **Path:** `/jobs/{id}/status`
- **Access:** Employer (Owner only)
- **Request Body:**
```json
{
  "status": "CLOSED"
}
```
- **Response:** `200 OK`

---

## 3. Worker Endpoints

### 3.1 Get Worker Profile
- **Method:** `GET`
- **Path:** `/worker/profile`
- **Access:** Worker (`ROLE_WORKER`)

### 3.2 Update Worker Profile
- **Method:** `PUT`
- **Path:** `/worker/profile`
- **Access:** Worker (`ROLE_WORKER`)

---

## 4. Application Endpoints

### 4.1 Apply for a Job
- **Method:** `POST`
- **Path:** `/applications`
- **Access:** Worker (`ROLE_WORKER`)
- **Request Body:**
```json
{
  "jobId": 1
}
```
- **Validation Rules Enforced:**
  - Worker cannot apply to a CLOSED job (returns `400 Bad Request`).
  - Worker cannot apply after `lastDateToApply` (returns `400 Bad Request`).
  - Worker cannot apply to the same job twice (returns `409 Conflict`).
- **Response:** `201 Created`

---

### 4.2 Worker: View Own Applications
- **Method:** `GET`
- **Path:** `/applications/my`
- **Access:** Worker (`ROLE_WORKER`)
- **Response:** `200 OK`

---

## 5. Employer Endpoints

### 5.1 Get Employer Profile
- **Method:** `GET`
- **Path:** `/employer/profile`
- **Access:** Employer (`ROLE_EMPLOYER`)

### 5.2 Update Employer Profile
- **Method:** `PUT`
- **Path:** `/employer/profile`
- **Access:** Employer (`ROLE_EMPLOYER`)

### 5.3 View All Jobs Posted by Employer
- **Method:** `GET`
- **Path:** `/employer/jobs`
- **Access:** Employer (`ROLE_EMPLOYER`)

### 5.4 View Applications for a Specific Job
- **Method:** `GET`
- **Path:** `/employer/jobs/{jobId}/applications`
- **Access:** Employer (Owner only)

### 5.5 View All Applications Across All Posted Jobs
- **Method:** `GET`
- **Path:** `/employer/applications`
- **Access:** Employer (`ROLE_EMPLOYER`)

### 5.6 Update Applicant Status
- **Method:** `PATCH`
- **Path:** `/employer/applications/{applicationId}/status`
- **Access:** Employer (Owner only)
- **Request Body:**
```json
{
  "status": "SHORTLISTED"
}
```
*(Permitted values: `PENDING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`)*.
