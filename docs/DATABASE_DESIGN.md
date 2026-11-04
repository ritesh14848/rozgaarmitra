# RozgaarMitra - Database Design

This document details the database architecture and entity-relationship model for **ROZGAARMITRA**.

---

## 1. Entity-Relationship Overview

The platform is built with exactly five core business entities:

```
  +------------------+
  |       USER       |
  +------------------+
          |
   1:1    |    1:1
   +------+------+
   |             |
   v             v
+--------+   +----------+
| WORKER |   | EMPLOYER |
+--------+   +----------+
   |              |
   |              | 1:N
   |              v
   |         +----------+
   |         |   JOBS   |
   |         +----------+
   |              |
   | 1:N          | 1:N
   v              v
+-----------------------+
|      APPLICATION      |
+-----------------------+
```

---

## 2. Entity Details

### 2.1 USER
- **Table Name:** `users`
- **Purpose:** Central authentication identity.
- **Rules:** No `status` or `created_at` fields.
- **Attributes:**
  - `user_id`: BIGINT, PK, Auto Increment
  - `name`: VARCHAR(100), NOT NULL
  - `email`: VARCHAR(150), NOT NULL, UNIQUE
  - `password`: VARCHAR(255), NOT NULL (BCrypt hashed)
  - `phone_no`: VARCHAR(20), NOT NULL
  - `role`: ENUM('WORKER', 'EMPLOYER'), NOT NULL

---

### 2.2 WORKER
- **Table Name:** `workers`
- **Purpose:** Profile of the skilled tradesperson.
- **Rules:** No `expected_salary` field.
- **Attributes:**
  - `worker_id`: BIGINT, PK, Auto Increment
  - `user_id`: BIGINT, NOT NULL, UNIQUE, FK -> `users(user_id)`
  - `qualification`: VARCHAR(255), NOT NULL
  - `experience`: INT, NOT NULL (in years)
  - `availability`: VARCHAR(100), NOT NULL
  - `location`: VARCHAR(150), NOT NULL
  - `hours_work`: ENUM('FULL_TIME', 'PART_TIME'), NOT NULL
  - `trade`: ENUM('ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER', 'WELDER', 'AC_TECHNICIAN', 'MECHANIC', 'MASON', 'OTHER'), NOT NULL

---

### 2.3 EMPLOYER
- **Table Name:** `employers`
- **Purpose:** Profile for individuals or organizations hiring.
- **Rules:** No separate `location` field (`address` remains). `company_name` is nullable for individuals.
- **Attributes:**
  - `employer_id`: BIGINT, PK, Auto Increment
  - `user_id`: BIGINT, NOT NULL, UNIQUE, FK -> `users(user_id)`
  - `company_name`: VARCHAR(150), NULL (optional for homeowners)
  - `industry_type`: VARCHAR(100), NOT NULL
  - `address`: TEXT, NOT NULL

---

### 2.4 JOBS
- **Table Name:** `jobs`
- **Purpose:** Job postings for skilled work.
- **Rules:** No `qualification` field.
- **Attributes:**
  - `job_id`: BIGINT, PK, Auto Increment
  - `employer_id`: BIGINT, NOT NULL, FK -> `employers(employer_id)`
  - `job_title`: VARCHAR(150), NOT NULL
  - `job_category`: VARCHAR(100), NOT NULL
  - `description`: TEXT, NOT NULL
  - `salary`: DOUBLE, NOT NULL
  - `location`: VARCHAR(150), NOT NULL
  - `experience_required`: INT, NOT NULL
  - `vacancy_count`: INT, NOT NULL
  - `posted_date`: DATE, NOT NULL
  - `last_date_to_apply`: DATE, NOT NULL
  - `status`: ENUM('OPEN', 'CLOSED'), NOT NULL

---

### 2.5 APPLICATION
- **Table Name:** `applications`
- **Purpose:** Tracks an application by a worker for a job opening.
- **Unique Constraint:** `(worker_id, job_id)` prevents double applications.
- **Attributes:**
  - `application_id`: BIGINT, PK, Auto Increment
  - `worker_id`: BIGINT, NOT NULL, FK -> `workers(worker_id)`
  - `job_id`: BIGINT, NOT NULL, FK -> `jobs(job_id)`
  - `apply_date`: DATE, NOT NULL
  - `status`: ENUM('PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'), NOT NULL
