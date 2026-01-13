import React, { useRef, type ChangeEvent } from 'react';
import { uploadImage } from '../api/appApi';
import type { BackgroundChangerProps } from '../types';

export const BackgroundChanger: React.FC<BackgroundChangerProps> = ({
  onBackgroundChange,
  className = '',
  onFileSizeError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onFileSizeError) {
        onFileSizeError('Please select an image file');
      } else {
        alert('Please select an image file');
      }
      return;
    }

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
        onBackgroundChange(response.data.url);
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

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`w-full py-4 px-6 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 
          transition-all text-white font-medium flex items-center justify-center gap-2 ${className}`}
      >
        <span className="text-xl">🖼️</span>
        {isUploading ? 'Uploading...' : 'Change background'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};
