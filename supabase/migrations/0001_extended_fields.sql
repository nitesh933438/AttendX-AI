-- Migration 0001: Add extended fields for Students, Teachers, Semesters, Subjects

ALTER TABLE students ADD COLUMN IF NOT EXISTS enrollment_number TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS session TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS registration_status registration_status DEFAULT 'approved';
ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_percentage NUMERIC DEFAULT 0;

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

ALTER TABLE semesters ADD COLUMN IF NOT EXISTS semester_number INTEGER DEFAULT 1;
ALTER TABLE semesters ADD COLUMN IF NOT EXISTS academic_year TEXT;

ALTER TABLE subjects ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_enrollment ON students(enrollment_number);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
