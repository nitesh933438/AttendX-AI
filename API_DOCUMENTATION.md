# AttendX AI - Technical Architecture & API Documentation

## 1. System Architecture
AttendX AI follows a client-server architecture.
- **Client:** A React 19 Single Page Application (SPA) built with Vite, acting as a Progressive Web App (PWA).
- **Server:** A Node.js/Express RESTful API that handles business logic, security, and AI integrations.
- **Database:** PostgreSQL accessed via Drizzle ORM.

## 2. API Endpoints

### 2.1 Authentication
- \`POST /api/auth/login\`
  - Body: \`{ email, password }\`
  - Returns: \`{ token, user }\`
- \`POST /api/auth/register\` (Admin only)
  - Body: \`{ name, email, password, role }\`

### 2.2 Attendance Management
- \`POST /api/attendance/session/start\`
  - Body: \`{ teacherId, subject }\`
- \`POST /api/attendance/session/end\`
  - Body: \`{ sessionId }\`
- \`POST /api/attendance/mark\`
  - Body: \`{ sessionId, studentId, faceData }\`
  - Desc: Validates face data against registered embeddings before marking attendance.
- \`GET /api/attendance/session/:sessionId\`
  - Returns: Real-time list of present students.

### 2.3 User Management
- \`GET /api/users/:role\`
  - Returns: List of users filtered by role (e.g., 'students', 'teachers').
- \`GET /api/user/profile\`
  - Headers: \`Authorization: Bearer <token>\`
  - Returns: Current user's profile details.

### 2.4 Face Registration
- \`POST /api/face/register\`
  - Body: \`{ userId, faceEmbeddings, images }\`
  - Desc: Securely stores encrypted facial vectors for recognition.

### 2.5 System
- \`GET /api/database/backup\` (Admin only)
  - Returns: JSON export of all database tables.

## 3. Database Schema (Drizzle ORM)

### Users
- \`id\` (Serial, PK)
- \`name\` (Varchar)
- \`email\` (Varchar, Unique)
- \`password_hash\` (Varchar)
- \`role\` (Enum: admin, teacher, student)
- \`created_at\` (Timestamp)

### Sessions
- \`id\` (Serial, PK)
- \`teacher_id\` (FK -> Users.id)
- \`subject\` (Varchar)
- \`status\` (Enum: active, closed)
- \`start_time\` (Timestamp)

### Attendances
- \`id\` (Serial, PK)
- \`session_id\` (FK -> Sessions.id)
- \`student_id\` (FK -> Users.id)
- \`timestamp\` (Timestamp)
- \`status\` (Enum: present, absent)

## 4. Security & Middleware
- **Helmet:** Sets secure HTTP headers to prevent XSS and Clickjacking.
- **Express-Rate-Limit:** Restricts IP requests to mitigate DDoS and brute-force attacks.
- **JWT Middleware:** Protects all routes except \`/login\`. Validates token signatures and expiration.
- **Role Guard:** Custom middleware ensuring students cannot access teacher endpoints, and teachers cannot access admin endpoints.
