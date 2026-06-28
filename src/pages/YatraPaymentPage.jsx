import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import TopLineLoader from '../components/TopLineLoader.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { yatraDatesDB, yatrikRegistrationsDB, demoYatrikRegistrationsDB } from '../lib/database.js';
import { sendTicketEmail } from '../utils/emailUtils.js';

const YatraPaymentPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('pending_booking');
    if (!data) {
      navigate('/monthly-bus-yatra');
      return;
    }
    setBookingInfo(JSON.parse(data));
  }, [navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const baseAmount = bookingInfo ? bookingInfo.totalAmount : 0;
  const gstAmount = Math.round(baseAmount * 0.03);
  const finalAmount = baseAmount + gstAmount;

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);

    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    // Save to Demo Table for backup
    try {
      const demoRegistrations = bookingInfo.yatricks.map(y => ({
        first_name: y.firstName,
        last_name: y.lastName,
        phone: y.phone,
        email: y.email,
        birthdate: y.birthdate,
        gender: y.gender,
        remarks: y.remarks || '',
        yatra_id: parseInt(bookingInfo.yatraId),
        registration_source: 'pending_payment',
      }));
      await demoYatrikRegistrationsDB.createMultiple(demoRegistrations);
    } catch (demoErr) {
      console.warn('Failed to save to demo backup table:', demoErr);
      // We don't block the actual payment if demo table fails
    }

    // Create order from backend
    let orderData;
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount * 100,
          currency: 'INR',
          receipt: `yatra_${Date.now()}`
        })
      });
      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize payment order');
      }
      orderData = await orderRes.json();
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('Unable to initiate payment: ' + err.message);
      setIsProcessing(false);
      return;
    }

    // Razorpay Options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      order_id: orderData.order_id,
      name: 'Girnar Seva Group',
      description: `Booking for ${bookingInfo.yatricks.length} Yatrick(s)`,
      image: window.location.origin + '/images/logo2.png', // Your official brand logo
      handler: async function (response) {
        // This function executes after a successful payment
        console.log('Payment Successful:', response.razorpay_payment_id);
        
        try {
          setIsProcessing(true);

          // Verify Payment Signature on Backend
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok || !verifyData.success) {
            alert('Payment signature verification failed. Registration not saved.');
            setIsProcessing(false);
            return;
          }

          const [latestYatra, latestRegistrations] = await Promise.all([
            yatraDatesDB.getById(bookingInfo.yatraId),
            yatrikRegistrationsDB.getByYatraId(bookingInfo.yatraId),
          ]);
          const latestMaxCapacity = latestYatra?.max_capacity == null || latestYatra?.max_capacity === '' ? null : Number(latestYatra.max_capacity);
          if (Number.isFinite(latestMaxCapacity) && latestMaxCapacity > 0 && latestRegistrations.length + bookingInfo.yatricks.length > latestMaxCapacity) {
            alert(`Sorry, max capacity reached. Please contact ${siteCopy.contactPage.info.phoneValue} for help.`);
            setIsProcessing(false);
            return;
          }
          
          // Prepare registrations for database
          const registrations = bookingInfo.yatricks.map(y => ({
            first_name: y.firstName,
            last_name: y.lastName,
            phone: y.phone,
            email: y.email,
            birthdate: y.birthdate,
            gender: y.gender,
            remarks: y.remarks ? `${y.remarks} (Payment ID: ${response.razorpay_payment_id})` : `Payment ID: ${response.razorpay_payment_id}`,
            yatra_id: parseInt(bookingInfo.yatraId),
            registration_source: 'online',
          }));

          // Save to database
          await yatrikRegistrationsDB.createMultiple(registrations);
          
          // Send Ticket Email and wait for it to complete
          try {
            // Prevent huge base64 strings from crashing EmailJS
            const safeImage = (latestYatra?.image && latestYatra.image.length < 2000) ? latestYatra.image : '';
            await sendTicketEmail(bookingInfo, response.razorpay_payment_id, latestYatra?.date_text, safeImage, bookingInfo.yatricks);
          } catch (emailErr) {
            console.error('Email failed, but booking succeeded:', emailErr);
          }

          // Finalize booking
          sessionStorage.removeItem('pending_booking');
          navigate('/monthly-bus-yatra/success', { 
            state: { paymentId: response.razorpay_payment_id } 
          });
        } catch (error) {
          console.error('Error saving registrations:', error);
          alert('Payment was successful, but there was an error saving your registration. Please contact support with your Payment ID: ' + response.razorpay_payment_id);
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${bookingInfo.yatricks[0].firstName} ${bookingInfo.yatricks[0].lastName}`,
        contact: bookingInfo.yatricks[0].phone,
      },
      notes: {
        yatra_id: bookingInfo.yatraId,
        total_yatricks: bookingInfo.yatricks.length
      },
      theme: {
        color: '#c5a059',
        backdrop_color: 'rgba(10, 10, 10, 0.85)'
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      alert('Payment Failed: ' + (response.error?.description || 'Unknown error'));
      setIsProcessing(false);
    });
    paymentObject.open();
  };

  if (!bookingInfo) return <LightPageShell><TopLineLoader active label="Initializing payment..." /></LightPageShell>;

  return (
    <LightPageShell>
      <div className="max-w-7xl mx-auto py-16 md:py-24 px-6">
        <div className="light-panel p-8 md:p-16 bg-white border border-[#c5a059]/30 shadow-2xl relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c5a059]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <header className="text-center mb-16">
              <Link to={`/monthly-bus-yatra/booking/${bookingInfo.yatraId}`} className="inline-flex items-center gap-2 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest hover:text-[#b08d4a] transition-all mb-8">
                <span>←</span> Edit Booking Details
              </Link>
              <div className="w-20 h-20 bg-[#c5a059]/10 text-[#c5a059] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-headline text-gray-900 leading-tight">Secure Payment</h1>
              <p className="text-gray-500 mt-4 uppercase tracking-[0.4em] text-[10px] font-bold">Complete your booking for Girnar Yatra</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
              {/* Payment Details */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#9f7c3d] mb-4">Payment Method</h3>
                  <div className="p-5 border-2 border-[#c5a059] rounded-sm flex items-center gap-4 bg-[#fcf9f2]">
                    <div className="w-10 h-10 bg-[#c5a059] text-white rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">UPI / QR Payment</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Instant & Secure</p>
                    </div>
                  </div>
                </section>

                <section className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Yatricks ({bookingInfo.yatricks.length})</span>
                      <span className="font-bold text-gray-900">₹{baseAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GST (3%)</span>
                      <span className="font-bold text-gray-900">₹{gstAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Convenience Fee</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                      <span className="text-gray-900 font-bold">Payable Amount</span>
                      <span className="text-2xl font-headline text-[#c5a059]">₹{finalAmount}</span>
                    </div>
                  </div>
                </section>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full py-5 bg-[#c5a059] text-white font-bold uppercase tracking-[0.25em] text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    `Confirm & Pay ₹${finalAmount}`
                  )}
                </button>
              </div>

              {/* Yatrik Recap */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Yatrik Details</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {bookingInfo.yatricks.map((y, idx) => (
                    <div key={idx} className="p-4 border border-gray-100 rounded-sm bg-white shadow-sm flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{y.firstName} {y.lastName}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{y.gender} · {y.phone}</p>
                      </div>
                      <Link to={`/monthly-bus-yatra/booking/${bookingInfo.yatraId}`} className="text-gray-300 hover:text-[#c5a059] transition-colors p-2" title="Edit Yatrik">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-[#fcf9f2] border border-[#c5a059]/10 rounded-sm">
                  <p className="text-[10px] text-[#8f6d2f] leading-relaxed uppercase tracking-widest font-bold">
                    Important Note:
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2 leading-relaxed italic">
                    By clicking "Confirm & Pay", you agree to our terms of service. Tickets cannot be canceled and there will be no refund on cancellation. Bus number and seat number will be sent to you via WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Secure 256-bit SSL Encrypted Payment</p>
        </div>
      </div>
    </LightPageShell>
  );
};

export default YatraPaymentPage;
