import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

const FourteenJinalayaPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.fourteenJinalayaPage;
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each step as it comes into view
      const steps = gsap.utils.toArray('.pilgrimage-step');
      steps.forEach((step) => {
        const img = step.querySelector('.step-image');
        const content = step.querySelector('.step-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 90%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          img,
          { scale: 0.96, y: 40, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        ).fromTo(
          content,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-16 md:space-y-24 py-6">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-90 font-bold">
            {t(pageCopy.heroBadge)}
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">
            {t(pageCopy.heroTitle)}
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
            {t(pageCopy.heroDescription)}
          </p>
        </header>

        <div ref={containerRef} className="space-y-16 md:space-y-24 relative pt-4">
          {pageCopy.jinalayasList?.map((step) => {
            return (
              <div
                key={step.id}
                className="pilgrimage-step flex flex-col items-center gap-6 max-w-7xl mx-auto light-panel p-6 md:p-8"
              >
                {/* Image Panel (Showing First) */}
                <div className="w-full">
                  <SecureImage
                    src={step.image}
                    alt={t(step.title)}
                    containerClassName="step-image w-full overflow-hidden rounded-sm min-h-[280px] md:min-h-[480px] border border-[#ddd2b7]/60 shadow-md"
                    className="w-full h-[280px] md:h-[480px] object-cover rounded-sm"
                  />
                </div>

                {/* Text Panel (Showing After Picture) */}
                <div className="step-content w-full text-left px-2 md:px-4">
                  <h3 className="text-2xl md:text-3xl font-headline text-gray-900 mb-4 border-b border-[#ddd2b7]/60 pb-3">
                    {t(step.title)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify md:text-left text-sm md:text-base">
                    {t(step.description)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </LightPageShell>
  );
};

export default FourteenJinalayaPage;

