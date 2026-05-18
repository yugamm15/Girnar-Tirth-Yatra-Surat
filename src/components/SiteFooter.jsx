import { Link } from 'react-router-dom';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export const SiteFooter = ({ variant = 'light' }) => {
  const { t } = useLanguage();
  const isDark = variant === 'dark';

  const wrapperClass = isDark
    ? 'w-full bg-black/40 backdrop-blur-md border-t border-primary/10'
    : 'w-full bg-white border-t border-gray-200';

  const copyrightClass = isDark ? 'text-primary/60' : 'text-[#9f7c3d]';
  const linkClass = isDark ? 'text-neutral-500 hover:text-primary' : 'text-gray-500 hover:text-[#c5a059]';

  return (
    <footer className={wrapperClass}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-6 md:py-10 gap-4">
        <div className={`${copyrightClass} font-bold font-body text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.35em] text-center`}>
          {t(siteCopy.footer.copyright)}
        </div>
        <div className="flex gap-6 md:gap-10 font-body text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.35em] uppercase">
          <span className={linkClass}>{t(siteCopy.footer.privacy)}</span>
          <Link to="/events" className={linkClass}>
            {t(siteCopy.footer.rituals)}
          </Link>
          <Link to="/contact-us" className={linkClass}>
            {t(siteCopy.footer.contact)}
          </Link>
        </div>
      </div>
    </footer>
  );
};
