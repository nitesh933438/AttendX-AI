import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
        } text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
        } text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] font-bold text-rose-500">{error}</p>}
    </div>
  );
};
