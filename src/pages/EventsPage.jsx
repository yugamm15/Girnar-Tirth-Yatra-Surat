import { Link } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const EventsPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.eventsPage;

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
            {t(pageCopy.heroBadge)}
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">{t(pageCopy.heroTitle)}</h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-4xl leading-relaxed">{t(pageCopy.heroDescription)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <article className="light-panel-soft light-card-image overflow-hidden">
            <img
              src="/image/5.jpg"
              alt={t(pageCopy.sections[0].title)}
              className="w-full h-56 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-headline text-gray-900">{t(pageCopy.sections[0].title)}</h2>
              <ul className="mt-4 space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
                {pageCopy.sections[0].points.map((point, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#c5a059] shrink-0" />
                    <span>{t(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="light-panel-soft light-card-image overflow-hidden">
            <img
              src="/image/6.JPG"
              alt={t(pageCopy.sections[1].title)}
              className="w-full h-56 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-headline text-gray-900">{t(pageCopy.sections[1].title)}</h2>
              <ul className="mt-4 space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
                {pageCopy.sections[1].points.map((point, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[#c5a059] shrink-0" />
                    <span>{t(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <section className="light-panel light-panel-left p-6 md:p-10 pb-8 md:pb-10">
          <h3 className="text-2xl md:text-4xl font-headline text-gray-900">{t(pageCopy.ctaTitle)}</h3>
          <p className="mt-4 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">{t(pageCopy.ctaBody)}</p>
          <Link
            to="/contact-us"
            className="inline-block mt-6 px-7 py-3 bg-[#c5a059] text-white uppercase tracking-[0.18em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
          >
            {t(pageCopy.ctaButton)}
          </Link>
        </section>
      </section>
    </LightPageShell>
  );
};

export default EventsPage;
