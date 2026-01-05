import React, { useRef, type ChangeEvent } from 'react';
import { uploadImage } from '../api/eventApi';

interface BackgroundChangerProps {
  onBackgroundChange: (imageUrl: string | null) => void;
  className?: string;
}

export const BackgroundChanger: React.FC<BackgroundChangerProps> = ({
  onBackgroundChange,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadImage(file);
      if (response.success && response.data) {
        onBackgroundChange(response.data.url);
      } else {
        alert(response.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
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
