import React from 'react';

interface CapacityModuleProps {
  capacity: number | undefined;
  onChange: (capacity: number) => void;
  onRemove: () => void;
}

export const CapacityModule: React.FC<CapacityModuleProps> = ({
  capacity,
  onChange,
  onRemove,
}) => {
  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 
      border border-white/20 hover:bg-white/15 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl">👥</span>
        <input
          type="number"
          value={capacity || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder="Enter capacity"
          min="1"
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg font-medium"
        />
        <button
          onClick={onRemove}
          className="text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

