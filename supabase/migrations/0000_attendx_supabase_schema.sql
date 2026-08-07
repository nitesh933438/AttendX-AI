-- Supabase PostgreSQL Migration for AttendX AI

-- 1. Enums
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE session_status AS ENUM ('active', 'closed');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Tables

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Link to Supabase auth.users
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'student',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. semesters
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 5. sections
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 6. subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 7. teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 8. students
CREATE TABLE students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL UNIQUE,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 9. teacher_subjects
CREATE TABLE teacher_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(teacher_id, subject_id)
);

-- 10. classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_subject_id UUID REFERENCES teacher_subjects(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    schedule TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 11. attendance_sessions
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    status session_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 12. attendance_records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL,
    marked_at TIMESTAMPTZ,
    confidence_score NUMERIC,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(session_id, student_id)
);

-- 13. face_registrations
CREATE TABLE face_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    status registration_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 14. face_embeddings
CREATE TABLE face_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES face_registrations(id) ON DELETE CASCADE,
    embedding_data JSONB NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 15. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 16. audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 17. settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Indexes for Foreign Keys and Soft Deletes

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at);
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at);
CREATE INDEX idx_semesters_deleted_at ON semesters(deleted_at);

CREATE INDEX idx_sections_department ON sections(department_id);
CREATE INDEX idx_sections_semester ON sections(semester_id);
CREATE INDEX idx_sections_deleted_at ON sections(deleted_at);

CREATE INDEX idx_subjects_department ON subjects(department_id);
CREATE INDEX idx_subjects_deleted_at ON subjects(deleted_at);

CREATE INDEX idx_teachers_department ON teachers(department_id);
CREATE INDEX idx_teachers_deleted_at ON teachers(deleted_at);

CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);

CREATE INDEX idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject ON teacher_subjects(subject_id);
CREATE INDEX idx_teacher_subjects_deleted_at ON teacher_subjects(deleted_at);

CREATE INDEX idx_classes_teacher_subject ON classes(teacher_subject_id);
CREATE INDEX idx_classes_section ON classes(section_id);
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);

CREATE INDEX idx_attendance_sessions_class ON attendance_sessions(class_id);
CREATE INDEX idx_attendance_sessions_deleted_at ON attendance_sessions(deleted_at);

CREATE INDEX idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_deleted_at ON attendance_records(deleted_at);

CREATE INDEX idx_face_registrations_student ON face_registrations(student_id);
CREATE INDEX idx_face_registrations_deleted_at ON face_registrations(deleted_at);

CREATE INDEX idx_face_embeddings_registration ON face_embeddings(registration_id);
CREATE INDEX idx_face_embeddings_deleted_at ON face_embeddings(deleted_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_deleted_at ON audit_logs(deleted_at);

CREATE INDEX idx_settings_deleted_at ON settings(deleted_at);

-- 4. Triggers for updated_at

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_departments_modtime BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_semesters_modtime BEFORE UPDATE ON semesters FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_sections_modtime BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_subjects_modtime BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_teachers_modtime BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_students_modtime BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_teacher_subjects_modtime BEFORE UPDATE ON teacher_subjects FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_classes_modtime BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_attendance_sessions_modtime BEFORE UPDATE ON attendance_sessions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_attendance_records_modtime BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_face_registrations_modtime BEFORE UPDATE ON face_registrations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_face_embeddings_modtime BEFORE UPDATE ON face_embeddings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_notifications_modtime BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();


-- 5. Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- =======================
-- Admin Policies (Access everything)
-- =======================

CREATE POLICY "Admin full access users" ON users FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access departments" ON departments FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access semesters" ON semesters FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access sections" ON sections FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access subjects" ON subjects FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access teachers" ON teachers FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access students" ON students FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access teacher_subjects" ON teacher_subjects FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access classes" ON classes FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access attendance_sessions" ON attendance_sessions FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access attendance_records" ON attendance_records FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access face_registrations" ON face_registrations FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access face_embeddings" ON face_embeddings FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access notifications" ON notifications FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access audit_logs" ON audit_logs FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (get_user_role() = 'admin');


-- =======================
-- Teacher Policies
-- =======================

-- Users & Profiles
CREATE POLICY "Teacher read users" ON users FOR SELECT USING (get_user_role() = 'teacher');
CREATE POLICY "Teacher read own profile" ON profiles FOR SELECT USING (get_user_role() = 'teacher');
CREATE POLICY "Teacher update own profile" ON profiles FOR UPDATE USING (id = get_user_id() AND get_user_role() = 'teacher');

-- Academic Metadata (Read-only)
CREATE POLICY "Teacher read departments" ON departments FOR SELECT USING (get_user_role() = 'teacher');
CREATE POLICY "Teacher read semesters" ON semesters FOR SELECT USING (get_user_role() = 'teacher');
CREATE POLICY "Teacher read sections" ON sections FOR SELECT USING (get_user_role() = 'teacher');
CREATE POLICY "Teacher read subjects" ON subjects FOR SELECT USING (get_user_role() = 'teacher');

-- Teacher's own records
CREATE POLICY "Teacher read own teacher record" ON teachers FOR SELECT USING (id = get_user_id() OR get_user_role() = 'teacher');
CREATE POLICY "Teacher read own subjects" ON teacher_subjects FOR SELECT USING (get_user_role() = 'teacher');

-- Students
CREATE POLICY "Teacher read students" ON students FOR SELECT USING (get_user_role() = 'teacher');

-- Classes
CREATE POLICY "Teacher read own classes" ON classes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM teacher_subjects ts
        WHERE ts.id = teacher_subject_id AND ts.teacher_id = get_user_id()
    )
);

-- Attendance Sessions (Manage own)
CREATE POLICY "Teacher manage own sessions" ON attendance_sessions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM classes c
        JOIN teacher_subjects ts ON ts.id = c.teacher_subject_id
        WHERE c.id = class_id AND ts.teacher_id = get_user_id()
    )
);

-- Attendance Records (Manage own)
CREATE POLICY "Teacher manage own attendance records" ON attendance_records FOR ALL USING (
    EXISTS (
        SELECT 1 FROM attendance_sessions s
        JOIN classes c ON c.id = s.class_id
        JOIN teacher_subjects ts ON ts.id = c.teacher_subject_id
        WHERE s.id = session_id AND ts.teacher_id = get_user_id()
    )
);


-- =======================
-- Student Policies
-- =======================

-- Users & Profiles
CREATE POLICY "Student read own user" ON users FOR SELECT USING (id = get_user_id());
CREATE POLICY "Student read own profile" ON profiles FOR SELECT USING (id = get_user_id());
CREATE POLICY "Student update own profile" ON profiles FOR UPDATE USING (id = get_user_id());

-- Academic Metadata
CREATE POLICY "Student read departments" ON departments FOR SELECT USING (get_user_role() = 'student');
CREATE POLICY "Student read semesters" ON semesters FOR SELECT USING (get_user_role() = 'student');
CREATE POLICY "Student read sections" ON sections FOR SELECT USING (get_user_role() = 'student');
CREATE POLICY "Student read subjects" ON subjects FOR SELECT USING (get_user_role() = 'student');

-- Student's own records
CREATE POLICY "Student read own record" ON students FOR SELECT USING (id = get_user_id());

-- Classes (Read classes in their section)
CREATE POLICY "Student read own classes" ON classes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM students s
        WHERE s.id = get_user_id() AND s.section_id = section_id
    )
);

-- Attendance Sessions (Read sessions for their classes)
CREATE POLICY "Student read own sessions" ON attendance_sessions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM classes c
        JOIN students s ON s.section_id = c.section_id
        WHERE c.id = class_id AND s.id = get_user_id()
    )
);

-- Attendance Records
CREATE POLICY "Student read own attendance records" ON attendance_records FOR SELECT USING (student_id = get_user_id());
CREATE POLICY "Student insert own attendance records" ON attendance_records FOR INSERT WITH CHECK (student_id = get_user_id());

-- Face Registrations
CREATE POLICY "Student manage own face registrations" ON face_registrations FOR ALL USING (student_id = get_user_id());
CREATE POLICY "Student manage own face embeddings" ON face_embeddings FOR ALL USING (
    EXISTS (
        SELECT 1 FROM face_registrations fr
        WHERE fr.id = registration_id AND fr.student_id = get_user_id()
    )
);


-- =======================
-- Shared / General Policies
-- =======================

-- Notifications
CREATE POLICY "User read own notifications" ON notifications FOR SELECT USING (user_id = get_user_id());
CREATE POLICY "User update own notifications" ON notifications FOR UPDATE USING (user_id = get_user_id());

-- Settings
CREATE POLICY "Anyone read settings" ON settings FOR SELECT USING (true);

-- =======================
-- Auth Trigger (Sync Supabase Auth to Public Users)
-- =======================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_role user_role;
BEGIN
    -- Check if it's the master admin
    IF NEW.email = 'nitesh933438@gmail.com' THEN
        new_role := 'admin';
    ELSE
        -- Teachers cannot register themselves, so any self-signup is a student by default.
        -- Teachers must be created by Admin.
        new_role := 'student';
    END IF;

    -- Insert into public.users
    INSERT INTO public.users (auth_id, email, role)
    VALUES (NEW.id, NEW.email, new_role);

    -- Insert into public.profiles (initial setup)
    INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
    VALUES (
        (SELECT id FROM public.users WHERE auth_id = NEW.id), 
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)), 
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''), 
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

