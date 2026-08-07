import React from 'react';
import { motion } from 'motion/react';

interface GlobalLoadingProps {
  message?: string;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({ message = 'Loading AttendX AI Workspace...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center"
      >
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin [animation-duration:1.5s]" />
        </div>
        <p className="text-xs font-bold text-slate-300 tracking-wider uppercase">{message}</p>
      </motion.div>
    </div>
  );
};
