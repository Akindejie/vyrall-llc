import React from 'react';
import type { QuickLinkButtonProps } from '../types';

export const QuickLinkButton: React.FC<QuickLinkButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  className = '',
  variant = 'default',
}) => {
  const baseStyles =
    'px-5 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all';

  const getStyles = () => {
    if (variant === 'text') {
      return 'text-white/70 hover:text-white';
    }

    if (isActive) {
      return 'bg-white/30 text-white border-2 border-white/40';
    }

    return 'bg-white/20 text-white/90 hover:bg-white/30 backdrop-blur-sm';
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${getStyles()} ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
};
