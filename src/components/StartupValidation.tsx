import React, { useEffect, useState } from 'react';
import { supabaseUrl, hasSupabaseKeys, supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle2, Database, LayoutDashboard, Loader2, ServerCrash, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function StartupValidation({ children }: { children: React.ReactNode }) {
  const [isValidating, setIsValidating] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkConnection() {
      if (!hasSupabaseKeys) {
        if (mounted) setIsValidating(false);
        return;
      }
      try {
        await supabase.auth.getSession();
        if (mounted) setIsConnected(true);
        if (mounted) setShowSuccess(true);
        // Wait 1.5s to show the success state
        setTimeout(() => {
          if (mounted) setIsValidating(false);
        }, 1500);
      } catch (err) {
        console.error("Supabase connection check failed:", err);
        if (mounted) setIsValidating(false);
      }
    }
    checkConnection();
    return () => { mounted = false; };
  }, []);

  if (isValidating || showSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex flex-col items-center mb-6">
            {showSuccess ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
            ) : (
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            )}
            <h2 className="text-xl font-bold">System Validation</h2>
            <p className="text-sm text-slate-400">Verifying environment configuration...</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-medium text-slate-400">Environment Loaded</span>
              {hasSupabaseKeys ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> YES</span>
              ) : (
                <span className="text-xs font-bold text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> NO</span>
              )}
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-medium text-slate-400">Supabase URL</span>
              <span className="text-xs font-mono text-slate-300 truncate max-w-[150px]" title={supabaseUrl || 'Missing'}>
                {supabaseUrl || 'Missing'}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-medium text-slate-400">Supabase Connected</span>
              {showSuccess ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> YES
                </span>
              ) : (
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verifying
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasSupabaseKeys) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20">
              <ServerCrash className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Missing Configuration</h2>
              <p className="text-sm text-red-400">Vercel Environment Variables</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            The application cannot start because the required Supabase environment variables are missing. Please configure them in your Vercel project settings or local <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-slate-400">VITE_SUPABASE_URL</span>
              <span className="text-xs font-semibold text-red-400">Missing</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-slate-400">VITE_SUPABASE_ANON_KEY</span>
              <span className="text-xs font-semibold text-red-400">Missing</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              How to fix this
            </h3>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside pl-1">
              <li>Go to your Vercel Project Dashboard</li>
              <li>Navigate to <strong>Settings</strong> &gt; <strong>Environment Variables</strong></li>
              <li>Add the two missing variables above</li>
              <li>Redeploy your application</li>
            </ol>
            
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <a href="/vercel-guide" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
                 View Detailed Visual Guide <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Once validated and keys exist, if the user wants to see the startup screen always briefly or we can just render children.
  // The user said: "6. Add a startup validation screen that prints: Current Supabase URL, Environment Loaded: YES/NO, Supabase Connected: YES/NO"
  // If it's a validation screen that blocks, it should only show if there's an error, or maybe we can log it to console?
  // Let's render a brief success screen or just render children if successful. Let's just log it or show it for 1 second.
  // Wait, the prompt implies "startup validation screen that prints... If environment variables are missing, show a friendly error page".
  // Let's just render the children if keys exist, and maybe log the info to console.
  
  return (
    <>
      {/* We can optionally render a tiny overlay for a few seconds or just render children. Let's render children. */}
      {children}
    </>
  );
}
