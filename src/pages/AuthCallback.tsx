import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, hasSupabaseKeys } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    let timer: any = null;

    async function handleAuthCallback() {
      try {
        if (!hasSupabaseKeys) {
          if (mounted) {
            setErrorMsg("Supabase configuration keys (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are missing in environment.");
          }
          return;
        }

        // 1. Check for PKCE authorization code in query string
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const errorDescription = searchParams.get('error_description') || searchParams.get('error');

        if (errorDescription) {
          if (mounted) setErrorMsg(decodeURIComponent(errorDescription));
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("PKCE Code exchange error:", error.message);
            if (mounted) setErrorMsg(error.message);
            return;
          }

          if (data.session) {
            if (data.session.access_token) {
              localStorage.setItem('attendx_jwt_token', data.session.access_token);
            }
            await refreshUserData();
            if (mounted) {
              navigate('/dashboard', { replace: true });
            }
            return;
          }
        }

        // 2. Check for hash implicit flow or existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth callback getSession error:", sessionError.message);
          if (mounted) setErrorMsg(sessionError.message);
          return;
        }

        if (session) {
          if (session.access_token) {
            localStorage.setItem('attendx_jwt_token', session.access_token);
          }
          await refreshUserData();
          if (mounted) {
            navigate('/dashboard', { replace: true });
          }
          return;
        }

        // 3. Listener fallback for async auth state update
        const authRes = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession && mounted) {
            if (currentSession.access_token) {
              localStorage.setItem('attendx_jwt_token', currentSession.access_token);
            }
            await refreshUserData();
            if (mounted) {
              navigate('/dashboard', { replace: true });
            }
          }
        });
        subscription = authRes.data.subscription;

        // Timeout fallback if no session within 7 seconds
        timer = setTimeout(() => {
          if (mounted) {
            setErrorMsg("Authentication process timed out. Please verify your Supabase OAuth settings and try again.");
          }
        }, 7000);
      } catch (err: any) {
        if (mounted) setErrorMsg(err?.message || "An unexpected error occurred during Google authentication.");
      }
    }

    handleAuthCallback();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [navigate, refreshUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
          {errorMsg ? <AlertCircle className="w-6 h-6 text-red-400" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
        </div>

        {errorMsg ? (
          <>
            <h3 className="text-lg font-bold text-white mb-2">Authentication Error</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl transition-all"
            >
              Return to Login
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-1">Completing Google Sign-In</h3>
            <p className="text-xs text-slate-400 mb-6">Exchanging authorization token & syncing profile...</p>
            <div className="flex items-center justify-center gap-2 text-indigo-400 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to AttendX Dashboard</span>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

