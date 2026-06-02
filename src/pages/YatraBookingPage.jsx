import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import TopLineLoader from '../components/TopLineLoader.jsx';
import ToastViewport from '../components/ToastViewport.jsx';
import { FormSelect } from '../components/FormSelect.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, yatraDatesDB, yatrikRegistrationsDB } from '../lib/database.js';
import { formatDateForDisplay, isFutureYatraTrip } from '../utils/dateUtils.js';

const YatraBookingPage = () => {
  const { yatraId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [yatra, setYatra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yatricks, setYatricks] = useState([]);
  const [capacityNotice, setCapacityNotice] = useState(null);
  const cacheKey = 'monthly_bus_yatra_dates';

  const [currentYatrik, setCurrentYatrik] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthdate: '',
    gender: '',
    remarks: '',
  });
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => {}
  });

  const pushToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  useEffect(() => {
    const loadYatra = async () => {
      try {
        setCapacityNotice(null);
        // Try cache first for instant load
        const cached = dbCache.read(cacheKey);
        if (cached) {
          const found = cached.find(d => String(d.id) === String(yatraId));
          if (found) {
            const cachedMaxCapacity = Number(found.max_capacity || 0);
            const cachedBookedCount = Number(found.registered_count || 0);
            const cachedIsFull = cachedMaxCapacity > 0 && cachedBookedCount >= cachedMaxCapacity;
            if (cachedIsFull) {
              setCapacityNotice({
                yatraName: found.trip_date ? formatDateForDisplay(found.trip_date) : (typeof found.date === 'object' ? found.date.en : found.date),
                contactNumbers: t(siteCopy.contactPage.info.phoneValue),
              });
            }
            setYatra({
              ...found,
              date_text: found.trip_date ? formatDateForDisplay(found.trip_date) : (typeof found.date === 'object' ? found.date.en : found.date),
              description: typeof found.description === 'object' ? found.description.en : found.description,
              registeredCount: cachedBookedCount,
              max_capacity: found.max_capacity ?? null,
            });
            setLoading(false);
          }
        }

        // Fetch fresh data from DB
        const found = await yatraDatesDB.getById(yatraId);
        if (!found || !found.registration_open || !isFutureYatraTrip(found)) {
          if (!yatra) navigate('/monthly-bus-yatra');
          return;
        }

        const registrations = await yatrikRegistrationsDB.getByYatraId(yatraId);
        const maxCapacity = Number(found.max_capacity || 0);
        const bookedCount = registrations.length;
        const isFull = maxCapacity > 0 && bookedCount >= maxCapacity;

        if (isFull) {
          setCapacityNotice({
            yatraName: found.trip_date ? formatDateForDisplay(found.trip_date) : found.date_text || '',
            contactNumbers: t(siteCopy.contactPage.info.phoneValue),
          });
        }
        
        setYatra({
          ...found,
          date_text: found.trip_date ? formatDateForDisplay(found.trip_date) : found.date_text || '',
          registeredCount: bookedCount,
          max_capacity: found.max_capacity ?? null,
        });
      } catch (err) {
        console.error('Error loading yatra:', err);
        if (!yatra) {
          pushToast('Failed to load yatra details', 'error');
          navigate('/monthly-bus-yatra');
        }
      } finally {
        setLoading(false);
      }
    };
    loadYatra();
  }, [yatraId, navigate, t]);

  const handleInputChange = (field, value) => {
    setCurrentYatrik(prev => ({ ...prev, [field]: value }));
  };

  const validateYatrik = (yatrik) => {
    return yatrik.firstName && yatrik.lastName && yatrik.phone && yatrik.email && yatrik.birthdate && yatrik.gender;
  };

  const addYatrik = () => {
    if (!validateYatrik(currentYatrik)) {
      pushToast('Please fill all required fields', 'error');
      return;
    }

    const maxCapacity = Number(yatra?.max_capacity || 0);
    const alreadyBooked = Number(yatra?.registeredCount || 0);
    const seatsRemaining = maxCapacity > 0 ? Math.max(maxCapacity - alreadyBooked - yatricks.length, 0) : null;
    if (maxCapacity > 0 && seatsRemaining !== null && seatsRemaining <= 0) {
      pushToast('Sorry, max capacity reached for this yatra', 'error');
      return;
    }

    setYatricks(prev => [...prev, currentYatrik]);
    setCurrentYatrik({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birthdate: '',
      gender: '',
      remarks: '',
    });
    pushToast('Yatrik added successfully', 'success');
  };

  const removeYatrik = (index) => {
    setYatricks(prev => prev.filter((_, i) => i !== index));
  };

  const totalYatrikCount = yatricks.length + (validateYatrik(currentYatrik) ? 1 : 0);
  const pricePerPerson = yatra?.price_per_person || 900;
  const totalAmount = totalYatrikCount * pricePerPerson;
  const maxCapacity = Number(yatra?.max_capacity || 0);
  const registeredCount = Number(yatra?.registeredCount || 0);
  const seatsRemaining = maxCapacity > 0 ? Math.max(maxCapacity - registeredCount, 0) : null;

  const handleProceedToPayment = () => {
    if (capacityNotice) {
      pushToast('Sorry, max capacity reached for this yatra', 'error');
      return;
    }

    let finalToSubmit = [...yatricks];
    
    const hasAnyData = Object.values(currentYatrik).some(v => String(v || '').trim() !== '');
    
    if (hasAnyData) {
      if (validateYatrik(currentYatrik)) {
        finalToSubmit.push(currentYatrik);
      } else {
        pushToast('Please complete the current yatrik details or clear the form', 'error');
        return;
      }
    }

    if (finalToSubmit.length === 0) {
      pushToast('Please add at least one yatrik to proceed', 'error');
      return;
    }

    if (maxCapacity > 0 && finalToSubmit.length > seatsRemaining) {
      pushToast('Sorry, max capacity reached for this yatra', 'error');
      return;
    }
    
    sessionStorage.setItem('pending_booking', JSON.stringify({
      yatraId,
      yatricks: finalToSubmit,
      totalAmount: finalToSubmit.length * pricePerPerson,
    }));
    
    navigate('/monthly-bus-yatra/payment');
  };

  if (loading) {
    return (
      <LightPageShell>
        <TopLineLoader active label="Loading journey details..." />
        <div className="max-w-7xl mx-auto py-12 px-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-100 mb-6"></div>
          <div className="flex flex-col md:flex-row justify-between mb-12 border-b border-gray-100 pb-8">
            <div className="space-y-4">
              <div className="h-12 w-64 bg-gray-100"></div>
              <div className="h-6 w-48 bg-gray-100"></div>
            </div>
            <div className="h-20 w-40 bg-gray-50 hidden md:block"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="h-[600px] bg-white border border-gray-100"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-50"></div>
              <div className="h-80 bg-white border border-gray-100"></div>
            </div>
          </div>
        </div>
      </LightPageShell>
    );
  }

  if (capacityNotice) {
    const contactNumbers = String(capacityNotice.contactNumbers || '').split('/').map(num => num.trim()).filter(Boolean);

    return (
      <LightPageShell>
        <div className="max-w-3xl mx-auto py-20 px-6 text-center">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-100">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-8.25 14.28A2 2 0 003.78 21h16.44a2 2 0 001.73-2.86L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline text-gray-900 mb-6">Max Capacity Reached</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Sorry, max capacity reached for <span className="font-bold text-[#c5a059]">{capacityNotice.yatraName}</span>. Please contact the numbers below.
          </p>
          <div className="space-y-3 mb-10">
            {contactNumbers.map((number) => (
              <a
                key={number}
                href={`tel:${number.replace(/[^0-9]/g, '')}`}
                className="block text-[#8f6d2f] font-bold text-lg hover:text-[#b08d4a] transition-colors"
              >
                {number}
              </a>
            ))}
          </div>
          <Link to="/monthly-bus-yatra" className="inline-flex px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#b08d4a] transition-all">
            Back to Yatra List
          </Link>
        </div>
      </LightPageShell>
    );
  }

  return (
    <LightPageShell>
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, open: false }))}
      />

      <div className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <Link to="/monthly-bus-yatra" className="group flex items-center gap-2 text-[#c5a059] text-xs font-bold uppercase tracking-widest hover:text-[#b08d4a] transition-all mb-6">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Yatra List
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-headline text-gray-900 leading-tight">Book Your Journey</h1>
              <p className="text-gray-500 mt-4 font-light italic text-lg">
                Yatra Date: <span className="font-bold text-[#c5a059] not-italic">{yatra?.date_text}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-[#fcf9f2] border border-[#c5a059]/20 px-6 py-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9f7c3d] mb-1">Fare Per Person</p>
                <p className="text-2xl font-headline text-gray-900">₹{pricePerPerson}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-stretch">
          
          {/* Mobile-only Image Container (shows above form) */}
          <div className="lg:hidden light-panel-soft p-6 bg-gray-50 border border-gray-200 overflow-hidden flex flex-col">
            <SecureImage 
              src={yatra?.image} 
              alt={yatra?.date_text}
              containerClassName="w-full h-48 rounded-sm mb-6 shrink-0"
              className="w-full h-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-headline text-gray-900">{yatra?.date_text}</h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed italic">{yatra?.description}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200/50">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Yatra For Mothly Bus yatra</p>
            </div>
          </div>
          <section className="light-panel p-8 md:p-12 bg-white border border-[#ddd2b7] relative overflow-hidden shadow-sm flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <h2 className="text-2xl font-headline text-[#8f6d2f] mb-10 flex items-center gap-4 relative z-10">
              <span className="w-10 h-10 bg-[#c5a059] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-[#c5a059]/20">
                {yatricks.length + 1}
              </span>
              Yatrik Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10 flex-1">
              <FormInput
                label="First Name"
                required
                value={currentYatrik.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="e.g. Rahul"
              />
              <FormInput
                label="Last Name"
                required
                value={currentYatrik.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="e.g. Shah"
              />
              <FormInput
                label="Phone Number"
                required
                type="tel"
                value={currentYatrik.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="10 digit mobile number"
              />
              <FormInput
                label="Email ID"
                required
                type="email"
                value={currentYatrik.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="For ticket confirmation"
              />
              <FormInput
                label="Birthdate"
                required
                type="date"
                value={currentYatrik.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
              />
              <FormSelect
                label="Gender"
                required
                value={currentYatrik.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                placeholder="Select Gender"
              />
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">Remarks</label>
                <textarea
                  value={currentYatrik.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 p-5 text-sm outline-none focus:border-[#c5a059] transition-all h-28 resize-none rounded-sm"
                  placeholder="Any special requirements, medical conditions, or food preferences?"
                />
              </div>
            </div>

            <div className="mt-12 flex justify-end relative z-10">
              <button
                onClick={addYatrik}
                className="group flex items-center gap-3 px-8 py-4 bg-[#fcf9f2] border border-[#c5a059] text-[#c5a059] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#c5a059] hover:text-white transition-all duration-300"
              >
                <span className="text-lg">+</span> Add Another Yatrik
              </button>
            </div>
          </section>

          <aside className="space-y-6 flex flex-col h-full">
            <div className="hidden lg:flex light-panel-soft p-6 bg-gray-50 border border-gray-200 overflow-hidden flex-col">
              <SecureImage 
                src={yatra?.image} 
                alt={yatra?.date_text}
                containerClassName="w-full h-48 rounded-sm mb-6 shrink-0"
                className="w-full h-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-headline text-gray-900">{yatra?.date_text}</h3>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed italic">{yatra?.description}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200/50">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Yatra For Mothly Bus yatra</p>
              </div>
            </div>

            <div className="light-panel p-8 bg-white border border-[#c5a059]/30 shadow-xl mt-auto">
              <h2 className="text-2xl font-headline text-gray-900 mb-8 pb-4 border-b border-gray-100">Booking Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Yatricks</span>
                  <span className="font-bold text-gray-900">x {totalYatrikCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per person</span>
                  <span className="font-bold text-gray-900">₹{pricePerPerson}</span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-dashed border-gray-100 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Total Amount</span>
                  <span className="text-3xl font-headline text-[#c5a059]">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={yatricks.length === 0 && !validateYatrik(currentYatrik)}
                className="w-full py-5 bg-[#c5a059] text-white font-bold uppercase tracking-[0.25em] text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Pay Total ₹{totalAmount}
              </button>
              
              <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                Secure checkout powered by Girnar Seva Group
              </p>
            </div>
          </aside>
        </div>

        {yatricks.length > 0 && (
          <section className="mt-16 space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Registered Yatricks</h3>
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full">{yatricks.length} Added</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yatricks.map((y, idx) => (
                <div key={idx} className="light-panel-soft p-6 flex justify-between items-center bg-white border border-gray-100 shadow-sm hover:border-[#c5a059]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-[#c5a059]/10 group-hover:text-[#c5a059] rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{y.firstName} {y.lastName}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium">{y.gender} · {y.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => removeYatrik(idx)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </LightPageShell>
  );
};

export default YatraBookingPage;
