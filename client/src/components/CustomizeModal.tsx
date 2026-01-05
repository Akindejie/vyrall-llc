import React from 'react';

interface ModalToggles {
  showCapacity: boolean;
  showLinks: boolean;
  showPhotoGallery: boolean;
  showPrivacy: boolean;
  showAnnouncements: boolean;
}

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggles: ModalToggles;
  onToggle: (key: keyof ModalToggles) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  toggles,
  onToggle,
}) => {
  if (!isOpen) return null;

  const modules = [
    {
      key: 'showAnnouncements' as keyof ModalToggles,
      icon: '📢',
      label: 'Announcements',
      description: 'Share important updates',
    },
    {
      key: 'showCapacity' as keyof ModalToggles,
      icon: '👥',
      label: 'Guest list',
      description: 'Manage your attendees',
    },
    {
      key: 'showLinks' as keyof ModalToggles,
      icon: '🔗',
      label: 'Custom links',
      description: 'Add relevant links',
    },
    {
      key: 'showPhotoGallery' as keyof ModalToggles,
      icon: '🖼️',
      label: 'Photo gallery',
      description: 'Share event photos',
    },
    {
      key: 'showPrivacy' as keyof ModalToggles,
      icon: '🔒',
      label: 'Privacy',
      description: 'Control event visibility',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1C1C1E] backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Customize your event
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        <div className="grid grid-cols-2 gap-4">
          {modules.map((module) => {
            const isActive = toggles[module.key];
            return (
              <button
                key={module.key}
                onClick={() => onToggle(module.key)}
                className={`p-6 rounded-2xl border transition-all text-left group
                  ${
                    isActive
                      ? 'bg-white/10 border-white/40 shadow-lg'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 opacity-70 hover:opacity-100'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{module.icon}</div>
                  {isActive && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-black font-bold"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <h3
                  className={`font-semibold mb-1 ${
                    isActive ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {module.label}
                </h3>
                <p className="text-white/50 text-sm">{module.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-white text-black font-semibold 
              hover:bg-gray-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

