# RozgaarMitra - Database Setup & Configuration

This directory contains the MySQL database scripts and instructions for **ROZGAARMITRA**.

---

## 1. Prerequisites

- **MySQL Server 8.0+** installed and running on your system.
- Standard default port: `3306`.

---

## 2. Setting Up the Database Locally

### Method A: Using MySQL Command Line Client

1. Open your terminal or PowerShell and log into MySQL as root:
   ```powershell
   mysql -u root -p
   ```
2. Enter your MySQL password when prompted.
3. Run the initialization script directly:
   ```sql
   source C:/Users/Ritesh Mahajan/.gemini/antigravity/scratch/ROZGAARMITRA/database/schema.sql;
   ```
4. Verify the created tables:
   ```sql
   USE rozgaarmitra_db;
   SHOW TABLES;
   ```

You should see the five business entities:
- `users`
- `workers`
- `employers`
- `jobs`
- `applications`

---

### Method B: Using MySQL Workbench or phpMyAdmin

1. Open MySQL Workbench.
2. Connect to your local MySQL instance.
3. Click **File -> Open SQL Script...** and select `database/schema.sql`.
4. Click the lightning bolt icon (**Execute**) to run the script.

---

## 3. Connecting the Backend to MySQL

The Spring Boot backend reads database connection parameters from environment variables (with default fallbacks):

| Environment Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL host address |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `rozgaarmitra_db` | Database schema name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `root` | MySQL password |

### Safe Schema Management
The backend is configured with:
```properties
spring.jpa.hibernate.ddl-auto=update
```
- **`update`** compares the entity definitions with your MySQL database schema.
- It safely adds missing columns or constraints **without dropping or deleting existing records**.
- It ensures you do not lose data between application restarts.

---

## 4. Default Demo Accounts

If you run the seed data included in `schema.sql`, you can log in with:

| Account Type | Email | Password |
|---|---|---|
| Skilled Worker | `ramesh.worker@example.com` | `password123` |
| Skilled Worker | `sunil.worker@example.com` | `password123` |
| Company Employer | `anil.employer@example.com` | `password123` |
| Individual Employer | `pooja.employer@example.com` | `password123` |
