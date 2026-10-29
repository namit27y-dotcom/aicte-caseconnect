import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-md',
    md: 'text-sm px-3.5 py-2 gap-2 rounded-md',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-lg',
  };

  const variantClasses = {
    primary: 'bg-[#1B4532] text-white hover:bg-[#153728] active:bg-[#0f281d] focus-visible:ring-[#1B4532] border border-[#1B4532] shadow-xs',
    secondary: 'bg-[#F2EFE9] text-[#1F2421] hover:bg-[#EAE5DC] active:bg-[#DDD7CC] focus-visible:ring-[#1F2421] border border-[#E6E1D8]',
    outline: 'bg-transparent text-[#1F2421] hover:bg-[#F2EFE9] active:bg-[#EAE5DC] focus-visible:ring-[#1B4532] border border-[#D5CEC2]',
    danger: 'bg-[#9B2226] text-white hover:bg-[#851D20] active:bg-[#6E181B] focus-visible:ring-[#9B2226] border border-[#9B2226]',
    ghost: 'bg-transparent text-[#4A5568] hover:text-[#1F2421] hover:bg-black/5 active:bg-black/10 focus-visible:ring-[#1B4532] border border-transparent',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
