import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, hasSupabaseKeys } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { apiClient } from '../services/apiClient';

export interface User {
  id: string; // The UUID from profiles/auth.users
  auth_id: string; // The Supabase Auth ID
  email: string;
  role: 'admin' | 'teacher' | 'student';
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  department?: string;
  semester?: string;
  section?: string;
  rollNumber?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (payload: { email: string; password?: string; name?: string; role?: 'student' | 'teacher' }) => Promise<{ success: boolean; requiresVerification?: boolean; message?: string; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    payloadOrOldPassword: { currentPassword?: string; newPassword?: string } | string,
    newPass?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, newRole: 'admin' | 'teacher' | 'student') => Promise<{ success: boolean; error?: string }>;
  createTeacher: (teacherData: { email: string; name: string; department?: string; employeeId?: string }) => Promise<{ success: boolean; teacher?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sync & fetch internal user profile from Supabase `profiles` table
   */
  const fetchUserProfile = async (authUser: SupabaseUser | null): Promise<User | null> => {
    if (!authUser) {
      setUser(null);
      return null;
    }

    try {
      const emailLower = authUser.email?.toLowerCase() || '';

      // Query profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn("Notice querying profiles table:", error.message);
      }

      // Extract user metadata provided during registration or OAuth
      const metadata = authUser.user_metadata || {};
      const fullName = profile?.full_name || metadata.full_name || metadata.name || emailLower.split('@')[0];
      const firstName = profile?.first_name || metadata.first_name || fullName.split(' ')[0] || 'User';
      const lastName = profile?.last_name || metadata.last_name || fullName.split(' ').slice(1).join(' ') || '';
      
      // Determine Role:
      // 1. Primary admin account is always assigned 'admin'
      // 2. If profile exists in DB, keep its assigned role (allows Admins to promote/demote users)
      // 3. Otherwise default new users to 'student' (or metadata role if explicitly provided)
      let role: 'admin' | 'teacher' | 'student' = 'student';
      if (emailLower === 'nitesh933438@gmail.com') {
        role = 'admin';
      } else if (profile?.role) {
        role = profile.role as 'admin' | 'teacher' | 'student';
      } else if (metadata.role === 'teacher' || metadata.role === 'admin') {
        role = metadata.role as 'admin' | 'teacher' | 'student';
      } else {
        role = 'student';
      }

      const mappedUser: User = {
        id: authUser.id,
        auth_id: authUser.id,
        email: emailLower,
        role: role,
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        avatarUrl: profile?.avatar_url || metadata.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        department: profile?.department || metadata.department || '',
        phoneNumber: profile?.phone_number || metadata.phone_number || '',
      };

      // Ensure profile exists in Supabase DB if missing
      if (!profile && hasSupabaseKeys) {
        supabase.from('profiles').upsert({
          id: authUser.id,
          email: emailLower,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          role: role,
          avatar_url: mappedUser.avatarUrl,
          updated_at: new Date().toISOString()
        }).then(({ error: upsertErr }) => {
          if (upsertErr) console.warn("Notice upserting user profile:", upsertErr.message);
        });
      } else if (profile && profile.role !== role && emailLower === 'nitesh933438@gmail.com') {
        supabase.from('profiles').update({ role: 'admin' }).eq('id', authUser.id).then(() => {});
      }

      setUser(mappedUser);
      return mappedUser;
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      // Fallback mapped user from authUser metadata
      const emailLower = authUser.email?.toLowerCase() || '';
      const fallbackUser: User = {
        id: authUser.id,
        auth_id: authUser.id,
        email: emailLower,
        role: emailLower === 'nitesh933438@gmail.com' ? 'admin' : 'student',
        name: emailLower.split('@')[0],
        firstName: emailLower.split('@')[0],
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  /**
   * Listen to Supabase Session & Auth Changes
   */
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!hasSupabaseKeys) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase initial session error:", error.message);
        }

        if (mounted) {
          setSession(session);
          if (session?.access_token) {
            localStorage.setItem('attendx_jwt_token', session.access_token);
          } else {
            localStorage.removeItem('attendx_jwt_token');
          }
        }

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      if (newSession?.access_token) {
        localStorage.setItem('attendx_jwt_token', newSession.access_token);
      } else {
        localStorage.removeItem('attendx_jwt_token');
      }

      if (newSession?.user) {
        await fetchUserProfile(newSession.user);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Refresh user profile data from DB
   */
  const refreshUserData = async () => {
    const { data: { session: curSession } } = await supabase.auth.getSession();
    if (curSession?.user) {
      await fetchUserProfile(curSession.user);
    }
  };

  /**
   * Email / Password Login
   */
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (!email) return { success: false, error: 'Email address is required' };
      if (!password) return { success: false, error: 'Password is required' };

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        let msg = error.message;
        if (msg.includes('Invalid login credentials')) {
          msg = 'Invalid email or password. Please check your credentials.';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'Please verify your email address before logging in. Check your inbox.';
        }
        return { success: false, error: msg };
      }

      if (data.session) {
        setSession(data.session);
        if (data.session.access_token) {
          localStorage.setItem('attendx_jwt_token', data.session.access_token);
        }
        await fetchUserProfile(data.session.user);
        return { success: true };
      }

      return { success: false, error: 'Login failed to establish session' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'An unexpected error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google OAuth Sign In
   */
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });

      if (error) {
        console.error("Supabase Google OAuth error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to initiate Google sign-in' };
    }
  };

  /**
   * User Registration (Sign Up)
   * Automatically sets Admin role if nitesh933438@gmail.com, otherwise defaults to Student.
   */
  const register = async (payload: { email: string; password?: string; name?: string; role?: 'student' | 'teacher' }): Promise<{ success: boolean; requiresVerification?: boolean; message?: string; error?: string }> => {
    setLoading(true);
    try {
      if (!payload.email || !payload.password) {
        return { success: false, error: 'Email and password are required for registration' };
      }

      const emailLower = payload.email.trim().toLowerCase();
      const cleanName = payload.name?.trim() || emailLower.split('@')[0];
      const firstName = cleanName.split(' ')[0];
      const lastName = cleanName.split(' ').slice(1).join(' ') || '';

      // Primary admin account gets admin, otherwise use requested role (student/teacher), default student
      let initialRole: 'admin' | 'teacher' | 'student' = 'student';
      if (emailLower === 'nitesh933438@gmail.com') {
        initialRole = 'admin';
      } else if (payload.role === 'teacher') {
        initialRole = 'teacher';
      } else {
        initialRole = 'student';
      }

      const { data, error } = await supabase.auth.signUp({
        email: emailLower,
        password: payload.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: cleanName,
            first_name: firstName,
            last_name: lastName,
            role: initialRole
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        setSession(data.session);
        if (data.session.access_token) {
          localStorage.setItem('attendx_jwt_token', data.session.access_token);
        }
        await fetchUserProfile(data.session.user);
        return { success: true, message: 'Account created successfully!' };
      }

      // If Supabase requires email verification
      if (data.user && !data.session) {
        return {
          success: true,
          requiresVerification: true,
          message: 'Account registered! Please check your email to verify your account before logging in.'
        };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Forgot Password Link Email Request
   */
  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      if (!email) return { success: false, error: 'Email address is required' };

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { success: false, error: error.message };
      return { success: true, message: 'Password reset link has been sent to your email.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to request password reset' };
    }
  };

  /**
   * Reset / Update Password (Authenticated session from reset link)
   */
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Password update failed' };
    }
  };

  /**
   * Change Password (from Settings page)
   */
  const changePassword = async (
    payloadOrOldPassword: { currentPassword?: string; newPassword?: string } | string,
    newPass?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      let targetNewPassword = '';
      if (typeof payloadOrOldPassword === 'string') {
        targetNewPassword = newPass || '';
      } else {
        targetNewPassword = payloadOrOldPassword.newPassword || '';
      }

      if (!targetNewPassword || targetNewPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long.' };
      }

      const { error } = await supabase.auth.updateUser({ password: targetNewPassword });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to change password' };
    }
  };

  /**
   * Secure Sign Out / Logout
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error:", e);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('attendx_jwt_token');
      localStorage.removeItem('attendx_local_user');
      setLoading(false);
    }
  };

  /**
   * Update User Profile Details
   */
  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.name) payload.full_name = updates.name;
      if (updates.firstName) payload.first_name = updates.firstName;
      if (updates.lastName) payload.last_name = updates.lastName;
      if (updates.phoneNumber) payload.phone_number = updates.phoneNumber;
      if (updates.department) payload.department = updates.department;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      await refreshUserData();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update profile' };
    }
  };

  /**
   * Admin-only Update User Role
   */
  const updateUserRole = async (userId: string, newRole: 'admin' | 'teacher' | 'student'): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Permission denied: Only Admins can modify user roles.' };
    }

    try {
      // 1. Update in Supabase profiles
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error("Supabase role update error:", error.message);
        // Fallback to server API endpoint
        await apiClient.put(`/api/admin/users/${userId}/role`, { role: newRole });
      }

      if (user.id === userId) {
        await refreshUserData();
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to update user role' };
    }
  };

  /**
   * Admin-only Teacher Creation
   */
  const createTeacher = async (teacherData: { email: string; name: string; department?: string; employeeId?: string }): Promise<{ success: boolean; teacher?: any; error?: string }> => {
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Permission denied: Only Admins can create Teacher accounts.' };
    }

    try {
      const res = await apiClient.post('/api/admin/teachers', teacherData);
      return { success: true, teacher: res };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to create teacher account' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      loginWithGoogle,
      register,
      forgotPassword,
      resetPassword,
      changePassword,
      logout,
      refreshUserData,
      updateProfile,
      updateUserRole,
      createTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
