import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';

gsap.registerPlugin(ScrollTrigger);

const AboutGirnarPage = () => {
  const { t } = useLanguage();
  const aboutCopy = siteCopy.aboutPage;
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the connecting line filling up
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

      // Animate each step as it comes into view
      const steps = gsap.utils.toArray('.pilgrimage-step');
      steps.forEach((step) => {
        const img = step.querySelector('.step-image');
        const content = step.querySelector('.step-content');
        const dot = step.querySelector('.step-dot');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
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
          { x: step.classList.contains('flex-row-reverse') ? 100 : -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.2'
        )
        .fromTo(
          content,
          { x: step.classList.contains('flex-row-reverse') ? -50 : 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-16 md:space-y-24">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
            {t(aboutCopy.heroBadge)}
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">
            {t(aboutCopy.heroTitle)}
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
            {t(aboutCopy.heroDescription)}
          </p>
        </header>

        <div ref={containerRef} className="space-y-24 relative">
          {/* Connecting Line Background */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c5a059]/10 hidden lg:block -translate-x-1/2"></div>
          {/* Animated Connecting Line */}
          <div 
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-[#c5a059] hidden lg:block -translate-x-1/2 origin-top"
          ></div>

          {aboutCopy.pilgrimageSteps.map((step, index) => {
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
                    containerClassName={`step-image light-panel p-3 bg-white border border-[#ddd2b7] shadow-md min-h-[300px] md:min-h-[400px] ${
                      isEven ? 'light-panel-left' : 'light-panel-right'
                    }`}
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-sm"
                  />
                </div>

                {/* Text Panel */}
                <div className={`step-content w-full lg:w-1/2 text-center lg:text-left ${
                  isEven ? 'lg:pl-8' : 'lg:pr-8 lg:text-right'
                }`}>
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

        <section className="space-y-4 pt-16">
          <h3 className="text-2xl md:text-4xl font-headline text-gray-900">{t(aboutCopy.supportHeading)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {aboutCopy.supportCards.map((card, index) => (
              <article key={index} className="light-panel-soft p-6">
                <h4 className="text-lg md:text-xl font-headline text-[#8f6d2f]">{t(card.title)}</h4>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{t(card.body)}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </LightPageShell>
  );
};

export default AboutGirnarPage;
