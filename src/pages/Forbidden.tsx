import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-rose-500/5">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-rose-500 font-mono">403</span>
          <h1 className="text-xl font-extrabold text-white">Access Forbidden</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            You do not have administrative or teacher privileges to access this AttendX AI section.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
