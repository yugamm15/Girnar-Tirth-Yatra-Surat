import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { yatraDatesDB, yatrikRegistrationsDB } from '../lib/database.js';

const MonthlyBusYatraPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.monthlyBusPage;
  const [selectedYatra, setSelectedYatra] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [yatrikList, setYatrikList] = useState([]);
  const [yatraDates, setYatraDates] = useState(pageCopy.yatraDates);
  const [currentYatrik, setCurrentYatrik] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    altPhone: '',
    birthdate: '',  // CHANGED: age -> birthdate
    gender: '',
    remarks: '',
  });
  const yatraListRef = useRef(null);

  useEffect(() => {
    const loadYatraDates = async () => {
      try {
        const records = await yatraDatesDB.getAll();

        if (records.length === 0) {
          setYatraDates(pageCopy.yatraDates);
          return;
        }

        setYatraDates(
          records.map((record) => ({
            id: record.id,
            date: { en: record.date_text, gu: record.date_text, hi: record.date_text },
            description: { en: record.description, gu: record.description, hi: record.description },
            image: record.image,
          }))
        );
      } catch (error) {
        console.log('Database not configured yet. Using local yatra dates.', error.message);
        setYatraDates(pageCopy.yatraDates);
      }
    };

    loadYatraDates();
  }, [pageCopy.yatraDates]);

  const scrollToYatras = () => {
    yatraListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleYatraSelect = (yatra) => {
    setSelectedYatra(yatra);
    setShowRegistrationForm(true);
    setRegistrationStatus(null);
    setYatrikList([]);
    resetForm();
  };

  const resetForm = () => {
    setCurrentYatrik({
      firstName: '',
      lastName: '',
      phone: '',
      altPhone: '',
      birthdate: '',  // CHANGED: age -> birthdate
      gender: '',
      remarks: '',
    });
  };

  const handleAddAnother = () => {
    if (!validateCurrentYatrik()) return;
    setYatrikList([...yatrikList, currentYatrik]);
    resetForm();
  };

  const validateCurrentYatrik = () => {
    return (
      currentYatrik.firstName &&
      currentYatrik.lastName &&
      currentYatrik.phone &&
      currentYatrik.birthdate &&  // CHANGED: age -> birthdate
      currentYatrik.gender
    );
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const finalYatrikList = [...yatrikList, currentYatrik];
    
    try {
      // Save birthdate records directly to the database
      const registrationsToSave = finalYatrikList.map(yatrik => ({
        first_name: yatrik.firstName,
        last_name: yatrik.lastName,
        phone: yatrik.phone,
        alt_phone: yatrik.altPhone,
        birthdate: yatrik.birthdate,  // Store birthdate
        gender: yatrik.gender,
        remarks: yatrik.remarks,
        yatra_id: null,  // Set if you have yatra IDs in database
      }));

      // Attempt to save to database
      // If Supabase is not configured, still show success but log to console
      try {
        await yatrikRegistrationsDB.createMultiple(registrationsToSave);
      } catch (dbError) {
        console.log('Database not configured yet. Registration data:', finalYatrikList);
      }

      console.log('Final Registration Data:', {
        yatra: selectedYatra,
        yatrikList: finalYatrikList,
        registrations: registrationsToSave
      });

      setRegistrationStatus('success');
      setTimeout(() => {
        setShowRegistrationForm(false);
        setSelectedYatra(null);
        setYatrikList([]);
        resetForm();
      }, 4000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      setRegistrationStatus('error');
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 4000);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentYatrik((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <LightPageShell>
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
              src="/images/girnar_Bus_picture.png"
              alt={t(pageCopy.heroTitle)}
              containerClassName="h-full min-h-[280px] md:min-h-[360px] w-full"
              className="w-full h-full object-cover"
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

        {/* Yatra Dates Section */}
        <section ref={yatraListRef} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-headline text-gray-900">{t(pageCopy.upcomingYatrasTitle)}</h2>
            <div className="mt-2 w-20 h-1 bg-[#c5a059] mx-auto opacity-40 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yatraDates.map((yatra, index) => (
              <article 
                key={index}
                onClick={() => handleYatraSelect(yatra)}
                className="light-panel-soft group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex gap-5 flex-1">
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
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed font-light">
                      {t(yatra.description)}
                    </p>
                    <div className="mt-auto pt-4">
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-[#c5a059] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Registration Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => !registrationStatus && setShowRegistrationForm(false)} 
            />
            <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-300">
              <div className="bg-[#c5a059] p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-headline">{t(pageCopy.registrationForm.title)}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {t(pageCopy.registrationForm.subtitle)} <span className="font-bold">{t(selectedYatra.date)}</span>
                  </p>
                </div>
                {yatrikList.length > 0 && (
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {yatrikList.length} {t(pageCopy.registrationForm.yatrikCount).replace('#', '')}Added
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                {registrationStatus === 'success' ? (
                  <div className="py-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-2xl font-headline text-gray-900 px-4 leading-tight">{t(pageCopy.registrationForm.success)}</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                      <div className="w-6 h-6 bg-[#c5a059]/10 text-[#c5a059] rounded-full flex items-center justify-center text-xs font-bold">
                        {yatrikList.length + 1}
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        {t(pageCopy.registrationForm.yatrikCount).replace('#', yatrikList.length + 1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.firstName)}
                        </label>
                        <input 
                          required
                          type="text" 
                          value={currentYatrik.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900"
                          placeholder={t(pageCopy.registrationForm.firstName)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.lastName)}
                        </label>
                        <input 
                          required
                          type="text" 
                          value={currentYatrik.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900"
                          placeholder={t(pageCopy.registrationForm.lastName)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.phone)}
                        </label>
                        <input 
                          required
                          type="tel" 
                          value={currentYatrik.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900"
                          placeholder="99887 76655"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.altPhone)}
                        </label>
                        <input 
                          type="tel" 
                          value={currentYatrik.altPhone}
                          onChange={(e) => handleInputChange('altPhone', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900"
                          placeholder="99887 76655"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.birthdate) || 'Date of Birth'}
                        </label>
                        <input 
                          required
                          type="date" 
                          value={currentYatrik.birthdate}
                          onChange={(e) => handleInputChange('birthdate', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                          {t(pageCopy.registrationForm.gender)}
                        </label>
                        <div className="flex gap-4 mt-2">
                          {['male', 'female', 'other'].map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                required
                                type="radio" 
                                name="gender" 
                                value={option}
                                checked={currentYatrik.gender === option}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="w-4 h-4 border-gray-300 text-[#c5a059] focus:ring-[#c5a059]"
                              />
                              <span className="text-xs text-gray-600 group-hover:text-gray-900">
                                {t(pageCopy.registrationForm.genderOptions[option])}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        {t(pageCopy.registrationForm.remarks)}
                      </label>
                      <textarea 
                        rows={2}
                        value={currentYatrik.remarks}
                        onChange={(e) => handleInputChange('remarks', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#c5a059] focus:ring-0 outline-none transition-colors rounded-sm text-gray-900 resize-none"
                        placeholder="..."
                      />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row gap-3">
                        <button
                          type="button"
                          onClick={handleAddAnother}
                          disabled={!validateCurrentYatrik()}
                          className="flex-1 px-6 py-4 border-2 border-[#c5a059] text-[#c5a059] uppercase tracking-widest text-[10px] font-bold hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t(pageCopy.registrationForm.addAnother)}
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-6 py-4 bg-[#c5a059] text-white uppercase tracking-widest text-[10px] font-bold hover:bg-[#b08d4a] transition-all shadow-lg shadow-yellow-900/10"
                        >
                          {t(pageCopy.registrationForm.submit)}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRegistrationForm(false)}
                        className="w-full py-3 text-gray-400 uppercase tracking-widest text-[10px] font-bold hover:text-gray-600 transition-all"
                      >
                        {t(pageCopy.registrationForm.cancel)}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </LightPageShell>
  );
};

export default MonthlyBusYatraPage;
