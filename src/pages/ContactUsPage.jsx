import { useState } from 'react';
import { LightPageShell } from '../components/LightPageShell.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { contactMessagesDB } from '../lib/database.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const ContactUsPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.contactPage;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const nextErrors = {};
    const validationCopy = pageCopy.form.validation;

    if (!formData.fullName.trim()) {
      nextErrors.fullName = t(validationCopy.fullNameRequired);
    } else if (formData.fullName.trim().length < 3) {
      nextErrors.fullName = t(validationCopy.fullNameShort);
    }

    const compactPhone = formData.phone.trim().replace(/[- ]/g, '');
    if (!compactPhone) {
      nextErrors.phone = t(validationCopy.phoneRequired);
    } else if (!phoneRegex.test(compactPhone)) {
      nextErrors.phone = t(validationCopy.phoneInvalid);
    }

    if (!formData.email.trim()) {
      nextErrors.email = t(validationCopy.emailRequired);
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = t(validationCopy.emailInvalid);
    }

    if (!formData.message.trim()) {
      nextErrors.message = t(validationCopy.messageRequired);
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = t(validationCopy.messageShort);
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: null }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Save to database
      try {
        await contactMessagesDB.create({
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          message: formData.message
        });
      } catch (dbError) {
        console.log('Database not configured yet. Contact message:', formData);
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitStatus('success');
      setFormData({ fullName: '', phone: '', email: '', message: '' });
    } catch (_error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      window.setTimeout(() => setSubmitStatus(null), 4500);
    }
  };

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-12 items-stretch min-h-[600px]">
          {/* Left Box: Information */}
          <article className="light-panel light-panel-left p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <span className="text-[#c5a059] font-headline text-[10px] md:text-xs tracking-[0.45em] uppercase opacity-80 font-bold block mb-4">
                {t(pageCopy.heroBadge)}
              </span>
              <h1 className="text-4xl md:text-6xl font-headline text-gray-900 leading-tight mb-8">
                {t(pageCopy.heroTitle)}
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed mb-12">
                {t(pageCopy.heroDescription)}
              </p>

              <div className="space-y-10">
                {/* Location */}
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fdfaf3] border border-[#c5a059]/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#f7f0df]">
                    <span className="text-[#c5a059]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[#8f6d2f] text-[10px] uppercase tracking-[0.25em] font-bold mb-1">{t(pageCopy.info.locationLabel)}</h3>
                    <p className="text-gray-900 font-medium md:text-lg">{t(pageCopy.info.locationValue)}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fdfaf3] border border-[#c5a059]/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#f7f0df]">
                    <span className="text-[#c5a059]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[#8f6d2f] text-[10px] uppercase tracking-[0.25em] font-bold mb-1">{t(pageCopy.info.emailLabel)}</h3>
                    <a href={`mailto:${t(pageCopy.info.emailValue)}`} className="text-gray-900 font-medium md:text-lg hover:text-[#c5a059] transition-colors break-all">
                      {t(pageCopy.info.emailValue)}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fdfaf3] border border-[#c5a059]/20 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#f7f0df]">
                    <span className="text-[#c5a059]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[#8f6d2f] text-[10px] uppercase tracking-[0.25em] font-bold mb-1">{t(pageCopy.info.phoneLabel)}</h3>
                    <div className="flex flex-col gap-1">
                      {t(pageCopy.info.phoneValue).split('/').map((num, idx) => (
                        <a 
                          key={idx} 
                          href={`tel:${num.replace(/[^0-9]/g, '')}`} 
                          className="text-gray-900 font-medium md:text-lg hover:text-[#c5a059] transition-colors block"
                        >
                          {num.trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Right Box: Form */}
          <article className="light-panel p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
              {submitStatus === 'success' && (
                <div className="bg-green-50 text-green-700 p-4 rounded-sm text-xs md:text-sm font-bold uppercase tracking-[0.12em] border border-green-200 animate-fade-in">
                  {t(pageCopy.form.success)}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 text-red-700 p-4 rounded-sm text-xs md:text-sm font-bold uppercase tracking-[0.12em] border border-red-200 animate-fade-in">
                  {t(pageCopy.form.error)}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.22em] mb-3 font-bold">{t(pageCopy.form.fullName)}</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full bg-[#fbfbfc] border ${errors.fullName ? 'border-red-400' : 'border-gray-100'} rounded-sm px-5 py-4 text-gray-900 focus:border-[#c5a059] focus:bg-white outline-none transition-all text-base shadow-sm`}
                  />
                  {errors.fullName ? <span className="text-red-500 text-[10px] mt-2 block font-bold uppercase tracking-[0.1em]">{errors.fullName}</span> : null}
                </div>

                <div>
                  <label className="block text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.22em] mb-3 font-bold">{t(pageCopy.form.phone)}</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-[#fbfbfc] border ${errors.phone ? 'border-red-400' : 'border-gray-100'} rounded-sm px-5 py-4 text-gray-900 focus:border-[#c5a059] focus:bg-white outline-none transition-all text-base shadow-sm`}
                  />
                  {errors.phone ? <span className="text-red-500 text-[10px] mt-2 block font-bold uppercase tracking-[0.1em]">{errors.phone}</span> : null}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.22em] mb-3 font-bold">{t(pageCopy.form.email)}</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full bg-[#fbfbfc] border ${errors.email ? 'border-red-400' : 'border-gray-100'} rounded-sm px-5 py-4 text-gray-900 focus:border-[#c5a059] focus:bg-white outline-none transition-all text-base shadow-sm`}
                />
                {errors.email ? <span className="text-red-500 text-[10px] mt-2 block font-bold uppercase tracking-[0.1em]">{errors.email}</span> : null}
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.22em] mb-3 font-bold">{t(pageCopy.form.message)}</label>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full bg-[#fbfbfc] border ${errors.message ? 'border-red-400' : 'border-gray-100'} rounded-sm px-5 py-4 text-gray-900 focus:border-[#c5a059] focus:bg-white outline-none transition-all text-base h-40 resize-none shadow-sm`}
                />
                {errors.message ? <span className="text-red-500 text-[10px] mt-2 block font-bold uppercase tracking-[0.1em]">{errors.message}</span> : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 md:py-6 text-white font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs transition-all duration-500 shadow-xl shadow-[#c5a059]/10 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c5a059] hover:bg-[#b08d4a] hover:scale-[1.01] active:scale-100 uppercase'
                }`}
              >
                {isSubmitting ? t(pageCopy.form.sending) : t(pageCopy.form.submit)}
              </button>
            </form>
          </article>
        </div>
      </section>
    </LightPageShell>
  );
};

export default ContactUsPage;
