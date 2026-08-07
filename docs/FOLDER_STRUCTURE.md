# AttendX AI — Folder & Module Directory Structure

```
attendx-ai/
├── .env.example                # Canonical environment variable declaration
├── .gitignore                  # Git exclusion rules
├── API_DOCUMENTATION.md        # Complete REST API reference
├── DEPLOYMENT_GUIDE.md         # Production deployment instructions
├── PRODUCT_DOCUMENTATION.md    # Product feature breakdown
├── README.md                   # Primary system documentation
├── database/                   # Supabase / PostgreSQL database setup
│   ├── migrations/             # SQL schema migrations
│   │   ├── 001_init_schema.sql # Core table definitions
│   │   ├── 002_rls_policies.sql# Row Level Security rules
│   │   └── 003_indexes.sql     # Database performance indexes
│   └── seed.sql                # Initial seed data
├── docs/                       # Comprehensive documentation
│   ├── ARCHITECTURE.md         # Architecture & system design
│   ├── FOLDER_STRUCTURE.md     # Directory documentation (this file)
│   ├── DEVELOPER_GUIDE.md      # Developer onboarding guide
│   └── GIT_CONVENTIONS.md      # Commit and branch conventions
├── public/                     # Static public assets
├── scripts/                    # Build, validation, and CLI scripts
│   ├── check-architecture.js   # Architecture validation script
│   └── validate-env.js         # Environment check script
├── server.ts                   # Custom Express backend server
├── src/                        # React Frontend Source
│   ├── App.tsx                 # Root application component & router
│   ├── main.tsx                # React entry point
│   ├── index.css               # Tailwind CSS entry point
│   ├── components/             # UI Components
│   │   ├── common/             # Reusable UI system
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FormControls.tsx
│   │   │   ├── GlobalLoading.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── layout/             # Layout wrappers (Sidebar, Topbar)
│   │   └── ProfileCompletion.tsx
│   ├── context/                # Context API providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── db/                     # Drizzle ORM schema & client
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAttendance.ts
│   │   ├── useDebounce.ts
│   │   ├── useModal.ts
│   │   └── usePagination.ts
│   ├── lib/                    # Shared utilities
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/                  # Route page views
│   │   ├── Academics.tsx
│   │   ├── Analytics.tsx
│   │   ├── Attendance.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FaceRegister.tsx
│   │   ├── Forbidden.tsx
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Notifications.tsx
│   │   ├── Reports.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── ServerError.tsx
│   │   ├── Settings.tsx
│   │   ├── Students.tsx
│   │   └── Teachers.tsx
│   ├── services/               # API service layer
│   │   └── apiClient.ts
│   └── types/                  # Master TypeScript definitions
│       └── index.ts
└── tsconfig.json               # TypeScript configuration
```
