-- AttendX AI - Performance Indexes & Triggers
-- Migration 003: Indexes and Automatic Timestamps

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_roll ON users(roll_number);
CREATE INDEX IF NOT EXISTS idx_users_dept_sem ON users(department, semester, section);

CREATE INDEX IF NOT EXISTS idx_sessions_code ON attendance_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON attendance_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON attendance_sessions(teacher_id);

CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON attendance_records(student_id);

CREATE INDEX IF NOT EXISTS idx_ai_logs_session ON ai_recognition_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_failed_logs_session ON failed_recognition_logs(session_id);

-- Auto Update Timestamp Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
