import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getLocalizedValue, languageStorageKey, supportedLanguages } from '../content/siteCopy.js';

const LanguageContext = createContext(null);
const allowedLanguageCodes = supportedLanguages.map((language) => language.code);

const resolveInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  if (storedLanguage && allowedLanguageCodes.includes(storedLanguage)) {
    return storedLanguage;
  }

  return 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(resolveInitialLanguage);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(languageStorageKey, language);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.siteLang = language;

      if (language === 'gu') {
        document.documentElement.lang = 'gu-IN';
      } else if (language === 'hi') {
        document.documentElement.lang = 'hi-IN';
      } else {
        document.documentElement.lang = 'en';
      }
    }
  }, [language]);

  const setLanguage = (nextLanguage) => {
    if (!allowedLanguageCodes.includes(nextLanguage)) {
      return;
    }
    setLanguageState(nextLanguage);
  };

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t: (value) => getLocalizedValue(value, language),
    }),
    [language],
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
