# ROZGAARMITRA - Skilled Trades Job-Matching Platform

**RozgaarMitra** (रोज़गार मित्र) is a full-stack web application designed specifically to bridge the gap between skilled tradespeople (electricians, plumbers, carpenters, painters, welders, AC/refrigeration technicians, mechanics, masons) and homeowners, individual contractors, or commercial businesses in India.

---

## 1. Technology Stack

- **Frontend:** React 18, Vite, React Router 6, Axios, Lucide React icons, Vanilla CSS Design System.
- **Backend:** Java 17+, Spring Boot 3.3.4, Spring Security, Spring Data JPA, Hibernate ORM 6.5, JJWT (io.jsonwebtoken), Bean Validation.
- **Database:** MySQL 8.0+ (with H2 in-memory DB for automated offline test suites).
- **Build Tools:** Maven Wrapper (`mvnw`), npm.

---

## 2. Project Structure

```
ROZGAARMITRA/
├── frontend/                     # React + Vite Frontend
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # JobCard, ApplicationCard, Modal, Alert, etc.
│   │   ├── hooks/                # useAuth.jsx (JWT auth context)
│   │   ├── layouts/              # Navbar, Footer, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── auth/             # LoginPage, RegisterWorkerPage, RegisterEmployerPage
│   │   │   ├── worker/           # WorkerDashboard, BrowseJobs, JobDetails, MyApplications, WorkerProfile
│   │   │   └── employer/         # EmployerDashboard, PostJob, ManageJobs, JobApplicants, EmployerProfile
│   │   ├── services/             # Axios API service clients
│   │   ├── utils/                # Constants (Trades, Statuses) & Formatters
│   │   ├── App.jsx               # Routes definition
│   │   ├── index.css             # Navy & teal design system
│   │   └── main.jsx              # React DOM root
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                      # Spring Boot Backend
│   ├── src/main/java/com/rozgaarmitra/
│   │   ├── RozgaarMitraApplication.java
│   │   ├── controller/           # AuthController, JobController, WorkerController, EmployerController, ApplicationController
│   │   ├── dto/                  # Request & Response Data Transfer Objects
│   │   ├── entity/               # The 5 Core Entities: User, Worker, Employer, Job, Application
│   │   ├── exception/            # GlobalExceptionHandler & Custom Exceptions
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # SecurityConfig, JwtUtils, AuthTokenFilter, UserDetailsServiceImpl
│   │   └── service/              # AuthService, JobService, WorkerService, EmployerService, ApplicationService
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-example.properties
│   ├── src/test/                 # Unit & integration tests
│   ├── mvnw & mvnw.cmd           # Maven Wrapper
│   └── pom.xml
│
├── database/
│   ├── schema.sql                # Complete MySQL DDL & demo seed data
│   └── README.md                 # Detailed database instructions
│
├── docs/
│   ├── API_DOCUMENTATION.md      # Full REST endpoint reference
│   ├── DATABASE_DESIGN.md        # Relational schema & constraints
│   └── PROJECT_ARCHITECTURE.md   # Architectural breakdown
│
├── .gitignore
├── DEPLOYMENT_GUIDE.md
└── README.md
```

---

## 3. The 5 Core Business Entities

The platform strictly implements the five business entities requested:

1. **`User`**: Central account identity with email, securely hashed password (BCrypt), phone number, and role (`WORKER` or `EMPLOYER`).
2. **`Worker`**: One-to-one with `User`. Stores trade (`ELECTRICIAN`, `PLUMBER`, `CARPENTER`, etc.), experience (years), qualification, availability, location, and hours of work (`FULL_TIME` or `PART_TIME`).
3. **`Employer`**: One-to-one with `User`. Stores company name (optional for individual homeowners), industry type, and physical address.
4. **`Job`**: Many-to-one with `Employer`. Stores job title, category, description, salary, location, experience required, vacancy count, posted date, last date to apply, and status (`OPEN` or `CLOSED`).
5. **`Application`**: Many-to-one with `Worker` and `Job`. Tracks status (`PENDING`, `SHORTLISTED`, `REJECTED`, `ACCEPTED`) and enforces a **database unique constraint** preventing duplicate applications.

---

## 4. Local Installation & Running Instructions

### Step 1: Clone or Navigate to the Workspace
```powershell
cd "C:\Users\Ritesh Mahajan\.gemini\antigravity\scratch\ROZGAARMITRA"
```

---

### Step 2: Database Setup
1. Ensure your local MySQL server is running (port 3306).
2. Execute the initialization script in `database/schema.sql`:
   ```powershell
   mysql -u root -p < database/schema.sql
   ```
3. If your MySQL credentials differ from `root`/`root`, set the environment variables:
   ```powershell
   $env:DB_USERNAME="your_username"
   $env:DB_PASSWORD="your_password"
   ```

---

### Step 3: Run the Spring Boot Backend
1. Open a terminal and navigate to `backend/`:
   ```powershell
   cd backend
   ```
2. Run backend tests to verify your setup:
   ```powershell
   .\mvnw.cmd test
   ```
3. Start the Spring Boot server:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   The backend starts at `http://localhost:8080`.

---

### Step 4: Run the React Frontend
1. Open a second terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   ```
2. Install frontend dependencies (already pre-installed during generation):
   ```powershell
   npm.cmd install
   ```
3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 5. Default Test Accounts

If you loaded `database/schema.sql`, you can immediately test the platform using:

| Role | Email | Password | Trade / Details |
|---|---|---|---|
| **Worker** | `ramesh.worker@example.com` | `password123` | Electrician (Delhi NCR, 4 yrs exp) |
| **Worker** | `sunil.worker@example.com` | `password123` | Plumber (Pune, 6 yrs exp) |
| **Employer** | `anil.employer@example.com` | `password123` | Verma Electrical Contracting Ltd |
| **Employer** | `pooja.employer@example.com` | `password123` | Private Individual Homeowner |

You can also register new worker or employer accounts directly from the UI.

---

## 6. Pushing to GitHub

To publish this project to your GitHub account:

1. Initialize git in the root folder:
   ```powershell
   cd "C:\Users\Ritesh Mahajan\.gemini\antigravity\scratch\ROZGAARMITRA"
   git init
   git add .
   git commit -m "Initial commit: Complete RozgaarMitra full-stack platform"
   ```
2. Create an empty repository named `ROZGAARMITRA` on GitHub.
3. Link your remote repository and push:
   ```powershell
   git remote add origin https://github.com/<your-username>/ROZGAARMITRA.git
   git branch -M main
   git push -u origin main
   ```

---

## 7. License

Built for educational and real-world skilled workforce enablement.
