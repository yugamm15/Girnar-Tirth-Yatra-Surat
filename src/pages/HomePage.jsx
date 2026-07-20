import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GirnarThreeBackdrop } from '../components/GirnarThreeBackdrop.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';
import { SiteNavbar } from '../components/SiteNavbar.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { upashraysDB, jinalayasDB } from '../lib/database.js';

gsap.registerPlugin(ScrollTrigger);

const sceneImages = {
  hero: '/images/!st image.jpg',
  heroMobile: '/images/!st image.jpg',
  about: '/image/2.JPG',
  aboutMobile: '/images/mobile/about-2.webp',
  bus: '/images/bus.webp?v=2',
  busMobile: '/images/mobile/bus.webp?v=2',
  upashray: '/images/Upasray.png',
  upashrayMobile: '/images/mobile/upashray.webp',
  jinalay: '/images/Jinalaya-jirnodhar.JPG',
  jinalayMobile: '/images/Jinalaya-jirnodhar.JPG',
  pathsala: '/images/5-Pathsala Vitran.png',
  pathsalaMobile: '/images/5-Pathsala Vitran.png',
  rituals: '/images/164.1.jpg',
  ritualsMobile: '/images/164.1.jpg',
  join: '/image/7.jpg',
  joinMobile: '/images/mobile/join-7.webp',
};

const HomePage = () => {
  const { t } = useLanguage();
  const [isMobileViewport, setIsMobileViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [upashrayCount, setUpashrayCount] = useState(null);
  const [jinalayCount, setJinalayCount] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const [upashrays, jinalayas] = await Promise.all([
          upashraysDB.getAll(),
          jinalayasDB.getAll()
        ]);
        if (mounted) {
          setUpashrayCount(upashrays.length);
          setJinalayCount(jinalayas.length);
        }
      } catch (err) {
        console.error('Failed to fetch counts for home page:', err);
      }
    };
    fetchCounts();
    return () => { mounted = false; };
  }, []);
  const [activeSceneId, setActiveSceneId] = useState('hero');
  const scrollContainerRef = useRef(null);
  const sectionRefs = useRef({});
  const [heroWelcomeShown, setHeroWelcomeShown] = useState(false);
  const [heroUnlocked, setHeroUnlocked] = useState(false);
  const heroWelcomeShownRef = useRef(false);
  const heroUnlockedRef = useRef(false);
  const heroScrollGateUntilRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

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
    heroUnlockedRef.current = false;
    heroWelcomeShownRef.current = false;
    heroScrollGateUntilRef.current = 0;
    setHeroUnlocked(false);
    setHeroWelcomeShown(false);
  }, [isMobileViewport]);

  const heroCopyVisible = heroWelcomeShown;
  const heroBackdropVisible = heroWelcomeShown;

  const scenes = useMemo(
    () => [
      { id: 'hero', label: t(siteCopy.home.scenes[0].label) },
      { id: 'about', label: t(siteCopy.home.scenes[1].label) },
      { id: 'bus', label: t(siteCopy.home.scenes[2].label) },
      { id: 'upashray', label: t(siteCopy.home.scenes[3].label) },
      { id: 'jinalay', label: t(siteCopy.home.scenes[4].label) },
      { id: 'pathsala', label: t(siteCopy.home.scenes[5].label) },
      { id: 'rituals', label: t(siteCopy.home.scenes[6].label) },
      { id: 'join', label: t(siteCopy.home.scenes[7].label) },
    ],
    [t],
  );

  const revealHeroWelcome = useCallback(() => {
    if (heroWelcomeShownRef.current) {
      return;
    }

    heroWelcomeShownRef.current = true;
    setHeroWelcomeShown(true);
    heroScrollGateUntilRef.current = performance.now() + 2000;
  }, []);

  const hideHeroWelcome = useCallback(() => {
    if (!heroWelcomeShownRef.current) {
      return;
    }

    heroWelcomeShownRef.current = false;
    setHeroWelcomeShown(false);
    heroScrollGateUntilRef.current = performance.now() + 800;
  }, []);

  const instantCompleteHeroWelcome = useCallback(() => {
    heroWelcomeShownRef.current = true;
    heroUnlockedRef.current = true;
    heroScrollGateUntilRef.current = 0;
    setHeroWelcomeShown(true);
    setHeroUnlocked(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('home-snap-root');
    return () => {
      document.documentElement.classList.remove('home-snap-root');
    };
  }, []);

  useEffect(() => {
    heroUnlockedRef.current = heroUnlocked;
  }, [heroUnlocked]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!heroUnlocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [heroUnlocked]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isMobileViewport) {
      const onWheelMobile = (event) => {
        const now = performance.now();
        const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;

        if (!heroWelcomeShownRef.current && event.deltaY > 0) {
          event.preventDefault();
          revealHeroWelcome();
          heroUnlockedRef.current = true;
          setHeroUnlocked(true);
          heroScrollGateUntilRef.current = now + 320;
          return;
        }

        if (heroWelcomeShownRef.current && scrollTop <= 10 && event.deltaY < 0) {
          event.preventDefault();
          heroUnlockedRef.current = false;
          setHeroUnlocked(false);
          hideHeroWelcome();
        }
      };

      let touchStartY = 0;
      let touchStartX = 0;

      const onTouchStartMobile = (event) => {
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
      };

      const onTouchEndMobile = (event) => {
        const touchEndY = event.changedTouches[0].clientY;
        const touchEndX = event.changedTouches[0].clientX;
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;

        if (Math.abs(deltaX) > Math.abs(deltaY) || Math.abs(deltaY) < 30) {
          return;
        }

        onWheelMobile({
          deltaY,
          preventDefault: () => { },
          stopPropagation: () => { },
        });
      };

      document.addEventListener('wheel', onWheelMobile, { passive: false, capture: true });
      document.addEventListener('touchstart', onTouchStartMobile, { passive: true });
      document.addEventListener('touchend', onTouchEndMobile, { passive: false });

      return () => {
        document.removeEventListener('wheel', onWheelMobile, true);
        document.removeEventListener('touchstart', onTouchStartMobile);
        document.removeEventListener('touchend', onTouchEndMobile);
      };
    }

    // Warm up the next section backgrounds so text/context appears immediately when snapping.
    const warmImages = [sceneImages.about, sceneImages.bus, sceneImages.upashray].map((src) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
      return image;
    });

    return () => {
      warmImages.length = 0;
    };
  }, [isMobileViewport]);

  useEffect(() => {
    if (isMobileViewport) {
      return;
    }

    const onWheelDoc = (event) => {
      const now = performance.now();
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      const isQuietLongEnough = now - lastWheelTimeRef.current > 180;
      lastWheelTimeRef.current = now;

      // At top, scrolling up should re-lock hero in the same way as the old implementation.
      if (heroUnlockedRef.current && scrollTop <= 10 && event.deltaY < 0) {
        event.preventDefault();
        heroUnlockedRef.current = false;
        setHeroUnlocked(false);
        heroScrollGateUntilRef.current = now + 800;
        return;
      }

      if (!heroWelcomeShownRef.current) {
        if (event.deltaY <= 0) {
          return;
        }
        event.preventDefault();
        revealHeroWelcome();
        return;
      }

      if (!heroUnlockedRef.current) {
        if (now < heroScrollGateUntilRef.current) {
          event.preventDefault();
          return;
        }

        if (event.deltaY < 0) {
          event.preventDefault();
          hideHeroWelcome();
          return;
        }

        if (event.deltaY > 0) {
          if (!isQuietLongEnough) {
            event.preventDefault();
            return;
          }

          event.preventDefault();
          heroUnlockedRef.current = true;
          setHeroUnlocked(true);
        }
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
    };

    const onTouchEnd = (event) => {
      const touchEndY = event.changedTouches[0].clientY;
      const touchEndX = event.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;

      // Ignore horizontal swipes to avoid accidental sideways gesture side effects.
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return;
      }

      if (Math.abs(deltaY) > 30) {
        onWheelDoc({
          deltaY,
          preventDefault: () => { },
          stopPropagation: () => { },
        });
      }
    };

    document.addEventListener('wheel', onWheelDoc, { passive: false, capture: true });
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('wheel', onWheelDoc, true);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [hideHeroWelcome, isMobileViewport, revealHeroWelcome]);

  useEffect(() => {
    if (isMobileViewport) {
      return;
    }

    const onKeyDown = (event) => {
      const activeTag = event.target?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return;
      }

      const main = scrollContainerRef.current;
      if (!main || main.scrollTop > 8) {
        return;
      }

      const now = performance.now();

      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        if (!heroWelcomeShownRef.current) {
          event.preventDefault();
          revealHeroWelcome();
          return;
        }

        if (!heroUnlockedRef.current) {
          if (now < heroScrollGateUntilRef.current) {
            event.preventDefault();
            return;
          }

          event.preventDefault();
          heroUnlockedRef.current = true;
          setHeroUnlocked(true);
        }
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        if (heroWelcomeShownRef.current && !heroUnlockedRef.current) {
          if (now < heroScrollGateUntilRef.current) {
            event.preventDefault();
            return;
          }

          event.preventDefault();
          hideHeroWelcome();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [hideHeroWelcome, isMobileViewport, revealHeroWelcome]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const syncActiveScene = () => {
      const top = scrollContainer.scrollTop;
      const height = Math.max(1, scrollContainer.clientHeight);
      const sceneIndex = Math.max(0, Math.min(scenes.length - 1, Math.round(top / height)));
      const sceneId = scenes[sceneIndex]?.id ?? 'hero';
      setActiveSceneId(sceneId);
    };

    if (isMobileViewport) {
      const handleScroll = () => {
        syncActiveScene();
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      syncActiveScene();

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const revealElements = gsap.utils.toArray('.home-reveal');
    if (!reduced) {
      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              scroller: scrollContainer,
              start: 'top 94%',
              end: 'top 62%',
              once: true,
            },
          },
        );
      });
    }

    let scrollRaf = 0;

    const handleScroll = () => {
      const top = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const now = performance.now();

      if (!heroUnlockedRef.current && top > 0) {
        scrollContainer.scrollTop = 0;
      }

      if (
        heroUnlockedRef.current &&
        now < heroScrollGateUntilRef.current &&
        top > 0 &&
        top < containerHeight * 0.45
      ) {
        scrollContainer.scrollTop = 0;
      }

      if (!scrollRaf) {
        scrollRaf = requestAnimationFrame(syncActiveScene);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    syncActiveScene();

    const sectionElements = gsap.utils.toArray('.home-scene');
    sectionElements.forEach((section) => {
      const sectionId = section.getAttribute('data-scene-id');
      const background = section.querySelector('.home-bg');

      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainer,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSceneId(sectionId ?? 'hero'),
        onEnterBack: () => setActiveSceneId(sectionId ?? 'hero'),
      });

      if (!background || reduced) {
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const scale = 1.07 + self.progress * 0.08;
          const y = self.progress * 34 - 17;
          background.style.transform = `scale(${scale}) translateY(${y}px)`;
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      if (scrollRaf) {
        cancelAnimationFrame(scrollRaf);
      }

      scrollContainer.removeEventListener('scroll', handleScroll);

      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.scroller === scrollContainer) {
          trigger.kill();
        }
      });
    };
  }, [isMobileViewport, scenes]);

  const scrollToScene = useCallback(
    (sceneId) => {
      const container = scrollContainerRef.current;
      const targetSection = sectionRefs.current[sceneId];
      if (!container || !targetSection) {
        return;
      }

      if (sceneId === 'hero') {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!heroUnlockedRef.current) {
        instantCompleteHeroWelcome();
      }

      const top =
        targetSection.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTo({ top, behavior: 'smooth' });
          ScrollTrigger.refresh();
        });
      });
    },
    [instantCompleteHeroWelcome],
  );

  return (
    <div className="relative min-h-full flex flex-col overflow-x-hidden bg-surface selection:bg-primary selection:text-on-primary">
      <SiteNavbar variant="dark" />

      <aside className="fixed right-4 md:right-12 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 md:gap-7 items-center">
        {scenes.map((scene) => {
          const isActive = activeSceneId === scene.id;
          return (
            <button
              type="button"
              key={scene.id}
              className="group relative flex items-center justify-end"
              onClick={() => scrollToScene(scene.id)}
              aria-label={scene.label}
            >
              <span
                className={`absolute right-6 md:right-8 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 ${isActive ? 'text-primary' : 'text-neutral-500'
                  }`}
              >
                {scene.label}
              </span>
              <span
                className={`rounded-full transition-all duration-300 ${isActive
                  ? 'w-1.5 h-1.5 md:w-2 md:h-2 bg-primary ring-2 md:ring-4 ring-primary/25'
                  : 'w-1 h-1 md:w-1.5 md:h-1.5 bg-neutral-700 group-hover:bg-white'
                  }`}
              />
            </button>
          );
        })}
      </aside>

      <main ref={scrollContainerRef} className={heroUnlocked ? 'snap-container' : 'snap-container-locked'}>
        <section
          ref={(element) => {
            sectionRefs.current.hero = element;
          }}
          data-scene-id="hero"
          className="home-scene snap-section relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-0 overflow-hidden" style={{ transform: 'translate3d(0, 0, 0)', WebkitTransform: 'translate3d(0, 0, 0)', isolation: 'isolate' }}>
            <picture>
              <source media="(max-width: 768px)" srcSet={sceneImages.heroMobile} />
              <img
                id="hero-locked-bg"
                src={sceneImages.hero}
                alt={t(siteCopy.home.hero.lineTwo)}
                className="home-bg h-full w-full object-cover object-center md:object-[65%_center] select-none"
                style={{
                  filter: heroBackdropVisible ? 'blur(9px) brightness(0.42)' : 'blur(0px) brightness(0.95)',
                  transition: 'filter 1s ease',
                }}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onContextMenu={(e) => e.preventDefault()}
              />
            </picture>
            <div className={`pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/45 via-black/10 to-black/20 transition-opacity duration-700 ${heroBackdropVisible ? 'opacity-100' : 'opacity-0'}`} />
            {heroBackdropVisible ? <GirnarThreeBackdrop intensity={1} /> : null}
          </div>

          <div
            id="hero-welcome-copy"
            className="relative z-20 text-center px-6 max-w-6xl"
            style={{
              opacity: heroCopyVisible ? 1 : 0,
              transform: heroCopyVisible ? 'translateY(0)' : 'translateY(28px)',
              pointerEvents: heroCopyVisible ? 'auto' : 'none',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <span className="inline-block mb-4 md:mb-6 font-headline text-[10px] md:text-xs font-bold uppercase tracking-[0.45em] md:tracking-[0.6em] text-primary opacity-80">
              {t(siteCopy.home.hero.badge)}
            </span>
            <h1 className="font-headline text-4xl md:text-8xl font-bold tracking-tight text-primary gold-glow leading-[1.05] md:leading-[0.95]">
              {t(siteCopy.home.hero.lineOne)}
              <br />
              {t(siteCopy.home.hero.lineTwo)}
            </h1>
            <p className="mx-auto mt-7 md:mt-10 max-w-xs md:max-w-2xl font-body text-sm md:text-xl font-light italic tracking-[0.08em] md:tracking-[0.15em] text-on-surface-variant">
              {t(siteCopy.home.hero.subtitle)}
            </p>
          </div>

          {!heroWelcomeShown ? (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-20 z-30 flex flex-col items-center gap-4 md:gap-6 pointer-events-none">
              <span className="font-headline text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] text-primary font-black md:[writing-mode:vertical-lr] md:rotate-180 drop-shadow-sm whitespace-nowrap">
                {t(siteCopy.home.hero.scrollHint)}
              </span>
              <div className="relative h-12 md:h-20 w-[1.5px] md:w-[2px] overflow-hidden">
                <div className="absolute top-0 h-1/2 w-full bg-primary animate-[swipe-down_2s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : null}
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.about = element;
          }}
          data-scene-id="about"
          className="home-scene snap-section relative min-h-screen flex items-center pt-28 md:pt-36 pb-16"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={isMobileViewport ? sceneImages.aboutMobile : sceneImages.about}
              alt={t(siteCopy.home.scenes[1].label)}
              className="home-bg h-full w-full object-cover brightness-[0.28] select-none"
              loading={isMobileViewport ? 'lazy' : 'eager'}
              fetchPriority={isMobileViewport ? 'low' : 'high'}
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="relative z-20 w-full px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-stretch">
            <article className="frosted-premium rounded-sm border-t-2 border-primary p-5 md:p-10 mx-auto w-full h-full flex flex-col justify-between">
              <div>
                <span className="text-primary font-headline text-[10px] tracking-[0.5em] uppercase opacity-60">{t(siteCopy.home.intro.acharyaBadge)}</span>
                <h2 className="home-reveal text-[1.1rem] md:text-4xl font-headline mt-3 text-white leading-tight">{t(siteCopy.home.intro.acharyaTitle)}</h2>
                <div className="mt-3 md:mt-6 space-y-3 text-on-surface-variant leading-5 md:leading-relaxed font-light text-[11px] md:text-sm">
                  {siteCopy.home.intro.acharyaParagraphs.map((paragraph, index) => (
                    <p className="home-reveal" key={index}>
                      {t(paragraph)}
                    </p>
                  ))}
                  <p className="home-reveal italic text-primary/80">{t(siteCopy.home.intro.quote)}</p>
                </div>
              </div>
            </article>
            <article className="frosted-premium rounded-sm border-t-2 border-primary p-5 md:p-10 flex flex-col mx-auto w-full h-full">
              <div>
                <div className="rounded-sm overflow-hidden border border-primary/20 bg-black/35">
                  <img
                    src="/images/hemvallabh m.s.jpeg"
                    alt={t(siteCopy.home.intro.acharyaTitle)}
                    className="home-reveal w-full h-[320px] md:h-[480px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.bus = element;
          }}
          data-scene-id="bus"
          className="home-scene snap-section relative min-h-screen flex items-center py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={isMobileViewport ? sceneImages.busMobile : sceneImages.bus}
              alt={t(siteCopy.home.scenes[2].label)}
              className="home-bg h-full w-full object-cover brightness-[0.35] select-none"
              loading={isMobileViewport ? 'lazy' : 'eager'}
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="relative z-20 w-full px-6 md:px-24 flex justify-center md:justify-start pt-24">
            <article className="frosted-premium p-7 md:p-12 max-w-lg md:max-w-3xl border-l-[6px] border-primary">
              <span className="text-secondary font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] opacity-70">{t(siteCopy.home.monthlyBus.badge)}</span>
              <h2 className="home-reveal text-3xl md:text-6xl font-headline mt-4 md:mt-6 mb-5 md:mb-7 leading-tight md:leading-none text-white">
                {t(siteCopy.home.monthlyBus.title)}
              </h2>
              <p className="home-reveal text-sm md:text-xl text-on-surface-variant font-light leading-relaxed">{t(siteCopy.home.monthlyBus.paragraph)}</p>

              <div className="home-reveal mt-7 grid grid-cols-2 gap-4 md:gap-8 border-t border-white/10 pt-5 md:pt-7">
                <div>
                  <span className="block text-primary uppercase tracking-widest text-[8px] md:text-[10px] mb-1 font-bold opacity-80">{t(siteCopy.home.monthlyBus.frequencyLabel)}</span>
                  <span className="text-white text-xs md:text-lg font-medium">{t(siteCopy.home.monthlyBus.frequencyValue)}</span>
                </div>
                <div>
                  <span className="block text-primary uppercase tracking-widest text-[8px] md:text-[10px] mb-1 font-bold opacity-80">{t(siteCopy.home.monthlyBus.experienceLabel)}</span>
                  <span className="text-white text-xs md:text-lg font-medium">{t(siteCopy.home.monthlyBus.experienceValue)}</span>
                </div>
              </div>

              <Link
                to="/monthly-bus-yatra"
                className="home-reveal inline-block mt-7 px-6 py-3 bg-primary text-on-primary font-bold tracking-[0.2em] uppercase text-[10px]"
              >
                {t(siteCopy.common.readMore)}
              </Link>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.upashray = element;
          }}
          data-scene-id="upashray"
          className="home-scene snap-section relative min-h-screen flex items-center py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={isMobileViewport ? sceneImages.upashrayMobile : sceneImages.upashray}
              alt={t(siteCopy.home.scenes[3].label)}
              className="home-bg h-full w-full object-cover brightness-[0.34] select-none"
              loading="lazy"
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="relative z-20 w-full px-6 md:px-24 flex justify-center md:justify-end pt-24">
            <article className="frosted-premium px-7 md:px-12 py-7 md:py-12 max-w-lg md:max-w-3xl border-r-[6px] border-primary text-right">
              <span className="text-secondary font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] opacity-70">{t(siteCopy.home.upashray.badge)}</span>
              <h2 className="home-reveal text-3xl md:text-6xl font-headline mt-4 mb-4 md:mb-7 leading-tight md:leading-none text-white">
                {t(siteCopy.home.upashray.title)}
              </h2>
              <p className="home-reveal text-sm md:text-xl text-on-surface-variant font-light leading-relaxed">{t(siteCopy.home.upashray.paragraph)}</p>
              <div className="home-reveal mt-5 bg-white/5 p-4 rounded-sm text-center inline-block">
                <span className="block text-primary text-xl md:text-3xl font-headline mb-0.5 font-bold">
                  {upashrayCount !== null ? `${upashrayCount}+` : t(siteCopy.home.upashray.countValue)}
                </span>
                <span className="text-white uppercase tracking-widest text-[8px] md:text-[10px]">{t(siteCopy.home.upashray.countLabel)}</span>
              </div>
              <div>
                <Link
                  to="/upashray-jirnodhar"
                  className="home-reveal inline-block mt-6 px-6 py-3 border border-primary/60 text-primary font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-primary hover:text-black transition-colors"
                >
                  {t(siteCopy.common.viewDetails)}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.jinalay = element;
          }}
          data-scene-id="jinalay"
          className="home-scene snap-section relative min-h-screen flex items-center py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={isMobileViewport ? sceneImages.jinalayMobile : sceneImages.jinalay}
              alt={t(siteCopy.home.scenes[4].label)}
              className="home-bg h-full w-full object-cover brightness-[0.34] select-none"
              loading="lazy"
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="relative z-20 w-full px-6 md:px-24 flex justify-center md:justify-start pt-24">
            <article className="frosted-premium px-7 md:px-12 py-7 md:py-12 max-w-lg md:max-w-3xl border-l-[6px] border-secondary text-left">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] opacity-70">{t(siteCopy.home.jinalayHome.badge)}</span>
              <h2 className="home-reveal text-3xl md:text-6xl font-headline mt-4 mb-4 md:mb-7 leading-tight md:leading-none text-white">
                {t(siteCopy.home.jinalayHome.title)}
              </h2>
              <p className="home-reveal text-sm md:text-xl text-on-surface-variant font-light leading-relaxed">{t(siteCopy.home.jinalayHome.paragraph)}</p>
              <div className="home-reveal mt-5 bg-white/5 p-4 rounded-sm text-center inline-block">
                <span className="block text-secondary text-xl md:text-3xl font-headline mb-0.5 font-bold">
                  {jinalayCount !== null ? `${jinalayCount}+` : `${t(siteCopy.home.jinalayHome.countValue)}+`}
                </span>
                <span className="text-white uppercase tracking-widest text-[8px] md:text-[10px]">{t(siteCopy.home.jinalayHome.countLabel)}</span>
              </div>
              <div>
                <Link
                  to="/jinalay-jirnodhar"
                  className="home-reveal inline-block mt-6 px-6 py-3 border border-secondary/60 text-secondary font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-secondary hover:text-black transition-colors"
                >
                  {t(siteCopy.common.viewDetails)}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.pathsala = element;
          }}
          data-scene-id="pathsala"
          className="home-scene snap-section relative min-h-screen flex items-center py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={isMobileViewport ? sceneImages.pathsalaMobile : sceneImages.pathsala}
              alt={t(siteCopy.home.scenes[5].label)}
              className="home-bg h-full w-full object-cover brightness-[0.35] select-none"
              loading="lazy"
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <div className="relative z-20 w-full px-6 md:px-24 flex justify-center md:justify-end pt-24">
            <article className="frosted-premium p-7 md:p-12 max-w-lg md:max-w-3xl border-r-[6px] border-secondary text-right">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] opacity-70">{t(siteCopy.home.pathsala.badge)}</span>
              <h2 className="home-reveal text-3xl md:text-6xl font-headline mt-4 md:mt-6 mb-5 md:mb-7 leading-tight md:leading-none text-white">
                {t(siteCopy.home.pathsala.title)}
              </h2>
              <p className="home-reveal text-sm md:text-xl text-on-surface-variant font-light leading-relaxed">{t(siteCopy.home.pathsala.paragraph)}</p>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.rituals = element;
          }}
          data-scene-id="rituals"
          className="home-scene snap-section relative min-h-screen flex items-center py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={isMobileViewport ? sceneImages.ritualsMobile : sceneImages.rituals} alt={t(siteCopy.home.scenes[6].label)} className="home-bg h-full w-full object-cover object-center brightness-[0.33]" loading="lazy" decoding="async" />
          </div>
          <div className="relative z-20 w-full px-6 md:px-24 flex justify-center md:justify-start pt-24">
            <article className="frosted-premium p-7 md:p-12 max-w-lg md:max-w-3xl border-l-[6px] border-secondary text-left">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px] opacity-70">{t(siteCopy.home.rituals.badge)}</span>
              <h2 className="home-reveal text-3xl md:text-6xl font-headline mt-4 md:mt-6 mb-5 md:mb-7 leading-tight md:leading-none text-white">
                {t(siteCopy.home.rituals.title)}
              </h2>
              <p className="home-reveal text-sm md:text-xl text-on-surface-variant font-light leading-relaxed">{t(siteCopy.home.rituals.paragraph)}</p>
              {siteCopy.home.rituals.contacts && (
                <div className="home-reveal mt-5 space-y-1">
                  {t(siteCopy.home.rituals.contacts).split('/').map((contact, idx) => (
                    <p key={idx} className="text-sm md:text-xl text-on-surface-variant font-bold leading-relaxed">
                      {contact.trim()}
                    </p>
                  ))}
                </div>
              )}
              <Link
                to="/events"
                className="home-reveal inline-block mt-6 px-6 py-3 border border-primary/60 text-primary font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-primary hover:text-black transition-colors"
              >
                {t(siteCopy.common.readMore)}
              </Link>
            </article>
          </div>
        </section>

        <section
          ref={(element) => {
            sectionRefs.current.join = element;
          }}
          data-scene-id="join"
          className="home-scene snap-section relative min-h-screen flex flex-col"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={isMobileViewport ? sceneImages.joinMobile : sceneImages.join} alt={t(siteCopy.home.scenes[6].label)} className="home-bg h-full w-full object-cover brightness-[0.36]" loading="lazy" decoding="async" />
          </div>

          <div className="relative z-20 flex-grow flex flex-col items-center justify-center px-6 text-center pt-20">
            <h2 className="home-reveal text-4xl md:text-8xl font-headline text-white font-bold tracking-tight mb-8 md:mb-12">
              {t(siteCopy.home.join.title)}
            </h2>
            <div className="home-reveal flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/contact-us"
                className="w-full md:w-auto px-8 md:px-14 py-4 md:py-6 bg-primary text-on-primary font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs rounded-sm hover:scale-105 transition-transform duration-500 shadow-2xl shadow-primary/20"
              >
                {t(siteCopy.home.join.joinButton)}
              </Link>
              <Link
                to="/contact-us"
                className="w-full md:w-auto px-8 md:px-14 py-4 md:py-6 border border-primary/40 text-primary font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs rounded-sm hover:bg-primary hover:text-black transition-colors duration-500"
              >
                {t(siteCopy.home.join.supportButton)}
              </Link>
            </div>
          </div>

          <div className="relative z-20 w-full mt-auto bg-transparent">
            <SiteFooter variant="dark" />
          </div>
        </section>
      </main>

      <style>{`
        @keyframes swipe-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
