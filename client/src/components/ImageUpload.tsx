import React, { useRef, type ChangeEvent } from 'react';
import { uploadImage } from '../api/appApi';
import type { ImageUploadProps } from '../types';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  type,
  className = '',
  onFileSizeError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (onFileSizeError) {
        onFileSizeError('Please select an image file');
      } else {
        alert('Please select an image file');
      }
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const fileSizeKB = Math.round(file.size / 1024);
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      const maxSizeKB = MAX_FILE_SIZE / 1024;
      const message = `File size (${fileSizeMB}MB / ${fileSizeKB}KB) exceeds the maximum allowed size of ${maxSizeMB}MB (${maxSizeKB}KB). Please choose a smaller image.`;
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
      const response = await uploadImage(file);
      if (response.success && response.data) {
        onImageChange(response.data.url);
      } else {
        const errorMessage = response.error || 'Failed to upload image';
        // Reset file input on error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onFileSizeError) {
          onFileSizeError(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image';
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onFileSizeError) {
        onFileSizeError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  if (type === 'flyer') {
    return (
      <div className={`relative ${className}`}>
        <div
          className={`relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer group
            ${
              currentImage
                ? ''
                : 'bg-gradient-to-br from-purple-400 to-pink-400'
            }`}
          onClick={handleClick}
        >
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt="Event flyer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <button
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 rounded-full p-3 hover:bg-white"
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
              <button className="absolute bottom-4 right-4 bg-gray-700/80 hover:bg-gray-700 text-white rounded-full p-3 transition-colors">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                ) : (
                  <>
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
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
                    <p className="text-lg font-medium">Upload Flyer</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return null;
};
