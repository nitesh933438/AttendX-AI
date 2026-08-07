-- AttendX AI - Supabase Row Level Security (RLS) Policies
-- Migration 002: RLS Policies for Role-Based Authorization

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recognition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_recognition_logs ENABLE ROW LEVEL SECURITY;

-- 1. Users table policies
CREATE POLICY "Users can view their own profile or teachers/admins can view all"
ON users FOR SELECT
USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

CREATE POLICY "Admins can insert or modify users"
ON users FOR ALL
USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Attendance Sessions policies
CREATE POLICY "Anyone authenticated can view active sessions"
ON attendance_sessions FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers and admins can manage sessions"
ON attendance_sessions FOR ALL
USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- 3. Attendance Records policies
CREATE POLICY "Students can view their own attendance records"
ON attendance_records FOR SELECT
USING (
    student_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

CREATE POLICY "System/Users can insert attendance records"
ON attendance_records FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
