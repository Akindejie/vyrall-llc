import React, { useState, useEffect, useRef } from 'react';

interface CurrencyInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  onAmountChange,
  currencyCode = 'USD',
  onCurrencyChange,
  placeholder = 'Cost per person',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'JPY',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch available currencies (cached in logic if possible, here simple fetch)
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (response.ok) {
          const data = await response.json();
          // Get keys and limit to common ones or user preferred?
          // For now, take top 20 or popular ones + all sorted?
          // Let's just take all keys
          const codes = Object.keys(data.rates).sort();
          // Move popular ones to top
          const popular = [
            'USD',
            'EUR',
            'GBP',
            'CAD',
            'AUD',
            'JPY',
            'INR',
            'CNY',
          ];
          const others = codes.filter((c) => !popular.includes(c));
          setCurrencies([...popular, ...others]);
        }
      } catch (error) {
        console.error('Failed to fetch currencies', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

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

  const getCurrencySymbol = (code: string) => {
    try {
      return (0)
        .toLocaleString(undefined, {
          style: 'currency',
          currency: code,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/\d/g, '')
        .trim();
    } catch {
      return code;
    }
  };

  const handleCurrencySelect = (code: string) => {
    onCurrencyChange(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/5">
        {/* Currency Selector (Icon/Symbol) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xl font-medium text-white/90 hover:text-white transition-colors min-w-[3rem]"
          type="button"
        >
          <span>{getCurrencySymbol(currencyCode)}</span>
          <span className="text-xs opacity-50">▼</span>
        </button>

        {/* Amount Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-white/60 no-spinner"
        />

        {/* Custom Spinners */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onAmountChange(String(Number(amount || 0) + 1))}
            className="text-white/40 hover:text-white transition-colors p-0.5"
            tabIndex={-1}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m1 5 4-4 4 4" />
            </svg>
          </button>
          <button
            onClick={() =>
              onAmountChange(String(Math.max(0, Number(amount || 0) - 1)))
            }
            className="text-white/40 hover:text-white transition-colors p-0.5"
            tabIndex={-1}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 1-4 4-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Currency Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 z-[100] max-h-60 w-48 overflow-y-auto 
          bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : (
            currencies.map((code) => (
              <button
                key={code}
                onClick={() => handleCurrencySelect(code)}
                className={`w-full text-left px-5 py-3 hover:bg-gray-100 transition-colors
                  first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-0 
                  flex items-center justify-between
                  ${
                    code === currencyCode
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-800'
                  }`}
              >
                <span>{code}</span>
                <span className="text-gray-400 text-sm">
                  {getCurrencySymbol(code)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
