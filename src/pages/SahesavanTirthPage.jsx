import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

const SahesavanTirthPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.sahesavanTirthPage;
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 40%',
              end: 'bottom 60%',
              scrub: true,
            },
          }
        );
      }

      const steps = gsap.utils.toArray('.pilgrimage-step');
      steps.forEach((step) => {
        const img = step.querySelector('.step-image');
        const content = step.querySelector('.step-content');
        const dot = step.querySelector('.step-dot');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        )
          .fromTo(
            img,
            { x: step.classList.contains('flex-row-reverse') ? 80 : -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            '-=0.2'
          )
          .fromTo(
            content,
            { x: step.classList.contains('flex-row-reverse') ? -40 : 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
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

        <div ref={containerRef} className="space-y-24 relative pt-4">
          {/* Connecting Line Background */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c5a059]/15 hidden lg:block -translate-x-1/2"></div>
          {/* Animated Connecting Line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c5a059] hidden lg:block -translate-x-1/2 origin-top"
          ></div>

          {pageCopy.spotsList?.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={step.id}
                className={`pilgrimage-step flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Step Indicator Dot */}
                <div className="step-dot absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#c5a059] border-4 border-white hidden lg:block z-10 shadow-sm"></div>

                {/* Image Panel */}
                <div className="w-full lg:w-1/2">
                  <SecureImage
                    src={step.image}
                    alt={t(step.title)}
                    containerClassName={`step-image light-panel p-3 bg-white border border-[#ddd2b7] shadow-md min-h-[280px] md:min-h-[360px] ${
                      isEven ? 'light-panel-left' : 'light-panel-right'
                    }`}
                    className="w-full h-[280px] md:h-[360px] object-cover rounded-sm"
                  />
                </div>

                {/* Text Panel */}
                <div className={`step-content w-full lg:w-1/2 text-center lg:text-left ${
                  isEven ? 'lg:pl-8' : 'lg:pr-8 lg:text-right'
                }`}>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#8f6d2f] font-headline text-[10px] tracking-widest uppercase font-bold mb-3 border border-[#c5a059]/30">
                    {t({ en: 'Coming Soon', gu: 'ટૂંક સમયમાં', hi: 'जल्द आ रहा है' })}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-headline text-gray-900 mb-4">
                    {t(step.title)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
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

export default SahesavanTirthPage;
