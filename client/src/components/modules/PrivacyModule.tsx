import React from 'react';
import type { PrivacySettings } from '../../types/event.types';

interface PrivacyModuleProps {
  privacy: PrivacySettings;
  onChange: (privacy: PrivacySettings) => void;
  onRemove: () => void;
}

export const PrivacyModule: React.FC<PrivacyModuleProps> = ({
  privacy,
  onChange,
  onRemove,
}) => {
  const updatePrivacy = (key: keyof PrivacySettings, value: boolean) => {
    onChange({
      ...privacy,
      [key]: value,
    });
  };

  return (
    <div
      className="relative bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
      border border-white/20 transition-all hover:bg-black/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <span>🔒</span> Privacy Settings
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

      <div className="space-y-4">
        {/* Toggle Row: Public/Private */}
        <div className="flex items-center justify-between">
          <span className="text-white/80">Public Event</span>
          <Toggle
            checked={privacy.isPublic}
            onChange={(checked) => updatePrivacy('isPublic', checked)}
          />
        </div>

        {/* Toggle Row: Require Approval */}
        <div className="flex items-center justify-between">
          <span className="text-white/80">Require Approval</span>
          <Toggle
            checked={privacy.requireApproval}
            onChange={(checked) => updatePrivacy('requireApproval', checked)}
          />
        </div>

        {/* Toggle Row: Hide Guest List */}
        <div className="flex items-center justify-between">
          <span className="text-white/80">Hide Guest List</span>
          <Toggle
            checked={privacy.hideGuestList}
            onChange={(checked) => updatePrivacy('hideGuestList', checked)}
          />
        </div>
      </div>
    </div>
  );
};

// Simple Toggle Component
const Toggle: React.FC<{
  checked: boolean;
  onChange: (c: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors relative ${
      checked ? 'bg-white' : 'bg-white/20'
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
        checked ? 'bg-black left-6' : 'bg-white left-1'
      }`}
    />
  </button>
);
