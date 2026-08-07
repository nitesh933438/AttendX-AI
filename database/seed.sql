-- AttendX AI - Production Seed Data

INSERT INTO departments (name, code) VALUES
('Computer Science & Engineering', 'CSE'),
('Information Technology', 'IT'),
('Electronics & Communication', 'ECE'),
('Electrical Engineering', 'EE'),
('Mechanical Engineering', 'ME')
ON CONFLICT (code) DO NOTHING;

-- Default Super Admin User
INSERT INTO users (id, full_name, email, password_hash, role, department)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'System Administrator',
    'admin@attendx.ai',
    '$2a$10$vZ9YgB4W8sX...encrypted_hash...',
    'admin',
    'Computer Science & Engineering'
) ON CONFLICT (email) DO NOTHING;

-- Default Teacher User
INSERT INTO users (id, full_name, email, password_hash, role, department)
VALUES (
    't0000000-0000-0000-0000-000000000001',
    'Dr. Sarah Jenkins',
    'teacher@attendx.ai',
    '$2a$10$vZ9YgB4W8sX...encrypted_hash...',
    'teacher',
    'Computer Science & Engineering'
) ON CONFLICT (email) DO NOTHING;

-- Default Student User
INSERT INTO users (id, full_name, email, password_hash, role, department, semester, section, roll_number, face_registered)
VALUES (
    's0000000-0000-0000-0000-000000000001',
    'Alex Vance',
    'student@attendx.ai',
    '$2a$10$vZ9YgB4W8sX...encrypted_hash...',
    'student',
    'Computer Science & Engineering',
    '1st Semester',
    'Section A',
    'CS-2026-001',
    TRUE
) ON CONFLICT (email) DO NOTHING;
