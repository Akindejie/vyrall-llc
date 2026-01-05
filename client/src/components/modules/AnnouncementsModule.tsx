import React from 'react';
import type { AnnouncementsModuleProps } from '../../types';

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcement,
  onChange,
  onRemove,
}) => {
  return (
    <div
      className="relative bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
      border border-white/20 transition-all hover:bg-black/30"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium flex items-center gap-2">
          <span>📢</span> Announcements
        </h3>
        <button
          onClick={onRemove}
          className="text-white/60 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <textarea
        value={announcement}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Share an update with your guests..."
        className="w-full bg-transparent outline-none text-white placeholder-white/50 
        resize-none min-h-[80px] text-sm"
      />
    </div>
  );
};
