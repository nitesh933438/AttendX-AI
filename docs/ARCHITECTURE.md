# AttendX AI — Architecture & System Design Document

## 1. System Overview

AttendX AI is a full-stack, enterprise-grade AI Facial Recognition and Automated Attendance Management platform. It delivers automated biometric recognition, anti-spoofing liveness checks, role-based access control, live session monitoring, edge-case rejection logging, and automated reporting.

```
+-----------------------------------------------------------------------+
|                             CLIENT LAYER                              |
|   React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion (motion) |
+-----------------------------------------------------------------------+
                                   |
                                   v  HTTP/REST (Port 3000)
+-----------------------------------------------------------------------+
|                             SERVER LAYER                              |
|           Express + Node ESM/CommonJS + TSX + ESBuild                 |
+-----------------------------------------------------------------------+
        |                                                 |
        v                                                 v
+-----------------------+                       +-----------------------+
|  DATABASE (PGlite/    |                       |  AI VECTOR ENGINE     |
|   Supabase SQL)       |                       |  Face Liveness HUD    |
+-----------------------+                       +-----------------------+
```

---

## 2. Core Architectural Pillars

### A. Automatic Facial Attendance Engine
1. **Teacher Trigger**: Active session started with specific course, department, semester, section, and timer.
2. **Student Auto Scan**: Student dashboard periodically polls `/api/sessions/active`. When active, camera stream activates automatically.
3. **5-Phase Liveness Verification**:
   - Camera stream initialization
   - Face detection & lighting check
   - Blink check challenge
   - Smile & pose check challenge
   - Vector distance match against stored biometrics
4. **Validation Rules**:
   - Duplicate attendance protection (blocked if already marked).
   - Class mismatch protection (blocked if student's enrolled department/semester/section does not match active session).
   - Expiration protection (blocked if session timer reached zero).

### B. Security & Anti-Spoofing Rejection Telemetry
- Every recognition attempt measures liveness score, face count, blur score, lighting quality, and device fingerprints.
- Failed attempts and unknown faces are automatically logged to AI Telemetry for administrative audit.

### C. Database Architecture
- Primary persistence: Supabase PostgreSQL / PGlite with Drizzle ORM schemas.
- Tables: `users`, `departments`, `courses`, `attendance_sessions`, `attendance_records`, `face_templates`, `ai_recognition_logs`, `failed_recognition_logs`, `unknown_face_logs`.

---

## 3. Modular Code Structure

- **`/src/components/common/`**: Reusable atomic UI system (Modals, Tables, Confirmation Dialogs, Search, Pagination, Loading, Error Boundaries).
- **`/src/context/`**: State providers for Auth, Theme, and Toast notifications.
- **`/src/services/`**: Standardized API service client (`apiClient.ts`).
- **`/src/hooks/`**: Custom hooks for Attendance polling, Modals, Pagination, Debouncing.
- **`/src/lib/`**: Core utilities, constants, environment validation, and enterprise logger.
- **`/database/`**: SQL migrations, RLS policies, performance indexes, triggers, seed data.
