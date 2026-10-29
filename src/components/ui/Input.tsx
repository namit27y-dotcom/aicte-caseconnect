import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#718096] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border ${
            error ? 'border-[#9B2226] focus:border-[#9B2226]' : 'border-[#D5CEC2] focus:border-[#1B4532]'
          } rounded-md text-sm text-[#1F2421] placeholder-[#A0AEC0] ${
            icon ? 'pl-9 pr-3.5 py-2' : 'px-3.5 py-2'
          } focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-[#9B2226]' : 'focus:ring-[#1B4532]'
          } transition-colors ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#9B2226]">{error}</p>}
    </div>
  );
};
