import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import TopLineLoader from '../components/TopLineLoader.jsx';
import ToastViewport from '../components/ToastViewport.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, sponsorshipSchemesDB, yatraDatesDB, yatrikRegistrationsDB } from '../lib/database.js';
import { formatDateForDisplay, isFutureYatraTrip } from '../utils/dateUtils.js';

const MonthlyBusYatraPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const pageCopy = siteCopy.monthlyBusPage;
  const [yatraDates, setYatraDates] = useState(pageCopy.yatraDates);
  const [sponsorshipSchemes, setSponsorshipSchemes] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [isLoadingSchemes, setIsLoadingSchemes] = useState(false);
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [toasts, setToasts] = useState([]);
  const [noticeState, setNoticeState] = useState(null);
  
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: false,
    onConfirm: () => {}
  });

  const [isMobileViewport, setIsMobileViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const yatraListRef = useRef(null);
  const cacheKey = 'monthly_bus_yatra_dates';

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4000);
  };

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

  useEffect(() => {
    let cancelled = false;

    const loadYatraDates = async () => {
      setIsLoadingDates(true);
      try {
        const cachedDates = dbCache.read(cacheKey);
        if (cachedDates) {
          setYatraDates(cachedDates);
        }

        const [records, registrations] = await Promise.all([
          yatraDatesDB.getAll(),
          yatrikRegistrationsDB.getAll(),
        ]);

        const counts = registrations.reduce((accumulator, registration) => {
          const key = String(registration.yatra_id);
          accumulator[key] = (accumulator[key] || 0) + 1;
          return accumulator;
        }, {});

        if (records.length === 0) {
          if (!cancelled) {
            setYatraDates(pageCopy.yatraDates);
            dbCache.write(cacheKey, pageCopy.yatraDates);
          }
          return;
        }

        const futureRecords = records.filter(isFutureYatraTrip);
        const nextDates = futureRecords.map((record) => ({
          id: record.id,
          date: { en: formatDateForDisplay(record.trip_date || record.date_text), gu: formatDateForDisplay(record.trip_date || record.date_text), hi: formatDateForDisplay(record.trip_date || record.date_text) },
          description: { en: record.description, gu: record.description, hi: record.description },
          image: record.image,
          registration_open: record.registration_open,
          date_raw: record.trip_date || record.date_text,
          max_capacity: record.max_capacity ?? null,
          registered_count: counts[String(record.id)] || 0,
          is_full: Number(record.max_capacity || 0) > 0 && (counts[String(record.id)] || 0) >= Number(record.max_capacity || 0)
        }));

        nextDates.sort((a, b) => {
          if (a.registration_open !== b.registration_open) {
            return a.registration_open ? -1 : 1;
          }
          return new Date(a.date_raw) - new Date(b.date_raw);
        });

        if (!cancelled) {
          setYatraDates(nextDates);
          dbCache.write(cacheKey, nextDates);
        }
      } catch (error) {
        console.log('Database error:', error.message);
        if (!dbCache.read(cacheKey)) {
          setYatraDates(pageCopy.yatraDates);
        }
      } finally {
        setIsLoadingDates(false);
      }
    };

    loadYatraDates();
    return () => {
      cancelled = true;
    };
  }, [pageCopy.yatraDates]);

  useEffect(() => {
    let cancelled = false;

    const loadRegistrationCounts = async () => {
      try {
        const records = await yatrikRegistrationsDB.getAll();
        const counts = records.reduce((accumulator, registration) => {
          const key = String(registration.yatra_id);
          accumulator[key] = (accumulator[key] || 0) + 1;
          return accumulator;
        }, {});
        if (!cancelled) {
          setRegistrationCounts(counts);
        }
      } catch (error) {
        console.log('Registration count error:', error.message);
      }
    };

    loadRegistrationCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSponsorshipSchemes = async () => {
      setIsLoadingSchemes(true);
      try {
        const records = await sponsorshipSchemesDB.getAll();
        if (!cancelled) {
          setSponsorshipSchemes(records.filter((scheme) => scheme.is_active !== false));
        }
      } catch (error) {
        console.log('Sponsorship error:', error.message);
      } finally {
        if (!cancelled) {
          setIsLoadingSchemes(false);
        }
      }
    };

    loadSponsorshipSchemes();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToYatras = () => {
    yatraListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleYatraSelect = (yatra) => {
    const bookedCount = registrationCounts[String(yatra.id)] || 0;
    const maxCapacity = Number(yatra.max_capacity || 0);
    const isFull = maxCapacity > 0 && bookedCount >= maxCapacity;

    if (isFull) {
      setNoticeState({
        type: 'capacity',
        yatraName: t(yatra.date),
        contactNumbers: t(siteCopy.contactPage.info.phoneValue)
      });
    } else if (yatra.registration_open) {
      navigate(`/monthly-bus-yatra/booking/${yatra.id}`);
    } else {
      setNoticeState({
        type: 'coming-soon',
        yatraName: t(yatra.date)
      });
    }
  };

  const getYatraStatusLabel = (yatra, bookedCount, maxCapacity, seatsLeft, isFull) => {
    if (isFull) {
      return t(pageCopy.yatraFull);
    }

    if (!yatra.registration_open) {
      return t(pageCopy.yatraUpcoming);
    }

    if (maxCapacity > 0) {
      return `${seatsLeft} ${t(pageCopy.yatraSeatsLeft)}`;
    }

    return t(pageCopy.yatraBookNow);
  };

  const handleSponsorshipSelect = (scheme) => {
    sessionStorage.setItem('pending_sponsorship_scheme', JSON.stringify({ schemeId: scheme.id }));
    navigate('/monthly-bus-yatra/sponsorship');
  };

  const getLocalizedSchemeLabel = (scheme) => {
    if (language === 'gu') {
      return String(scheme?.title || '').trim() || 'Unnamed Scheme';
    }

    const source = String(scheme?.description || scheme?.title || '').trim();
    if (!source) return 'Unnamed Scheme';

    const parts = source.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) return source;

    const languageIndex = {
      en: 0,
      gu: 1,
      hi: 2,
    }[language];

    return parts[Math.min(languageIndex ?? 0, parts.length - 1)] || parts[0];
  };

  return (
    <LightPageShell>
      <TopLineLoader active={isLoadingDates} label={t(pageCopy.refreshingYatraDates)} />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        danger={confirmState.danger}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
      />

      {/* Notice Modal */}
      {noticeState && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setNoticeState(null)} />
          <div className="relative w-full max-w-md bg-white p-10 text-center shadow-2xl border border-[#c5a059]/20 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#fcf9f2] rounded-full flex items-center justify-center mx-auto mb-8 border border-[#c5a059]/10">
              <span className="text-3xl animate-pulse">{noticeState.type === 'capacity' ? '⚠️' : '✨'}</span>
            </div>
            <h3 className="text-3xl font-headline text-gray-900 mb-4">
              {noticeState.type === 'capacity' ? t(pageCopy.yatraMaxCapacityReached) : t(pageCopy.yatraComingSoon)}
            </h3>
            <p className="text-gray-500 leading-relaxed mb-8">
              {noticeState.type === 'capacity' ? (
                <>
                  {t(pageCopy.yatraFullNotice)} <span className="text-[#c5a059] font-bold">{noticeState.yatraName}</span>. {t(pageCopy.yatraContactBelow)}
                </>
              ) : (
                <>
                  {t(pageCopy.yatraCheckBackSoon)} <span className="text-[#c5a059] font-bold">{noticeState.yatraName}</span> {t(pageCopy.yatraNotStartedYet)}
                </>
              )}
            </p>
            {noticeState.type === 'capacity' && (
              <div className="mb-8 space-y-2">
                {String(noticeState.contactNumbers || '').split('/').map((num) => {
                  const value = num.trim();
                  if (!value) return null;
                  return (
                    <a
                      key={value}
                      href={`tel:${value.replace(/[^0-9]/g, '')}`}
                      className="block text-[#8f6d2f] font-bold hover:text-[#b08d4a] transition-colors"
                    >
                      {value}
                    </a>
                  );
                })}
              </div>
            )}
            <button 
              onClick={() => setNoticeState(null)}
              className="w-full py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#b08d4a] transition-all"
            >
              {t(pageCopy.yatraGotItThanks)}
            </button>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto space-y-12 md:space-y-16 pb-12">
        <header className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 items-stretch">
          <article className="light-panel light-panel-left p-6 md:p-10">
            <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
              {t(pageCopy.heroBadge)}
            </span>
            <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-3xl">{t(pageCopy.heroTitle)}</h1>
            <p className="mt-5 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">{t(pageCopy.heroDescription)}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#9f7c3d]">{t(siteCopy.home.monthlyBus.frequencyLabel)}</p>
                <p className="mt-2 text-lg font-headline text-gray-900">{t(siteCopy.home.monthlyBus.frequencyValue)}</p>
              </div>
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#9f7c3d]">{t(siteCopy.home.monthlyBus.experienceLabel)}</p>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{t(siteCopy.home.monthlyBus.experienceValue)}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={scrollToYatras}
                className="px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
              >
                {t(pageCopy.ctaPrimary)}
              </button>
              <Link
                to="/contact-us"
                className="px-6 py-3 border border-[#c5a059] text-[#8f6d2f] uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#f7f0df] transition-colors"
              >
                {t(pageCopy.ctaSecondary)}
              </Link>
            </div>
          </article>

          <article className="light-panel light-panel-right light-card-image overflow-hidden">
            <SecureImage
              src={isMobileViewport ? '/images/mobile/bus.webp' : '/images/Bus Picture.png'}
              alt={t(pageCopy.heroTitle)}
              containerClassName="h-full min-h-[280px] md:min-h-[360px] w-full"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </article>
        </header>

        {/* Highlight Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pageCopy.highlightCards.map((card, index) => (
            <article key={index} className="light-panel-soft p-6">
              <h2 className="text-xl md:text-2xl font-headline text-[#8f6d2f]">{t(card.title)}</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{t(card.body)}</p>
            </article>
          ))}
        </section>

        {/* Sponsorship Module */}
        <section className="light-panel p-6 md:p-12 space-y-8 border border-[#c5a059]/30 bg-[#fcf9f2] shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-gray-900">{t(pageCopy.sponsorshipTitle)}</h2>
            <div className="mt-2 w-20 h-1 bg-[#c5a059] mx-auto opacity-40 rounded-full" />
            <p className="mt-4 text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t(pageCopy.sponsorshipDescription)}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {isLoadingSchemes ? (
              <div className="md:col-span-2 xl:col-span-4 p-6 bg-white border border-gray-100 shadow-sm text-sm text-gray-500">{t(pageCopy.sponsorshipLoading)}</div>
            ) : sponsorshipSchemes.length > 0 ? (
              sponsorshipSchemes.map((scheme) => {
                return (
                  <article key={scheme.id} className="light-panel-soft p-6 bg-white border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-headline text-gray-900">{getLocalizedSchemeLabel(scheme)}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">{t(pageCopy.sponsorshipPerBus)}</p>
                        <p className="mt-1 text-2xl font-headline text-[#c5a059]">₹{Number(scheme.amount || 0)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSponsorshipSelect(scheme)}
                      className="mt-auto px-5 py-3 bg-[#c5a059] text-white font-bold uppercase tracking-[0.16em] text-[10px] hover:bg-[#b08d4a] transition-colors"
                    >
                      {t(pageCopy.sponsorshipButton)}
                    </button>
                  </article>
                );
              })
            ) : (
              <div className="md:col-span-2 xl:col-span-4 p-6 bg-white border border-gray-100 shadow-sm text-sm text-gray-500">
                {t(pageCopy.sponsorshipEmpty)}
              </div>
            )}
          </div>
        </section>

        {/* Yatra Dates Section */}
        <section ref={yatraListRef} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-gray-900">{t(pageCopy.upcomingYatrasTitle)}</h2>
            <div className="mt-2 w-20 h-1 bg-[#c5a059] mx-auto opacity-40 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yatraDates.length > 0 ? (
              yatraDates.map((yatra, index) => {
                const bookedCount = registrationCounts[String(yatra.id)] || 0;
                const maxCapacity = Number(yatra.max_capacity || 0);
                const seatsLeft = maxCapacity > 0 ? Math.max(maxCapacity - bookedCount, 0) : null;
                const isFull = maxCapacity > 0 && seatsLeft === 0;

                return (
                  <article
                    key={index}
                    onClick={() => handleYatraSelect(yatra)}
                    className="light-panel-soft group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    <div className="p-6 flex gap-5 flex-1 relative">
                      {isFull ? (
                        <div className="absolute top-2 right-2 bg-red-50 text-red-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm border border-red-100">
                          {t(pageCopy.yatraFull)}
                        </div>
                      ) : !yatra.registration_open && (
                        <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm border border-gray-200">
                          {t(pageCopy.yatraUpcoming)}
                        </div>
                      )}
                      <SecureImage 
                        src={yatra.image} 
                        alt={t(yatra.date)} 
                        containerClassName="w-24 h-24 shrink-0 rounded-sm border border-gray-100 shadow-sm"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-xl font-headline text-[#d32f2f] leading-tight group-hover:text-[#b71c1c] transition-colors">
                          {t(yatra.date)}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed font-light line-clamp-2">
                          {t(yatra.description)}
                        </p>
                        <p className="mt-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                          {maxCapacity > 0 ? `${bookedCount} / ${maxCapacity} ${t(pageCopy.yatraSeatsFilled)}` : `${bookedCount} ${t(pageCopy.yatraRegistrations)}`}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059]">
                            {getYatraStatusLabel(yatra, bookedCount, maxCapacity, seatsLeft, isFull)}
                          </span>
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-[#c5a059] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center light-panel-soft">
                <div className="w-16 h-16 bg-[#fcf9f2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c5a059]/10">
                  <span className="text-2xl opacity-50">✨</span>
                </div>
                <h3 className="text-xl font-headline text-gray-800">{t(pageCopy.yatraEmptyTitle)}</h3>
                <p className="text-sm text-gray-500 mt-2">{t(pageCopy.yatraEmptyBody)}</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </LightPageShell>
  );
};

export default MonthlyBusYatraPage;
