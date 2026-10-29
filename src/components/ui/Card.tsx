import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E6E1D8] rounded-md overflow-hidden ${
        hoverable ? 'hover:border-[#C5BCAD] hover:shadow-xs transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`p-4 sm:p-5 border-b border-[#E6E1D8] flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-[#1F2421] tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-[#5C6460] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-3 sm:px-5 sm:py-3.5 bg-[#FAF8F5] border-t border-[#E6E1D8] text-xs text-[#5C6460] ${className}`}>
      {children}
    </div>
  );
};
