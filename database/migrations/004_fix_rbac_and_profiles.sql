-- AttendX AI - Production Supabase Auth & Role-Based Access Control (RBAC) Migration
-- File: database/migrations/004_fix_rbac_and_profiles.sql

-- 1. Ensure profiles table structure linked to auth.users
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

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Helper function to check admin role safely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Automatic Profile Creation & RBAC Trigger
-- Primary Admin: nitesh933438@gmail.com is automatically assigned 'admin'
-- All other new signups default to 'student' (or metadata role if provided)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role VARCHAR(50);
    user_full_name VARCHAR(255);
    user_first_name VARCHAR(100);
    user_last_name VARCHAR(100);
BEGIN
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );
    user_first_name := split_part(user_full_name, ' ', 1);
    user_last_name := NULLIF(substring(user_full_name from position(' ' in user_full_name) + 1), '');

    -- Role Determination Rules:
    -- 1. nitesh933438@gmail.com becomes Admin
    -- 2. Explicit metadata role ('admin', 'teacher', 'student')
    -- 3. Defaults to 'student'
    IF LOWER(NEW.email) = 'nitesh933438@gmail.com' THEN
        user_role := 'admin';
    ELSIF NEW.raw_user_meta_data->>'role' IN ('admin', 'teacher', 'student') THEN
        user_role := NEW.raw_user_meta_data->>'role';
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
        LOWER(NEW.email),
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

-- Re-register trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Clean & Safe Row Level Security (RLS) Policies on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users insert profile" ON public.profiles;

-- Policy 1: Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Admins can read all user profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

-- Policy 3: Authenticated users can insert their own profile
CREATE POLICY "Authenticated users insert profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy 4: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policy 5: Admins can update any user profile (for role promotion/demotion)
CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());
