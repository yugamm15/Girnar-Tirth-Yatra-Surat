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
  const { t } = useLanguage();
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
      key: 'rzp_test_SrZgeH6l9HUchN',
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
            <p className="text-2xl font-headline text-gray-900">₹{totalAmount}</p>
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
                          <h2 className="text-xl font-headline text-gray-900">{scheme.title}</h2>
                          <p className="mt-2 text-sm text-gray-500 leading-relaxed">{scheme.description || 'Support the monthly yatra through this sponsorship option.'}</p>
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
                  {selectedScheme ? selectedScheme.title : 'No scheme selected'}
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
