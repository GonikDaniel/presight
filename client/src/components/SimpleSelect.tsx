import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  count?: number;
}

interface SimpleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
}

export function SimpleSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  className = '',
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(
    options.find((option) => option.value === value)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value));
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`block truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? (
              <span>
                {selectedOption.label}
                {selectedOption.count && (
                  <span className="text-gray-500 ml-1">({selectedOption.count})</span>
                )}
              </span>
            ) : (
              placeholder
            )}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
            {options.map((option) => (
              <button
                key={option.value}
                className={`relative cursor-pointer select-none py-2 pl-4 pr-4 w-full text-left hover:bg-blue-50 ${
                  selectedOption?.value === option.value
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-900'
                }`}
                onClick={() => handleSelect(option)}
              >
                <span
                  className={`block truncate ${selectedOption?.value === option.value ? 'font-medium' : 'font-normal'}`}
                >
                  {option.label}
                  {option.count && <span className="text-gray-500 ml-1">({option.count})</span>}
                </span>
                {selectedOption?.value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
