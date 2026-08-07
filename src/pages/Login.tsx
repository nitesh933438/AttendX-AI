import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, KeyRound, ShieldCheck, ArrowLeft, Loader2, Sparkles, UserCheck, GraduationCap, Shield } from 'lucide-react';
import { hasSupabaseKeys } from '../lib/supabase';

export default function Login() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { user, login, register, forgotPassword, loginWithGoogle, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    const res = await login(demoEmail, 'Password123!');
    if (res.success) {
      addToast('success', 'Demo Login Successful', `Logged in as ${demoEmail}`);
      navigate('/dashboard');
    } else {
      addToast('error', 'Login Failed', res.error || 'Invalid credentials');
    }
  };

  const handleGoogleSignIn = async () => {
    const { success, error } = await loginWithGoogle();
    if (success) {
      addToast('info', 'Redirecting to Google...', 'Opening secure Google authentication page');
    } else {
      addToast('error', 'Google Auth Error', error || 'Failed to initiate Google OAuth redirect');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signin') {
      const res = await login(email, password);
      if (res.success) {
        addToast('success', 'Welcome Back', 'Logged in successfully via Supabase');
        navigate('/dashboard');
      } else {
        addToast('error', 'Login Failed', res.error || 'Invalid email or password');
      }
    } else if (mode === 'signup') {
      const res = await register({ email, password, name });
      if (res.success) {
        if (res.requiresVerification) {
          addToast('info', 'Verification Email Sent', res.message || 'Please check your email inbox to verify your account');
        } else {
          addToast('success', 'Account Registered', 'Welcome to AttendX! You can now log in.');
        }
        setMode('signin');
      } else {
        addToast('error', 'Signup Failed', res.error || 'Unable to create account');
      }
    } else if (mode === 'forgot') {
      const res = await forgotPassword(email);
      if (res.success) {
        addToast('success', 'Reset Link Sent', res.message || 'Check your email for the reset link');
        setMode('signin');
      } else {
        addToast('error', 'Reset Failed', res.error || 'Unable to send reset link');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AttendX</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            {mode === 'signin' ? 'Welcome back, securely.' : mode === 'signup' ? 'Create your account.' : 'Recover your access.'}
          </p>
          
          {!hasSupabaseKeys && (
            <div className="mt-3 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs font-medium inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Demo & Local Mode Active
            </div>
          )}
        </div>

        {/* Quick Demo Access Buttons */}
        {mode === 'signin' && (
          <div className="mb-6 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('nitesh933438@gmail.com')}
                className="flex flex-col items-center gap-1 p-2 bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-800/50 rounded-xl text-indigo-200 text-xs font-medium transition-all group"
              >
                <Shield className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('teacher@attendx.edu')}
                className="flex flex-col items-center gap-1 p-2 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/50 rounded-xl text-purple-200 text-xs font-medium transition-all group"
              >
                <UserCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student@attendx.edu')}
                className="flex flex-col items-center gap-1 p-2 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/50 rounded-xl text-emerald-200 text-xs font-medium transition-all group"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Student</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {mode === 'signin' && (
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs text-indigo-400 hover:text-indigo-300">
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             mode === 'signin' ? <><LogIn className="w-4 h-4" /> Sign In</> :
             mode === 'signup' ? <><UserPlus className="w-4 h-4" /> Sign Up</> :
             <><KeyRound className="w-4 h-4" /> Send Reset Link</>}
          </button>
        </form>

        {(mode === 'forgot') && (
          <button
            onClick={() => setMode('signin')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        )}

        {(mode === 'signin' || mode === 'signup') && (
          <>
            <div className="my-5 relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold"><span className="bg-slate-900 px-2 text-slate-500">OR CONTINUE WITH</span></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-2.5 rounded-xl border border-slate-800 flex items-center justify-center gap-2 text-sm transition-all group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>
            
            <p className="mt-5 text-center text-xs text-slate-400">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-indigo-400 font-semibold hover:text-indigo-300">
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
