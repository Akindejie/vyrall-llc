import React, { useRef, useState } from 'react';
import { uploadImage } from '../../api/appApi';
import type { PhotoGalleryModuleProps } from '../../types';

export const PhotoGalleryModule: React.FC<PhotoGalleryModuleProps> = ({
  photos,
  onPhotosChange,
  onRemove,
  onFileSizeError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file sizes before uploading
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileSizeMB = (oversizedFiles[0].size / (1024 * 1024)).toFixed(2);
      const fileSizeKB = Math.round(oversizedFiles[0].size / 1024);
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      const maxSizeKB = MAX_FILE_SIZE / 1024;
      const message = `One or more files exceed the maximum allowed size of ${maxSizeMB}MB (${maxSizeKB}KB). The largest file is ${fileSizeMB}MB (${fileSizeKB}KB). Please choose smaller images.`;
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onFileSizeError) {
        onFileSizeError(message);
      } else {
        alert(message);
      }
      return;
    }

    setIsUploading(true);
    try {
      // Upload all files and get their URLs (which are base64 in mock)
      const uploadPromises = files.map((file) => uploadImage(file));
      const results = await Promise.all(uploadPromises);

      const newUrls = results
        .filter((res) => res.success && res.data)
        .map((res) => res.data!.url);

      if (newUrls.length > 0) {
        onPhotosChange([...photos, ...newUrls]);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          disabled={isUploading}
          className="aspect-square rounded-xl border-2 border-dashed border-white/20 
          flex flex-col items-center justify-center text-white/60 hover:text-white 
          hover:border-white/40 transition-all hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin mb-1" />
              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
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
            </>
          )}
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
