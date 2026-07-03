import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';

const isActivePath = (pathname, targetPath) => {
  if (targetPath === '/') {
    return pathname === '/';
  }

  if (
    targetPath === '/upashray-jirnodhar' ||
    targetPath === '/jinalay-jirnodhar' ||
    targetPath === '/about-girnar' ||
    targetPath === '/14-jinalaya' ||
    targetPath === '/sahesavan-tirth'
  ) {
    return pathname === targetPath || pathname.startsWith(targetPath + '/');
  }

  return pathname === targetPath;
};

const NavDropdown = ({ item, t, isDark, activeLinkClass, idleLinkClass, navLinkTypographyClass, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAnyChildActive = item.dropdown?.some(sub => isActivePath(location.pathname, sub.path));

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={`${isAnyChildActive ? activeLinkClass : idleLinkClass
          } ${navLinkTypographyClass} transition-colors duration-300 text-center leading-none whitespace-nowrap flex items-center gap-1.5`}
      >
        {t(item.label)}
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[1300] transition-all duration-200 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 translate-y-2 pointer-events-none invisible'
        }`}>
        <div className={`min-w-[210px] overflow-hidden rounded-xl border ${isDark
          ? 'bg-black/65 backdrop-blur-xl border-white/20 shadow-xl shadow-black/30'
          : 'bg-white border-gray-200 shadow-xl shadow-gray-300/30'
          }`}>
          {item.dropdown.map((subItem) => {
            const isSubActive = isActivePath(location.pathname, subItem.path);
            return (
              <Link
                key={subItem.key}
                to={subItem.path}
                className={`block px-5 py-4 text-[11px] 2xl:text-[12px] font-headline tracking-widest uppercase transition-colors whitespace-nowrap ${isSubActive
                  ? isDark ? 'text-primary bg-white/10 font-bold' : 'text-[#c5a059] bg-gray-100 font-bold'
                  : isDark ? 'hover:text-primary hover:bg-white/10 text-white/85' : 'hover:text-[#c5a059] hover:bg-gray-100 text-gray-700'
                  }`}
              >
                {t(subItem.label)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SiteNavbar = ({ variant = 'light' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const location = useLocation();
  const { t, language } = useLanguage();

  // Reset mobile menu on location change to prevent double-open glitches
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.documentElement.classList.toggle('mobile-nav-open', isMobileMenuOpen);
    document.body.classList.toggle('mobile-nav-open', isMobileMenuOpen);

    return () => {
      document.documentElement.classList.remove('mobile-nav-open');
      document.body.classList.remove('mobile-nav-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  const isIndicLanguage = language === 'gu' || language === 'hi';

  const isDark = variant === 'dark';
  const navWrapperClass = isMobileViewport
    ? 'fixed top-3 inset-x-0 px-3 z-[1200] flex items-center justify-between gap-2 pointer-events-none'
    : 'fixed top-2 lg:top-3 inset-x-0 px-4 lg:px-8 xl:px-10 z-[1200] flex justify-between items-center gap-3 pointer-events-none';

  const brandClass = 'pointer-events-auto flex items-center justify-center';

  const desktopNavClass = isDark
    ? 'hidden xl:flex items-center gap-4 px-4 xl:px-5 h-16 w-auto bg-black/25 backdrop-blur-md rounded-full border border-primary/40 shadow-lg shadow-black/15 pointer-events-auto isolate transform-gpu'
    : 'hidden xl:flex items-center gap-4 px-4 xl:px-5 h-16 w-auto bg-white rounded-full border border-gray-200 shadow-lg shadow-gray-200/50 pointer-events-auto isolate transform-gpu';

  const activeLinkClass = isDark ? 'text-primary border-b border-primary pb-1' : 'text-[#c5a059] border-b border-[#c5a059] pb-1';
  const idleLinkClass = isDark ? 'text-white hover:text-primary' : 'text-gray-500 hover:text-[#c5a059]';

  const menuButtonClass = isMobileViewport
    ? isDark
      ? 'flex-shrink-0 xl:hidden flex items-center justify-center w-12 h-12 bg-black/25 backdrop-blur-md rounded-full border border-primary/40 pointer-events-auto shadow-lg shadow-black/15'
      : 'flex-shrink-0 xl:hidden flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 pointer-events-auto'
    : isDark
      ? 'xl:hidden flex items-center justify-center w-12 h-12 bg-black/25 backdrop-blur-md rounded-full border border-primary/40 pointer-events-auto shadow-lg shadow-black/15'
      : 'xl:hidden flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 pointer-events-auto';

  const burgerLineClass = isDark ? 'bg-primary' : 'bg-[#c5a059]';
  const brandTitleClass = isIndicLanguage
    ? isMobileViewport
      ? 'text-[12px] leading-none tracking-normal whitespace-nowrap overflow-hidden text-ellipsis'
      : 'text-[11px] sm:text-[12px] lg:text-[16px] tracking-normal'
    : isMobileViewport
      ? 'text-[12px] leading-none tracking-[0.04em] whitespace-nowrap overflow-hidden text-ellipsis'
      : 'text-[10px] sm:text-[11px] lg:text-base tracking-[0.02em] lg:tracking-[0.12em]';
  const navLinkTypographyClass = isIndicLanguage
    ? 'font-body tracking-normal text-[13px] 2xl:text-[14px] font-medium'
    : 'font-headline tracking-[0.03em] text-[11px] 2xl:text-[12px] font-semibold';

  return (
    <>
      <nav className={navWrapperClass} aria-label="Primary">
        <Link to="/" className={brandClass} aria-label={t(siteCopy.brandName)}>
          <img src={isMobileViewport ? '/images/mobile/logo2.webp' : '/images/logo2.png'} alt="Logo" className="h-20 w-auto object-contain md:h-32 drop-shadow-2xl" />
        </Link>

        <div className={desktopNavClass}>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-5 2xl:gap-7">
            {siteCopy.navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <NavDropdown
                    key={item.key}
                    item={item}
                    t={t}
                    isDark={isDark}
                    activeLinkClass={activeLinkClass}
                    idleLinkClass={idleLinkClass}
                    navLinkTypographyClass={navLinkTypographyClass}
                    location={location}
                  />
                );
              }

              const isSelected = isActivePath(location.pathname, item.path);

              return (
                <Link
                  key={item.key}
                  aria-label={t(item.label)}
                  to={item.path}
                  className={`${isSelected ? activeLinkClass : idleLinkClass
                    } ${navLinkTypographyClass} transition-colors duration-300 text-center leading-none whitespace-nowrap`}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </div>

          <LanguageSwitcher variant={variant} />
        </div>

        <button
          type="button"
          className={menuButtonClass}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMobileMenuOpen(true);
          }}
          aria-label={t(siteCopy.common.openNavigationMenu)}
        >
          <div className="relative w-5 h-4">
            <span className={`absolute top-0 left-0 w-5 h-[2px] ${burgerLineClass}`} />
            <span className={`absolute top-[6px] left-0 w-5 h-[2px] ${burgerLineClass}`} />
            <span className={`absolute top-[12px] left-0 w-5 h-[2px] ${burgerLineClass}`} />
          </div>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[1400] transition-opacity duration-500 xl:hidden ${isDark ? 'bg-black/60' : 'bg-black/40'
          } ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-[86%] max-w-[360px] overflow-y-auto overscroll-contain transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } ${isDark ? 'bg-[#0a0a0a] border-l border-primary/10' : 'bg-white'} shadow-2xl flex flex-col`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={`flex flex-col items-center pt-16 pb-8 px-6 ${isDark ? 'border-b border-primary/10' : 'border-b border-gray-100'}`}>
            <img src="/images/logo2.png" alt="Logo" className="h-24 w-auto object-contain mb-6" />
            <div className={`text-xs font-bold tracking-[0.12em] font-headline text-center ${isDark ? 'text-primary' : 'text-[#c5a059]'}`}>
              {t(siteCopy.brandName)}
              <br />
              {t(siteCopy.brandLocation)}
            </div>
          </div>

          <div className="px-6 py-6 flex justify-center">
            <LanguageSwitcher variant={variant} />
          </div>

          <div className="flex-grow overflow-y-auto py-2">
            {siteCopy.navItems.map((item) => {
              if (item.dropdown) {
                const isAnyChildActive = item.dropdown.some(sub => isActivePath(location.pathname, sub.path));
                return (
                  <div key={item.key} className={`border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                    <div className={`px-8 py-5 font-headline text-[13px] tracking-[0.03em] ${isAnyChildActive
                      ? isDark ? 'text-primary font-bold' : 'text-[#c5a059] font-bold'
                      : isDark ? 'text-white/65' : 'text-gray-600'
                      }`}>
                      {t(item.label)}
                    </div>
                    <div className={`${isDark ? 'bg-white/5' : 'bg-gray-50/50'} py-2`}>
                      {item.dropdown.map((subItem) => {
                        const isSubSelected = isActivePath(location.pathname, subItem.path);
                        return (
                          <Link
                            key={subItem.key}
                            to={subItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`w-full block text-left px-12 py-3 font-headline text-[11px] tracking-[0.05em] uppercase transition-colors ${isSubSelected
                              ? isDark ? 'text-primary font-bold' : 'text-[#c5a059] font-bold'
                              : isDark ? 'text-white/50' : 'text-gray-500'
                              }`}
                          >
                            {t(subItem.label)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const isSelected = isActivePath(location.pathname, item.path);
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block text-left px-8 py-5 border-b font-headline text-[13px] tracking-[0.03em] transition-colors ${isDark ? 'border-white/5' : 'border-gray-50'
                    } ${isSelected
                      ? isDark
                        ? 'text-primary font-bold bg-primary/5'
                        : 'text-[#c5a059] font-bold'
                      : isDark
                        ? 'text-white/65 active:text-primary'
                        : 'text-gray-600 active:text-[#c5a059]'
                    }`}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
