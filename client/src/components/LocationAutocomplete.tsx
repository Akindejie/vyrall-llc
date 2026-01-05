import React, { useState, useEffect, useRef } from 'react';
import type { LocationAutocompleteProps, NominatimResult } from '../types';

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Location',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state if prop changes externally (e.g. initial load or reset)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'VyrallClient/1.0', // Polite usage of OSM API
          },
        }
      );

      if (response.ok) {
        const data: NominatimResult[] = await response.json();
        setSuggestions(data.map((item) => item.display_name));
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal); // Update parent immediately with raw text

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchLocations(newVal);
    }, 500); // 500ms debounce
  };

  const handleSelect = (location: string) => {
    setInputValue(location);
    onChange(location);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/5">
        <span className="text-xl">📍</span>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60"
        />
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-[100] max-h-60 overflow-y-auto 
          bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-800 transition-colors
                first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-0 text-sm leading-snug"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
