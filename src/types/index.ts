// AttendX AI - Master Type Definitions

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  semester?: string;
  section?: string;
  rollNumber?: string;
  avatarUrl?: string;
  faceRegistered?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SessionStatus = 'active' | 'paused' | 'ended';

export interface ActiveSession {
  id: number;
  courseName: string;
  department: string;
  semester: string;
  section: string;
  subject: string;
  sessionCode: string;
  status: SessionStatus;
  durationMinutes: number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
  teacherId?: string;
  teacherName?: string;
}

export interface StudentDashboardItem {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  section: string;
  avatarUrl?: string;
  faceRegistered: boolean;
  status: 'Present' | 'Absent';
  timestamp?: string;
  confidence?: number;
  device?: string;
  browser?: string;
}

export interface AIRecognitionLog {
  id: string;
  sessionId: number;
  studentId: string;
  studentName: string;
  confidenceScore: number;
  livenessPassed: boolean;
  challengeType: string;
  latencyMs: number;
  status: string;
  timestamp: string;
  device: string;
}

export interface FailedRecognitionLog {
  id: string;
  sessionId: number;
  reason: string;
  livenessPassed: boolean;
  faceCount: number;
  blurScore: number;
  occlusionDetected: boolean;
  timestamp: string;
  device: string;
}

export interface UnknownFaceLog {
  id: string;
  sessionId: number;
  reason: string;
  faceCount: number;
  livenessPassed: boolean;
  snapshotPreview: string;
  timestamp: string;
  device: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
