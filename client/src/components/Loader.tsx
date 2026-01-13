import React from 'react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : 'flex items-center justify-center py-20';

  return (
    <div className={containerClasses}>
      {fullScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-pink-400/80 backdrop-blur-sm" />
      )}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
          </div>
          {/* Message */}
          <p className="text-white/80 text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
