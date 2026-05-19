import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { upashraysDB, upashrayMediaDB } from '../lib/database.js';

const statusClassNames = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  inProgress: 'bg-amber-100 text-amber-700 border-amber-200',
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  done: 'bg-green-100 text-green-700 border-green-200',
  process: 'bg-amber-100 text-amber-700 border-amber-200',
  plan: 'bg-slate-100 text-slate-700 border-slate-200',
};

const UpashrayJinodharPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.upashrayPage;
  const [upashrays, setUpashrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUpashrays = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await upashraysDB.getAll();
        if (!data || data.length === 0) {
          setUpashrays([]);
          return;
        }

        // For each upashray, fetch its media for cover image
        const upashrayWithImages = await Promise.all(
          data.map(async (upashray) => {
            try {
              const media = await upashrayMediaDB.getByUpashrayId(upashray.id);
              // Use first 'before' image as cover, or any image if no 'before'
              const coverImage = 
                media.find((m) => m.media_type === 'before')?.file_url ||
                media[0]?.file_url ||
                '/images/Upasray.png';

              return {
                ...upashray,
                coverImage,
                slug: upashray.slug || upashray.id.toString(),
              };
            } catch (err) {
              console.error(`Error loading media for upashray ${upashray.id}:`, err);
              return {
                ...upashray,
                coverImage: '/images/Upasray.png',
                slug: upashray.slug || upashray.id.toString(),
              };
            }
          })
        );

        setUpashrays(upashrayWithImages);
      } catch (err) {
        console.error('Error loading upashrays:', err);
        setError('Failed to load upashrays');
      } finally {
        setLoading(false);
      }
    };

    loadUpashrays();
  }, []);

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
            {t(pageCopy.heroBadge)}
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">{t(pageCopy.heroTitle)}</h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-4xl leading-relaxed">{t(pageCopy.heroDescription)}</p>
        </header>

        <section className="light-panel min-h-[400px] md:min-h-[600px] p-6 md:p-10 flex flex-col items-center justify-center bg-white border border-[#ddd2b7] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 w-full h-full flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-headline text-[#7a5f2d] mb-8 uppercase tracking-widest opacity-80">Upashray Network Across India</h2>
            
            <div className="w-full h-[350px] md:h-[500px] rounded-sm overflow-hidden border border-[#c5a059]/30 shadow-inner bg-[#f9f7f2] relative group">
              {/* Quick-loading placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#f9f7f2] animate-pulse group-[.loaded]:hidden">
                <span className="text-[#c5a059] font-headline text-xs tracking-widest animate-bounce">Loading Sacred Map...</span>
              </div>
              
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551375.021006575!2d72.31689139260177!3d17.476483169828236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b925117%3A0x2c5a77b887417244!2sIndia!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=Jain+Tirth+India"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'sepia(0.3) hue-rotate(-10deg) saturate(1.2) contrast(0.9)' }}
                allowFullScreen=""
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={(e) => e.currentTarget.parentElement.classList.add('loaded')}
                title="India Map"
              ></iframe>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#c5a059]"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Active Renovation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#c5a059]/40"></div>
                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Planned Vihar Routes</span>
              </div>
            </div>
            
            <p className="mt-8 text-[10px] md:text-xs text-[#8f6d2f] uppercase tracking-[0.3em] font-bold opacity-60">Interactive Map: Zoom and drag to explore cities & states</p>
          </div>
        </section>

        {loading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <article key={i} className="light-panel-soft light-card-image overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-gray-200"></div>
                <div className="p-5 md:p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </article>
            ))}
          </section>
        ) : error ? (
          <section className="light-panel light-panel-left p-6 md:p-10">
            <p className="text-red-600">{error}</p>
          </section>
        ) : upashrays.length === 0 ? (
          <section className="light-panel light-panel-left p-6 md:p-10">
            <p className="text-gray-600">No upashrays found. Please add some from the admin panel.</p>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {upashrays.map((upashray) => (
              <article key={upashray.id} className="light-panel-soft light-card-image overflow-hidden">
                <SecureImage
                  src={upashray.coverImage}
                  alt={upashray.name}
                  containerClassName="w-full h-52"
                  className="w-full h-52 object-cover"
                />

                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl md:text-2xl font-headline text-gray-900">{upashray.name}</h2>
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-bold rounded-full border ${
                        statusClassNames[upashray.status] ?? statusClassNames.planned
                      }`}
                    >
                      {t(siteCopy.statuses[upashray.status] || upashray.status)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">{upashray.village}</p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{upashray.description}</p>

                  <div className="mt-5">
                    <Link
                      to={`/upashray-jinodhar/${upashray.slug}`}
                      className="inline-block px-5 py-2.5 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
                    >
                      {t(siteCopy.common.viewDetails)}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </LightPageShell>
  );
};

export default UpashrayJinodharPage;
