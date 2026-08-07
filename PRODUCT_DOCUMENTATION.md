# AttendX AI - Product Requirement Document (PRD) & Software Requirement Specification (SRS)

## 1. Executive Summary
**Project Name:** AttendX AI
**Tagline:** Smart Camera Attendance System
**Project Goal:** Build a real commercial SaaS attendance platform.

AttendX AI is a state-of-the-art, AI-powered Biometric Attendance System designed to serve educational institutions and corporate environments. Replacing outdated manual roll calls and card-swiping systems, AttendX AI uses fast, secure, and accurate facial recognition to automate attendance tracking. The platform provides real-time analytics, comprehensive reporting, and distinct role-based dashboards (Admin, Teacher, Student) within a highly scalable, cross-platform architecture.

## 2. Problem Statement
Traditional attendance tracking methods are time-consuming, prone to human error, and susceptible to proxy attendance. Existing hardware-based biometric systems are expensive to install and maintain, lack mobility, and often suffer from hygiene concerns. Furthermore, these systems rarely offer real-time analytics or accessible dashboards for all stakeholders (students, teachers, administrators).

## 3. Objectives
*   **Automation:** Automate attendance capture using AI-driven facial recognition.
*   **Accuracy & Security:** Eliminate proxy attendance and unauthorized access.
*   **Accessibility:** Provide a responsive, multi-platform experience (Web, Android, iOS, Windows, macOS, Linux) via Progressive Web App (PWA) standards.
*   **Real-time Insights:** Deliver actionable analytics and reports instantly.
*   **Commercial SaaS Quality:** Ensure high performance, scalability, intuitive UI/UX, and robust security, distinguishing the product from academic prototypes.

## 4. Scope
The system will encompass:
*   User Authentication (Email/Password, Google OAuth).
*   Role-Based Access Control (Admin, Teacher, Student).
*   Facial Data Registration and AI Recognition Engine.
*   Real-time Session Management.
*   Comprehensive Reporting and Analytics.
*   System Settings, Notifications, and Export Capabilities.
*   Cross-device compatibility with PWA support.

## 5. Features
*   **Cross-Platform PWA:** Installable on any device with offline splash screens.
*   **Theming:** System-aware Light and Dark modes.
*   **Biometrics:** Secure face registration and real-time recognition.
*   **Dashboards:** Tailored metrics and actions for each user role.
*   **Reporting:** CSV, Excel, and PDF exports.
*   **Notifications:** Real-time alerts for session starts, low attendance, and system updates.
*   **Camera Controls:** Resolution, mirror mode, and camera selection settings.

## 6. User Roles
1.  **Admin:** Full system control. Can manage teachers, students, system settings, global analytics, and perform database backups.
2.  **Teacher/Instructor:** Can create/manage attendance sessions, view class analytics, manage student attendance exceptions, and export reports.
3.  **Student/Employee:** Can register their face, view their personal attendance history, check real-time session status, and mark attendance when a session is active.

## 7. Complete User Flow
### 7.1 Authentication Flow
1. User navigates to the Landing Page.
2. Selects Login (Email/Password or Google Login).
3. System validates credentials via JWT.
4. System checks User Role.
5. User is routed to their specific Dashboard (Admin, Teacher, or Student).

### 7.2 Face Registration Flow (Student)
1. Student accesses "Face Registration" from the dashboard.
2. Prompts for Camera Permissions.
3. Camera activates (with UI guides for face placement).
4. System captures multiple angles/frames.
5. AI processes and extracts facial embeddings.
6. Embeddings are encrypted and securely stored in the database.

### 7.3 Attendance Flow
1. **Teacher Workflow:** Teacher navigates to "Attendance", selects class/subject, and clicks "Start Session". A session timer begins.
2. **System:** Marks session as "Active".
3. **Student Workflow:** Student logs in and navigates to "Attendance".
    *   *If no session:* UI displays "No Active Attendance Session".
    *   *If session active:* Camera opens automatically.
4. **Recognition Flow:** 
    *   Face Detection occurs locally/server-side.
    *   Face Recognition matches live frame against registered embeddings.
5. **Validation:** 
    *   If matched and not already marked: Attendance is saved.
    *   If already marked: UI shows "Attendance Already Marked".
6. **Teacher Dashboard:** Updates instantly via real-time sync.
7. **End Session:** Session ends automatically when timer expires or teacher manually stops it.

### 7.4 Admin Workflow
1. Logs in.
2. Views system-wide analytics (total users, daily attendance rates).
3. Manages Users (Add/Edit/Remove Teachers and Students).
4. Accesses System Settings (Security, Backups).

## 8. Technical Architecture

### 8.1 Frontend Architecture
*   **Framework:** React 19 with TypeScript.
*   **Build Tool:** Vite.
*   **Routing:** React Router v7 (with Lazy Loading and Suspense for Code Splitting).
*   **Styling:** Tailwind CSS (Utility-first, responsive, dark mode support).
*   **Icons:** Lucide React.
*   **Animations:** Motion (Framer Motion).
*   **Charts:** Recharts.
*   **PWA:** Service Workers, Web Manifest for installability.

### 8.2 Backend Architecture
*   **Runtime:** Node.js.
*   **Framework:** Express.js.
*   **ORM:** Drizzle ORM (Type-safe SQL).
*   **Database:** PostgreSQL (Hosted on Supabase).
*   **AI/Vision:** Google Gemini API / OpenCV (for facial embeddings processing).

### 8.3 API Design
*   RESTful architecture.
*   Standardized JSON responses: `{ success: boolean, data?: any, error?: string }`.
*   Routes categorized: `/api/auth`, `/api/users`, `/api/attendance`, `/api/reports`, `/api/settings`.

## 9. Security Design
*   **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies or secure local storage.
*   **Authorization:** Middleware verifying roles (Admin/Teacher/Student) on protected routes.
*   **Passwords:** Hashed using `bcryptjs`.
*   **Data Protection:** SQL Injection protection via Drizzle ORM. XSS protection via React's native escaping. CSRF protection strategies.
*   **Rate Limiting:** `express-rate-limit` implemented to prevent brute-force attacks.
*   **Secure Headers:** Managed via `helmet`.

## 10. Database Design (Supabase PostgreSQL)
*   **Users Table:** `id`, `name`, `email`, `password_hash`, `role`, `department`, `created_at`.
*   **Sessions Table:** `id`, `teacher_id`, `subject`, `status` (active/closed), `start_time`, `end_time`.
*   **Attendances Table:** `id`, `session_id`, `student_id`, `timestamp`, `status` (present/absent), `confidence_score`.
*   **FaceRegistrations Table:** `id`, `user_id`, `embedding_data`, `image_url`, `created_at`.
*   **Notifications Table:** `id`, `user_id`, `title`, `message`, `read`, `created_at`.
*   **AuditLogs Table:** Tracks sensitive actions (logins, settings changes, manual overrides).

## 11. UI/UX Design System
*   **Design Language:** Modern SaaS, Apple-level simplicity, Google Material depth.
*   **Color Palette:** 
    *   Primary: Indigo (Tailwind `indigo-600`).
    *   Success: Emerald.
    *   Warning: Amber.
    *   Danger: Rose.
    *   Background (Light): `slate-50`.
    *   Background (Dark): `slate-950`.
*   **Typography:** System fonts (Inter/San Francisco/Roboto) ensuring high readability.
*   **Responsiveness:** Mobile-first approach (`320px` to `1440px+`). No horizontal scrolling. Responsive tables and sidebars.
*   **Accessibility:** ARIA labels, semantic HTML, keyboard navigation, high contrast ratios.

## 12. Component Architecture & State Management
*   **State Management:** React Context API (`AuthContext`, `ThemeContext`, `ToastContext`) for global state. Local component state (`useState`, `useReducer`) for UI specifics.
*   **Component Structure:** Modular (`/components/layout`, `/components/ui`, `/components/forms`). Reusable and highly customizable elements.

## 13. Error Handling & Validation
*   **Frontend:** `react-hook-form` with `zod` for rigorous schema-based input validation.
*   **Backend:** Global error handler middleware in Express. Catches 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error).
*   **UI Feedback:** Toast notifications, skeleton loaders, empty states, and custom offline pages.

## 14. Testing Strategy
*   **Unit Tests:** Vitest for utility functions and pure logic.
*   **Component Tests:** React Testing Library for UI components and user interactions.
*   **API Tests:** Supertest for backend endpoint validation.
*   **Coverage:** Aim for high coverage on Authentication, Role guards, and Attendance logic.

## 15. Deployment Strategy
*   **Frontend:** Vercel (Optimized for Vite/React, automatic CI/CD from GitHub).
*   **Backend:** Render (Web Service, continuous deployment, custom domains).
*   **Database:** Supabase (Managed PostgreSQL, automated backups, high availability).

## 16. Performance & Optimization
*   **Code Splitting:** `React.lazy` and `Suspense` implemented in App routing.
*   **Caching:** Service Workers intercepting static asset requests. Browser caching headers on the backend.
*   **Image Optimization:** Pre-compressed assets and optimized SVG icons.
*   **SEO & Meta:** Configured Web Manifest and meta tags for optimal indexing and shareability.

## 17. Future Roadmap
*   Geo-fencing for attendance (GPS validation).
*   Integration with LMS platforms (Canvas, Moodle).
*   Advanced spoofing detection (Liveness detection).
*   Custom report builder.
*   Automated parental/guardian SMS notifications.

---
*Generated for AttendX AI Production Architecture.*
