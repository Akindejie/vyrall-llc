import React from 'react';

interface FormInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'datetime-local' | 'number';
  showButton?: boolean;
  buttonIcon?: string;
  onButtonClick?: () => void;
  className?: string;
  variant?: 'default' | 'ghost'; // Added variant prop
}

export const FormInput: React.FC<FormInputProps> = ({
  icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  showButton = false,
  buttonIcon,
  onButtonClick,
  className = '',
  variant = 'default', // Default to 'default'
}) => {
  const baseStyles = 'flex items-center gap-3 px-5 py-4 transition-colors';
  const defaultStyles =
    'bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-black/30 focus-within:bg-black/30';
  const ghostStyles = 'hover:bg-white/5 focus-within:bg-white/5';

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${baseStyles} ${
          variant === 'default' ? defaultStyles : ghostStyles
        }`}
      >
        <span className="text-xl">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60"
        />
        {showButton && buttonIcon && (
          <button
            onClick={onButtonClick}
            className="text-white/80 hover:text-white transition-colors"
          >
            <span className="text-xl">{buttonIcon}</span>
          </button>
        )}
      </div>
    </div>
  );
};

interface FormTextareaProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  placeholder,
  value,
  onChange,
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
          border border-white/20 hover:bg-black/30 focus:bg-black/30 transition-colors
          text-white placeholder-white/60 outline-none resize-none custom-scrollbar"
      />
    </div>
  );
};
