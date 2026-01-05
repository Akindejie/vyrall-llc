import React, { useState, useEffect, useRef } from 'react';
import type { GlossyDatePickerProps } from '../types';

export const GlossyDatePicker: React.FC<GlossyDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date and time',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  // Display date cursor for navigation (not necessarily selected)
  const [displayDate, setDisplayDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Update internal states when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setDisplayDate(date);
      }
    }
  }, [value]);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getDaysArray = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = [];

    // Empty spots for previous month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }

    // Days of current month
    for (let i = 1; i <= days; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(displayDate.getFullYear());
    newDate.setMonth(displayDate.getMonth());
    newDate.setDate(day);

    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const updateValue = (date: Date) => {
    // Format to YYYY-MM-DDTHH:mm for datetime-local compatibility
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    onChange(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setDisplayDate(newDate);
  };

  const setTime = (hours: number, minutes: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
    updateValue(newDate);
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">📅</span>
        <div className="flex-1 text-white placeholder-white/60">
          {formatDisplayValue() || (
            <span className="text-white/60">{placeholder}</span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[100] p-4 bg-white rounded-2xl shadow-xl min-w-[320px] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex gap-4">
            {/* Calendar Section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-800">
                  {months[displayDate.getMonth()]} {displayDate.getFullYear()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-600"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-gray-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysArray().map((day, i) => (
                  <div key={i} className="aspect-square">
                    {day && (
                      <button
                        onClick={() => handleDateSelect(day)}
                        className={`w-full h-full rounded-full text-sm flex items-center justify-center transition-colors
                          ${
                            day === selectedDate.getDate() &&
                            displayDate.getMonth() ===
                              selectedDate.getMonth() &&
                            displayDate.getFullYear() ===
                              selectedDate.getFullYear()
                              ? 'bg-blue-500 text-white font-medium shadow-md'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Section - Simplified AM/PM Column */}
            <div className="w-20 border-l border-gray-100 pl-4 flex flex-col gap-2">
              <div className="text-xs font-semibold text-gray-400 mb-2 text-center">
                Time
              </div>
              {/* Simple Time Scroller Mockup - Just putting standard times for now */}
              <div className="flex flex-col gap-1 h-[240px] overflow-y-auto custom-scrollbar pr-1">
                {Array.from({ length: 24 }).map((_, i) => {
                  const h = i % 12 || 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  const isSelected = selectedDate.getHours() === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setTime(i, 0)}
                      className={`text-xs py-2 px-1 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {h}:00 {ampm}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setSelectedDate(now);
                setDisplayDate(now);
                updateValue(now);
              }}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
