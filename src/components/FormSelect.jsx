import { useState, useRef, useEffect } from 'react';

export const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = 'Select Option',
  className = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`space-y-2 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 block">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white border-b-2 border-gray-100 py-3 text-left text-base outline-none transition-all flex items-center justify-between group ${
            isOpen ? 'border-[#c5a059]' : 'hover:border-gray-200'
          }`}
        >
          <span className={`${!selectedOption ? 'text-gray-300' : 'text-gray-900'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#c5a059]' : 'group-hover:text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute top-full left-0 right-0 mt-1 z-[150] transition-all duration-300 origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}>
          <div className="bg-white border border-[#c5a059]/20 shadow-2xl rounded-sm overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ target: { value: option.value } });
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                  value === option.value 
                    ? 'bg-[#c5a059]/10 text-[#c5a059] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
