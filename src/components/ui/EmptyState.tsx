import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FolderOpen size={36} className="text-[#94A3B8]" strokeWidth={1.5} />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-[#1F2421]">{title}</h3>
      <p className="text-xs text-[#5C6460] mt-1 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
