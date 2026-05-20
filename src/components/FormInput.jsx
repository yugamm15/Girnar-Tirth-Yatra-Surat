import React, { useRef } from 'react';

export const FormInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  className = '' 
}) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    if (type === 'date' && inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current.click();
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 block">
          {label} {required && '*'}
        </label>
      )}
      <div 
        className="relative group cursor-pointer"
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-white border-b-2 border-gray-100 py-3 text-base outline-none transition-all focus:border-[#c5a059] placeholder:text-gray-300 ${
            type === 'date' ? 'cursor-pointer' : ''
          }`}
        />
        {type === 'date' && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#c5a059] opacity-40 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
