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
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-3.5 py-2 gap-2 rounded-lg',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl',
  };

  const variantClasses = {
    primary: 'bg-[#193B2A] text-white hover:bg-[#142B21] active:bg-[#0E2319] focus-visible:ring-[#193B2A] border border-[#193B2A] shadow-2xs',
    secondary: 'bg-[#F7F5EF] text-[#252D27] hover:bg-[#E9E3D6] active:bg-[#DDD7CC] focus-visible:ring-[#193B2A] border border-[#E7E4DB]',
    outline: 'bg-transparent text-[#252D27] hover:bg-[#F7F5EF] active:bg-[#E9E3D6] focus-visible:ring-[#193B2A] border border-[#E7E4DB]',
    danger: 'bg-[#B94F45] text-white hover:bg-[#9E3E35] active:bg-[#7D322B] focus-visible:ring-[#B94F45] border border-[#B94F45]',
    ghost: 'bg-transparent text-[#737A72] hover:text-[#252D27] hover:bg-black/5 active:bg-black/10 focus-visible:ring-[#193B2A] border border-transparent',
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
