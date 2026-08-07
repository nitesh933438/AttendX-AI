import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  full_name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Middleware: Verify Supabase JWT Access Token
 */
export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Authentication service unavailable: Supabase credentials missing in backend environment.' });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
    }

    // Determine Role: nitesh933438@gmail.com is strictly Admin
    let role: 'admin' | 'teacher' | 'student' = 'student';
    const emailLower = user.email?.toLowerCase() || '';

    if (emailLower === 'nitesh933438@gmail.com') {
      role = 'admin';
    } else {
      // Fetch role from profiles table
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role) {
        role = profile.role;
      } else if (user.user_metadata?.role === 'teacher') {
        role = 'teacher';
      }
    }

    req.user = {
      id: user.id,
      email: user.email || '',
      role: role,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0]
    };

    next();
  } catch (err: any) {
    console.error('JWT Authentication Middleware Error:', err);
    return res.status(501).json({ error: 'Authentication processing failed' });
  }
}

/**
 * Middleware: Role-Based Access Control (RBAC)
 */
export function authorizeRoles(...allowedRoles: Array<'admin' | 'teacher' | 'student'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}. Your role is ${req.user.role}` 
      });
    }

    next();
  };
}
