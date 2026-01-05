import React, { useRef } from 'react';
import type { PhotoGalleryModuleProps } from '../../types';

export const PhotoGalleryModule: React.FC<PhotoGalleryModuleProps> = ({
  photos,
  onPhotosChange,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Convert files to URLs
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    onPhotosChange([...photos, ...newPhotos]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  return (
    <div
      className="relative bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
      border border-white/20 transition-all hover:bg-black/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <span>🖼️</span> Photo Gallery
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

      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={photo}
              alt={`Gallery ${index}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <svg
                className="w-3 h-3"
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
        ))}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-white/20 
          flex flex-col items-center justify-center text-white/60 hover:text-white 
          hover:border-white/40 transition-all hover:bg-white/5"
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xs">Add Photo</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
