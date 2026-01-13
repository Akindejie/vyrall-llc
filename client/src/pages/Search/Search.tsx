import React from 'react';
import { Header } from '../../components/Header';

export const Search: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-pink-400/80 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <Header currentPage="search" />

        {/* Coming Soon Content */}
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-12 shadow-2xl text-center max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">
              Coming Soon...
            </h1>
            <p className="text-white/60 text-lg">
              The Search page is currently under development. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
