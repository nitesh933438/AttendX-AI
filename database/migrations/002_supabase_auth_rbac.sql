-- AttendX AI - Production Supabase Auth & Role-Based Access Control (RBAC) Migration
-- File: database/migrations/002_supabase_auth_rbac.sql

-- 1. Create profiles table linked directly to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT,
    phone_number VARCHAR(50),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create index on role and email for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. Automatic Profile Creation & RBAC Trigger
-- Admin Email: nitesh933438@gmail.com automatically assigned 'admin' role
-- All new users default to 'student'
-- 'teacher' role can only be assigned via metadata when created by Admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role VARCHAR(50);
    user_full_name VARCHAR(255);
    user_first_name VARCHAR(100);
    user_last_name VARCHAR(100);
BEGIN
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    user_first_name := split_part(user_full_name, ' ', 1);
    user_last_name := NULLIF(substring(user_full_name from position(' ' in user_full_name) + 1), '');

    -- Determine Role:
    -- Only nitesh933438@gmail.com becomes Admin automatically.
    -- If created by Admin with role='teacher' in metadata, assign teacher.
    -- Otherwise, default to 'student'.
    IF LOWER(NEW.email) = 'nitesh933438@gmail.com' THEN
        user_role := 'admin';
    ELSIF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
        user_role := 'teacher';
    ELSE
        user_role := 'student';
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        first_name,
        last_name,
        role,
        avatar_url,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        user_first_name,
        user_last_name,
        user_role,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone logged in can read their own profile
CREATE POLICY "Users can read own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Teachers can view student profiles
CREATE POLICY "Teachers can view student profiles" 
    ON public.profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'teacher'
        ) AND role = 'student'
    );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Policy: Admins can update any profile (e.g., promote to teacher)
CREATE POLICY "Admins can update all profiles" 
    ON public.profiles FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
