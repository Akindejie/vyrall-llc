import React from 'react';

interface QuickLinkButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export const QuickLinkButton: React.FC<QuickLinkButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-full flex items-center gap-2 font-medium transition-all
        ${isActive 
          ? 'bg-white/30 text-white border-2 border-white/40' 
          : 'bg-white/15 text-white/90 border border-white/20 hover:bg-white/20'
        } ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

