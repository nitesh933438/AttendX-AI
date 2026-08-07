-- AttendX AI - Supabase / PostgreSQL Core Database Schema Migration
-- Migration 001: Initial Tables Definition

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    department VARCHAR(255),
    semester VARCHAR(100),
    section VARCHAR(50),
    roll_number VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    face_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(100) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(id) ON DELETE CASCADE,
    semester VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS face_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vector_data JSONB NOT NULL,
    quality_score NUMERIC(5,2) DEFAULT 95.0,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_sessions (
    id SERIAL PRIMARY KEY,
    session_code VARCHAR(50) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    semester VARCHAR(100) NOT NULL,
    section VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
    duration_minutes INT NOT NULL DEFAULT 5,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    confidence NUMERIC(5,2) NOT NULL,
    liveness_passed BOOLEAN DEFAULT TRUE,
    device VARCHAR(255),
    browser VARCHAR(255),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_session_attendance UNIQUE (session_id, student_id)
);

CREATE TABLE IF NOT EXISTS ai_recognition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id INT REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE SET NULL,
    confidence_score NUMERIC(5,2),
    liveness_passed BOOLEAN DEFAULT TRUE,
    challenge_type VARCHAR(100) DEFAULT 'blink_and_smile',
    latency_ms INT DEFAULT 165,
    status VARCHAR(50) NOT NULL,
    device VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS failed_recognition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id INT REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    liveness_passed BOOLEAN DEFAULT FALSE,
    face_count INT DEFAULT 1,
    blur_score NUMERIC(5,2),
    occlusion_detected BOOLEAN DEFAULT FALSE,
    device VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS unknown_face_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id INT REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    face_count INT DEFAULT 1,
    snapshot_preview TEXT,
    device VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
