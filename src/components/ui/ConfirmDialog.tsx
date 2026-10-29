import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  requireReason = false,
  reasonPlaceholder = 'Please enter justification reason...',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) return;
    onConfirm(reason.trim());
    setReason('');
  };

  const variantColors = {
    danger: {
      button: 'danger' as const,
      icon: <AlertTriangle size={20} className="text-[#DC2626]" />,
      badge: 'bg-[#FEF2F2] border-[#FECACA]',
    },
    warning: {
      button: 'primary' as const,
      icon: <AlertTriangle size={20} className="text-[#D97706]" />,
      badge: 'bg-[#FFFBEB] border-[#FDE68A]',
    },
    primary: {
      button: 'primary' as const,
      icon: <AlertTriangle size={20} className="text-[#1B4532]" />,
      badge: 'bg-[#EBF3EE] border-[#CDE1D5]',
    },
  };

  const style = variantColors[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="relative w-full max-w-md bg-white border border-[#E6E1D8] rounded-xl shadow-2xl p-6 z-10 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg border shrink-0 ${style.badge}`}>
            {style.icon}
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-[#1F2421]">
              {title}
            </h3>
            <p id="confirm-dialog-description" className="text-xs text-[#5C6460] mt-1 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[#718096] hover:text-[#1F2421] p-1 rounded-md hover:bg-black/5"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {requireReason && (
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-[#1F2421]">
              Audit Justification (Required):
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              className="w-full bg-[#FAF8F5] border border-[#D5CEC2] rounded-md p-2.5 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532] focus:ring-1 focus:ring-[#1B4532]"
              autoFocus
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F4F1EA]">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={style.button}
            size="sm"
            onClick={handleConfirm}
            disabled={requireReason && !reason.trim()}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
