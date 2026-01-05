import React from 'react';
import type { StatusModalProps } from '../types';

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  messages,
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div
        className={`bg-[#1C1C1E] backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full 
        border shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200
        ${isSuccess ? 'border-green-500/20' : 'border-red-500/20'}`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 
            ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'}`}
          >
            <span className="text-4xl">{isSuccess ? '🚀' : '⚠️'}</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isSuccess ? 'Event Published!' : 'Missing Details'}
          </h2>

          <p className="text-white/60 mb-6 text-sm">
            {isSuccess
              ? 'Your event is now live and ready to be shared with the world.'
              : 'Please fill in the following fields to continue:'}
          </p>

          {!isSuccess && (
            <div className="w-full bg-white/5 rounded-xl p-4 mb-6 text-left">
              <ul className="space-y-2">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-red-300/90 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-full font-semibold transition-all
              ${
                isSuccess
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            {isSuccess ? 'Start New Event' : "Okay, I'll fix it"}
          </button>
        </div>
      </div>
    </div>
  );
};
