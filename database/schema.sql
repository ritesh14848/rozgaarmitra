-- ============================================================================
-- ROZGAARMITRA - DATABASE SCHEMA INITIALIZATION SCRIPT (MySQL 8.0+)
-- ============================================================================

-- Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS rozgaarmitra_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE rozgaarmitra_db;

-- ----------------------------------------------------------------------------
-- 1. USER TABLE
-- Primary account entity for authentication and role identification
-- STRICT REQUIREMENT: No 'status' or 'created_at' columns on USER.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    role ENUM('WORKER', 'EMPLOYER') NOT NULL,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. WORKER TABLE
-- One-to-one relationship with USER. Profile for skilled tradespeople.
-- STRICT REQUIREMENT: No 'expected_salary' column.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workers (
    worker_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    qualification VARCHAR(255) NOT NULL,
    experience INT NOT NULL,
    availability VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    hours_work ENUM('FULL_TIME', 'PART_TIME') NOT NULL,
    trade ENUM('ELECTRICIAN', 'PLUMBER', 'CARPENTER', 'PAINTER', 'WELDER', 'AC_TECHNICIAN', 'MECHANIC', 'MASON', 'OTHER') NOT NULL,
    CONSTRAINT fk_worker_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_worker_trade (trade),
    INDEX idx_worker_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. EMPLOYER TABLE
-- One-to-one relationship with USER. Organization or individual hiring.
-- STRICT REQUIREMENT: No separate 'location' field. 'address' remains.
-- 'company_name' is optional to allow individual employers.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employers (
    employer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NULL,
    industry_type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    CONSTRAINT fk_employer_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. JOBS TABLE
-- Job openings posted by employers.
-- STRICT REQUIREMENT: No 'qualification' column.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
    job_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employer_id BIGINT NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    job_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    salary DOUBLE NOT NULL,
    location VARCHAR(150) NOT NULL,
    experience_required INT NOT NULL,
    vacancy_count INT NOT NULL,
    posted_date DATE NOT NULL,
    last_date_to_apply DATE NOT NULL,
    status ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    CONSTRAINT fk_job_employer FOREIGN KEY (employer_id) REFERENCES employers(employer_id) ON DELETE CASCADE,
    INDEX idx_job_status (status),
    INDEX idx_job_category (job_category),
    INDEX idx_job_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. APPLICATION TABLE
-- Many-to-one with WORKER and JOBS.
-- STRICT REQUIREMENT: Unique constraint preventing a worker from applying
-- to the same job more than once.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    apply_date DATE NOT NULL,
    status ENUM('PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_app_worker FOREIGN KEY (worker_id) REFERENCES workers(worker_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    CONSTRAINT uk_worker_job UNIQUE (worker_id, job_id),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- NOTE: Demo jobs and demo applications have been removed to provide a clean slate.
-- Real jobs will appear as employers post them.
-- ============================================================================
