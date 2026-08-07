// AttendX AI - Application Constants

export const APP_NAME = "AttendX AI";
export const APP_VERSION = "2.5.0";

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence & Data Science"
] as const;

export const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
] as const;

export const SECTIONS = ["Section A", "Section B", "Section C", "Section D"] as const;

export const SESSION_DURATIONS = [
  { label: "2 Minutes (Quick Test)", value: 2 },
  { label: "5 Minutes (Default)", value: 5 },
  { label: "10 Minutes", value: 10 },
  { label: "15 Minutes", value: 15 },
  { label: "30 Minutes", value: 30 },
  { label: "60 Minutes (Full Lecture)", value: 60 }
] as const;

export const DEFAULT_AI_MATCH_THRESHOLD = 90; // 90% vector similarity requirement

export const API_ENDPOINTS = {
  SESSIONS_ACTIVE: "/api/sessions/active",
  SESSIONS_START: "/api/sessions/start",
  SESSIONS_DASHBOARD: (id: number) => `/api/sessions/${id}/dashboard`,
  SESSIONS_EXPORT_CSV: (id: number) => `/api/sessions/${id}/export/csv`,
  ATTENDANCE_AUTOMATIC: "/api/attendance/mark-automatic",
  FACE_REGISTRATION_STATUS: (userId: string) => `/api/face-registration/status/${userId}`,
  ADMIN_LOGS_STATS: "/api/admin/face-recognition/logs-and-stats",
  ADMIN_SETTINGS: "/api/admin/face-recognition/settings"
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;
