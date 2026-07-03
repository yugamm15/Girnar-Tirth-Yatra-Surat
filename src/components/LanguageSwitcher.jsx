import { useState, useRef, useEffect } from 'react';
import { supportedLanguages } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const languageNameByCode = {
  en: 'English',
  gu: 'Gujarati',
  hi: 'Hindi',
};

export const LanguageSwitcher = ({ variant = 'light', className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = variant === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLanguageLabel = languageNameByCode[language] ?? language.toUpperCase();

  const buttonClasses = isDark
    ? `bg-white/5 border border-primary/20 text-white hover:bg-white/10 ${isOpen ? 'ring-2 ring-primary/30 bg-white/10' : ''}`
    : `bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 ${isOpen ? 'ring-2 ring-[#c5a059]/20 border-[#c5a059]/40' : ''}`;

  const menuClasses = isDark
    ? 'bg-black/70 border border-primary/20 backdrop-blur-xl shadow-2xl shadow-black/40'
    : 'bg-white border border-gray-200 backdrop-blur-xl shadow-xl shadow-gray-200/50';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 outline-none ${buttonClasses}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`text-[11px] font-bold tracking-widest ${isDark ? 'text-primary' : 'text-[#c5a059]'}`}>
          文
        </span>
        <span className="text-[13px] font-semibold tracking-wide min-w-[65px] text-left">
          {currentLanguageLabel}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-primary/70' : 'text-[#c5a059]/70'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-3 w-48 rounded-2xl overflow-hidden transition-all duration-500 origin-top-right z-[200] ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        } ${menuClasses}`}
      >
        <div className="py-2" role="listbox">
          {supportedLanguages.map((option) => {
            const isSelected = language === option.code;
            return (
              <button
                key={option.code}
                onClick={() => handleLanguageSelect(option.code)}
                role="option"
                aria-selected={isSelected}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm transition-all duration-300 group ${
                  isSelected
                    ? isDark ? 'bg-primary/10 text-primary' : 'bg-[#f7f0df] text-[#c5a059]'
                    : isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className={`font-bold tracking-wide ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
                    {languageNameByCode[option.code]}
                  </span>
                  <span className={`text-[10px] mt-0.5 opacity-50 font-medium ${isSelected ? 'opacity-70' : ''}`}>
                    {t(option.label)}
                  </span>
                </div>
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
