# AttendX AI — Automated Facial Recognition & Attendance System

AttendX AI is an enterprise-grade, automated facial recognition and attendance management ecosystem designed for modern educational institutions and organizations. It provides real-time biometric face-matching, anti-spoofing liveness checks, role-based dashboards (Admin, Teacher, Student), automated attendance sessions, live student roster tracking, class/department mismatch protection, multi-format CSV/PDF exports, and security telemetry.

---

## 🌟 Key Functional Features

- **Automated AI Facial Verification**: High-precision 128-d vector face recognition with liveness verification (blink and smile detection).
- **Teacher Session Control**: Instant session launch with course, department, semester, section, subject details, custom duration limits, pause/resume, and instant CSV report export.
- **Student Live Camera Stream**: Automatic background polling for active sessions with instant camera stream activation, facial alignment guides, and anti-duplicate registration checks.
- **Class Mismatch Prevention**: Rejects attendance attempts if a student is enrolled in a different department, semester, or section than the active lecture.
- **Administrative Telemetry Audit**: Logs for successful recognitions, failed anti-spoofing challenges, and unknown face snapshots with browser/device signatures.
- **Role-Based Protection**: Dynamic role routing (Admin, Teacher, Student) with dedicated protected routes and navigation access controls.
- **Multi-Format Export & Printing**: Instant session CSV downloads and print-ready PDF reports.

---

## 🏗️ Architecture & Module Structure

```
attendx-ai/
├── .env.example                # Documented environment variables
├── README.md                   # Primary system documentation
├── server.ts                   # Express server & API endpoints
├── database/                   # Supabase / PostgreSQL database setup
│   ├── migrations/             # SQL schema migrations (Init, RLS, Indexes)
│   └── seed.sql                # Production seed data
├── docs/                       # Technical System Documentation
│   ├── ARCHITECTURE.md         # Architecture & system design
│   ├── FOLDER_STRUCTURE.md     # Module directory breakdown
│   ├── DEVELOPER_GUIDE.md      # Developer guide & standards
│   └── GIT_CONVENTIONS.md      # Commit and branch standards
├── scripts/                    # Automation & architecture validation scripts
│   ├── check-architecture.js
│   └── validate-env.js
└── src/                        # React Frontend Source
    ├── App.tsx                 # Router & Protected routes configuration
    ├── components/
    │   ├── common/             # Reusable UI System (Modal, Table, Search, etc.)
    │   └── layout/             # Sidebar, Topbar, AppLayout
    ├── context/                # Auth, Theme, Toast state providers
    ├── db/                     # Drizzle ORM schema
    ├── hooks/                  # Custom hooks (useAttendance, useDebounce, usePagination, useModal)
    ├── lib/                    # Logger, Env validator, Constants, Utilities
    ├── pages/                  # Route views (Dashboard, Attendance, Academics, etc.)
    ├── services/               # API Service Layer (apiClient.ts)
    └── types/                  # Master TypeScript interface definitions
```

---

## 🚀 Quick Start & Installation

### 1. Requirements
- **Node.js**: `v20.0.0` or later
- **npm**: `v10.0.0` or later

### 2. Setup
```bash
# Clone repository
git clone https://github.com/attendx/attendx-ai.git
cd attendx-ai

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server (Port 3000)
npm run dev

# Run linting check
npm run lint

# Build production bundle
npm run build
```

---

## 📡 API Reference Overview

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/sessions/active` | `GET` | All | Fetch active attendance session |
| `/api/sessions/start` | `POST` | Teacher/Admin | Launch session with custom timer |
| `/api/sessions/:id/pause` | `POST` | Teacher/Admin | Pause/Resume active session |
| `/api/sessions/:id/end` | `POST` | Teacher/Admin | Conclude active session |
| `/api/sessions/:id/export/csv` | `GET` | Teacher/Admin | Export session attendance report to CSV |
| `/api/attendance/mark-automatic` | `POST` | Student | Process automatic AI facial match |
| `/api/admin/face-recognition/logs-and-stats` | `GET` | Admin | Fetch security audit logs & telemetry |

---

## 📄 Documentation Index

- [Architecture Design Document](./docs/ARCHITECTURE.md)
- [Folder Structure Documentation](./docs/FOLDER_STRUCTURE.md)
- [Developer Onboarding & Standards](./docs/DEVELOPER_GUIDE.md)
- [Git Commit & Branch Conventions](./docs/GIT_CONVENTIONS.md)

---

## 🛡️ License & Maintenance

Developed with ❤️ by the AttendX AI Team. All rights reserved.
