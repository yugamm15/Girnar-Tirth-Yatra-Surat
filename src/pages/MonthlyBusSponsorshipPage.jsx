import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import TopLineLoader from '../components/TopLineLoader.jsx';
import ToastViewport from '../components/ToastViewport.jsx';
import { sponsorshipSchemesDB, paymentIntentsDB, yatraDatesDB } from '../lib/database.js';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatDateForDisplay, isFutureYatraTrip } from '../utils/dateUtils.js';

const emptySponsor = {
  name: '',
  phone: '',
  email: '',
  city: '',
  notes: '',
};

const MonthlyBusSponsorshipPage = () => {
  const { t, language } = useLanguage();
  const pageCopy = siteCopy.monthlyBusPage;
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [yatraDates, setYatraDates] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [selectedTripIds, setSelectedTripIds] = useState([]);
  const [sponsorForm, setSponsorForm] = useState(emptySponsor);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id));
  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4000);
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const [schemeData, tripData] = await Promise.all([
          sponsorshipSchemesDB.getAll(),
          yatraDatesDB.getAll(),
        ]);

        if (cancelled) return;

        const activeSchemes = schemeData.filter((scheme) => scheme.is_active !== false);
        setSchemes(activeSchemes);
        setYatraDates(tripData.map((trip) => ({
          ...trip,
          date_text: trip.trip_date ? formatDateForDisplay(trip.trip_date) : trip.date_text || '',
          date_raw: trip.trip_date || trip.date_text || null,
        })));

        const stored = sessionStorage.getItem('pending_sponsorship_scheme');
        const parsed = stored ? JSON.parse(stored) : null;
        const storedSchemeId = parsed?.schemeId ? Number(parsed.schemeId) : null;
        const initialScheme = activeSchemes.find((scheme) => Number(scheme.id) === storedSchemeId) || activeSchemes[0] || null;

        if (initialScheme) {
          setSelectedSchemeId(initialScheme.id);
        }
      } catch (error) {
        console.error('Failed to load sponsorship data:', error);
        pushToast('Failed to load sponsorship options.', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const getLocalizedSchemeLabel = (scheme) => {
    if (!scheme) return 'Unnamed Scheme';
    if (language === 'gu') {
      return String(scheme?.title || '').trim() || 'Unnamed Scheme';
    }
    const source = String(scheme?.description || scheme?.title || '').trim();
    if (!source) return 'Unnamed Scheme';
    const parts = source.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) return source;
    const languageIndex = { en: 0, gu: 1, hi: 2 }[language] ?? 0;
    return parts[Math.min(languageIndex, parts.length - 1)] || parts[0];
  };

  const getCleanDescription = (scheme) => {
    const desc = String(scheme?.description || '').trim();
    if (desc.includes('|')) return 'Support the monthly yatra through this sponsorship option.';
    return desc || 'Support the monthly yatra through this sponsorship option.';
  };

  const selectedScheme = useMemo(
    () => schemes.find((scheme) => Number(scheme.id) === Number(selectedSchemeId)) || null,
    [schemes, selectedSchemeId]
  );

  const futureTrips = useMemo(
    () => yatraDates.filter((yatra) => isFutureYatraTrip(yatra)),
    [yatraDates]
  );

  const availableTrips = useMemo(
    () => futureTrips,
    [futureTrips]
  );

  useEffect(() => {
    if (!selectedSchemeId && schemes.length > 0) {
      setSelectedSchemeId(schemes[0].id);
    }
  }, [schemes, selectedSchemeId]);

  const totalAmount = (selectedScheme ? Number(selectedScheme.amount || 0) : 0) * selectedTripIds.length;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const toggleTrip = (tripId) => {
    setSelectedTripIds((prev) => (
      prev.includes(Number(tripId))
        ? prev.filter((id) => Number(id) !== Number(tripId))
        : [...prev, Number(tripId)]
    ));
  };

  const selectScheme = (scheme) => {
    setSelectedSchemeId(scheme.id);
    sessionStorage.setItem('pending_sponsorship_scheme', JSON.stringify({ schemeId: scheme.id }));
  };

  const handlePayment = async () => {
    if (!selectedScheme) {
      pushToast('Please select a sponsorship scheme.', 'error');
      return;
    }

    if (selectedTripIds.length === 0) {
      pushToast('Please choose at least one trip.', 'error');
      return;
    }

    if (!sponsorForm.name.trim() || !sponsorForm.phone.trim()) {
      pushToast('Please fill sponsor name and phone.', 'error');
      return;
    }

    setProcessing(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      pushToast('Payment gateway failed to load. Please try again.', 'error');
      setProcessing(false);
      return;
    }

    const description = `${selectedScheme.title} for ${selectedTripIds.length} trip${selectedTripIds.length > 1 ? 's' : ''}`;

    const paymentOptions = {
      key: 'rzp_test_SzZbEdw7SjFADc',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Girnar Seva Group',
      description,
      image: '/images/logo.png',
      prefill: {
        name: sponsorForm.name,
        contact: sponsorForm.phone,
        email: sponsorForm.email,
      },
      notes: {
        module: 'sponsorship',
        scheme_id: String(selectedScheme.id),
        trip_ids: selectedTripIds.join(','),
      },
      theme: { color: '#c5a059' },
      modal: {
        ondismiss: () => setProcessing(false),
      },
      handler: async (response) => {
        try {
          await paymentIntentsDB.create({
            module_key: 'sponsorship',
            reference_type: 'sponsorship_scheme',
            reference_id: selectedScheme.id,
            payer_name: sponsorForm.name.trim(),
            phone: sponsorForm.phone.trim(),
            email: sponsorForm.email.trim(),
            city: sponsorForm.city.trim(),
            amount: totalAmount,
            currency: 'INR',
            status: 'paid',
            gateway_payment_id: response.razorpay_payment_id,
            gateway_order_id: response.razorpay_order_id || null,
            items: selectedTripIds.map((tripId) => {
              const trip = yatraDates.find((entry) => Number(entry.id) === Number(tripId));
              return {
                yatra_id: Number(tripId),
                yatra_title: trip?.date_text || 'Unknown trip',
                scheme_id: Number(selectedScheme.id),
                scheme_title: selectedScheme.title,
                amount: Number(selectedScheme.amount || 0),
              };
            }),
            metadata: {
              scheme_title: selectedScheme.title,
              sponsor_notes: sponsorForm.notes.trim(),
              selected_trip_ids: selectedTripIds,
            },
          });

          sessionStorage.removeItem('pending_sponsorship_scheme');
          navigate('/monthly-bus-yatra/success', {
            state: { kind: 'sponsorship', paymentId: response.razorpay_payment_id },
          });
        } catch (error) {
          console.error('Failed to record sponsorship payment:', error);
          pushToast('Payment completed, but the sponsorship record could not be saved.', 'error');
          setProcessing(false);
        }
      },
    };

    const paymentObject = new window.Razorpay(paymentOptions);
    paymentObject.open();
  };

  return (
    <LightPageShell>
      <TopLineLoader active={loading} label="Loading sponsorship options" />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-8">
          <div>
            <Link to="/monthly-bus-yatra" className="group inline-flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-widest hover:text-[#b08d4a] transition-all mb-4">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Monthly Bus Yatra
            </Link>
            <h1 className="text-4xl md:text-6xl font-headline text-gray-900 leading-tight">Sponsor a Trip</h1>
            <p className="mt-4 text-gray-500 max-w-2xl leading-relaxed">
              Choose a labharthi scheme, pick one or more eligible trips, fill in your details, and continue to secure payment.
            </p>
          </div>
          <div className="bg-[#fcf9f2] border border-[#c5a059]/20 px-6 py-4 rounded-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9f7c3d] mb-1">Selected Amount</p>
            <p className="text-2xl font-headline text-gray-900">₹{selectedScheme ? Number(selectedScheme.amount || 0) : 0}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {schemes.length > 0 ? (
                schemes.map((scheme) => {
                  const isSelected = Number(selectedSchemeId) === Number(scheme.id);

                  return (
                    <article
                      key={scheme.id}
                      onClick={() => selectScheme(scheme)}
                      className={`cursor-pointer border transition-all duration-300 p-6 shadow-sm hover:shadow-xl ${isSelected ? 'border-[#c5a059] bg-[#fcf9f2]' : 'border-gray-100 bg-white'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-headline text-gray-900">{getLocalizedSchemeLabel(scheme)}</h2>
                          <p className="mt-2 text-sm text-gray-500 leading-relaxed">{getCleanDescription(scheme)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">{t(pageCopy.sponsorshipPerBus)}</p>
                          <p className="mt-1 text-2xl font-headline text-[#c5a059]">₹{Number(scheme.amount || 0)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`mt-5 w-full py-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${isSelected ? 'bg-[#c5a059] text-white' : 'bg-gray-50 text-gray-700 hover:bg-[#fcf9f2]'}`}
                      >
                        {isSelected ? 'Selected' : 'Choose This Scheme'}
                      </button>
                    </article>
                  );
                })
              ) : (
                <div className="md:col-span-2 p-8 border border-dashed border-gray-200 text-gray-500 text-sm bg-white">
                  No sponsorship schemes are live yet. Please check back soon.
                </div>
              )}
            </div>
            
            {/* Offline Sponsorship Box */}
            <div className="bg-white border border-[#c5a059]/30 shadow-md p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h3 className="text-xl md:text-2xl font-headline text-gray-900 mb-4 flex items-center gap-3 relative z-10">
                <svg className="w-6 h-6 text-[#c5a059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Offline Payment Support
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed relative z-10">
                If you prefer to make your sponsorship contribution via direct bank transfer, cash, or offline methods, please contact our team members below:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <a href="tel:9979858710" className="flex items-center gap-4 bg-[#fcf9f2] border border-[#c5a059]/20 p-4 hover:bg-[#c5a059] hover:text-white transition-all group rounded-sm shadow-sm">
                  <div className="w-10 h-10 bg-white group-hover:bg-white/20 flex items-center justify-center rounded-full shadow-sm text-[#c5a059] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white/80 font-bold mb-1">Milan Bhai</p>
                    <p className="text-lg font-headline text-gray-900 group-hover:text-white transition-colors">99798 58710</p>
                  </div>
                </a>
                <a href="tel:7990522291" className="flex items-center gap-4 bg-[#fcf9f2] border border-[#c5a059]/20 p-4 hover:bg-[#c5a059] hover:text-white transition-all group rounded-sm shadow-sm">
                  <div className="w-10 h-10 bg-white group-hover:bg-white/20 flex items-center justify-center rounded-full shadow-sm text-[#c5a059] group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white/80 font-bold mb-1">Jigar Bhai</p>
                    <p className="text-lg font-headline text-gray-900 group-hover:text-white transition-colors">79905 22291</p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="bg-white border border-gray-100 shadow-lg p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h2 className="text-2xl font-headline text-gray-900">Sponsor Details</h2>
                  <p className="text-sm text-gray-500 mt-2">Fill in the information for the selected sponsorship.</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full">
                  {selectedTripIds.length} Trip{selectedTripIds.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Name</span>
                  <input
                    type="text"
                    value={sponsorForm.name}
                    onChange={(event) => setSponsorForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                    placeholder="Sponsor / family name"
                  />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Phone</span>
                    <input
                      type="tel"
                      value={sponsorForm.phone}
                      onChange={(event) => setSponsorForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                      placeholder="Mobile number"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email</span>
                    <input
                      type="email"
                      value={sponsorForm.email}
                      onChange={(event) => setSponsorForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                      placeholder="name@example.com"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</span>
                    <input
                      type="text"
                      value={sponsorForm.city}
                      onChange={(event) => setSponsorForm((prev) => ({ ...prev, city: event.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                      placeholder="Optional"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Notes</span>
                    <input
                      type="text"
                      value={sponsorForm.notes}
                      onChange={(event) => setSponsorForm((prev) => ({ ...prev, notes: event.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                      placeholder="Message for the team"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-100 shadow-lg p-6 md:p-8">
              <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-gray-400 mb-4">Choose Bus Dates</h3>
              <div className="space-y-3">
                {availableTrips.length > 0 ? availableTrips.map((trip) => (
                  <label key={trip.id} className="flex items-center justify-between gap-4 text-sm border border-gray-100 rounded-sm px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-900">{trip.date_text}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{trip.description || 'Monthly trip'}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTripIds.includes(Number(trip.id))}
                      onChange={() => toggleTrip(trip.id)}
                    />
                  </label>
                )) : (
                  <p className="text-sm text-gray-500">Select a scheme to view its trips.</p>
                )}
              </div>
            </section>

            <section className="bg-[#fcf9f2] border border-[#c5a059]/20 shadow-lg p-6 md:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-[#9f7c3d]">Payable Amount</h3>
                  <p className="mt-2 text-3xl font-headline text-gray-900">₹{totalAmount}</p>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
                  {selectedScheme ? getLocalizedSchemeLabel(selectedScheme) : 'No scheme selected'}
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                The amount is calculated per selected trip. You can choose multiple trips before paying.
              </p>
              <button
                type="button"
                onClick={handlePayment}
                disabled={processing || !selectedScheme || selectedTripIds.length === 0}
                className="mt-6 w-full py-5 bg-[#c5a059] text-white font-bold uppercase tracking-[0.25em] text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Continue to Payment ₹${totalAmount}`}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </LightPageShell>
  );
};

export default MonthlyBusSponsorshipPage;
