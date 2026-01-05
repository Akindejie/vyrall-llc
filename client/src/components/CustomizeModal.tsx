import React from 'react';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modules = [
    { icon: '📢', label: 'Announcements', description: 'Share important updates' },
    { icon: '👥', label: 'Guest list', description: 'Manage your attendees' },
    { icon: '🔗', label: 'Custom links', description: 'Add relevant links' },
    { icon: '📸', label: 'Photo gallery', description: 'Share event photos' },
    { icon: '✅', label: 'RSVP', description: 'Track responses' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Customize your event</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {modules.map((module) => (
            <button
              key={module.label}
              className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 
                transition-all text-left group"
            >
              <div className="text-3xl mb-3">{module.icon}</div>
              <h3 className="text-white font-semibold mb-1">{module.label}</h3>
              <p className="text-white/70 text-sm">{module.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-white/30 hover:bg-white/40 
              text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

