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
    <div
      className="relative bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
      border border-white/20 hover:bg-black/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">👥</span>
        <input
          type="number"
          value={capacity || ''}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder="Enter capacity"
          min="1"
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg font-medium no-spinner"
        />

        {/* Custom Spinners */}
        <div className="flex flex-col gap-0.5 mr-2 border-r border-white/10 pr-3">
          <button
            onClick={() => onChange((capacity || 0) + 1)}
            className="text-white/40 hover:text-white transition-colors p-0.5"
            tabIndex={-1}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m1 5 4-4 4 4" />
            </svg>
          </button>
          <button
            onClick={() => onChange(Math.max(1, (capacity || 0) - 1))}
            className="text-white/40 hover:text-white transition-colors p-0.5"
            tabIndex={-1}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 1-4 4-4-4" />
            </svg>
          </button>
        </div>

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
    </div>
  );
};
