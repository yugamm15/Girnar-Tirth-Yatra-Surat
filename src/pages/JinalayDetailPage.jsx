import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import GalleryModal from '../components/GalleryModal.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, jinalayasDB } from '../lib/database.js';

const statusClassNames = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  inProgress: 'bg-amber-100 text-amber-700 border-amber-200',
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  done: 'bg-green-100 text-green-700 border-green-200',
  process: 'bg-amber-100 text-amber-700 border-amber-200',
  plan: 'bg-slate-100 text-slate-700 border-slate-200',
};

const JinalayDetailPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const pageCopy = siteCopy.upashrayDetailPage; // Reusing keys where possible
  const [jinalaya, setJinalaya] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Modal State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  const cacheKey = `jinalay_detail_${id || 'unknown'}`;

  useEffect(() => {
    let cancelled = false;

    const loadJinalayaData = async () => {
      try {
        const cachedState = dbCache.read(cacheKey);
        if (cachedState) {
          setJinalaya(cachedState);
          setLoading(false);
        } else {
          setLoading(true);
        }

        const data = await jinalayasDB.getById(id);
        if (!data) {
          if (!cachedState) {
            setError('Jinalaya not found');
            setLoading(false);
          }
          return;
        }

        if (!cancelled) {
          setJinalaya(data);
          setError(null);
          dbCache.write(cacheKey, data);
        }
      } catch (err) {
        console.error('Error loading jinalaya:', err);
        if (!dbCache.read(cacheKey)) {
          setError('Failed to load jinalaya data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadJinalayaData();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const openGallery = (imageUrl, title) => {
    if (!imageUrl) return;
    setGalleryImages([{ file_url: imageUrl }]);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <LightPageShell>
        <section className="max-w-4xl mx-auto light-panel light-panel-left p-6 md:p-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 animate-pulse">Loading jinalaya...</p>
          </div>
        </section>
      </LightPageShell>
    );
  }

  if (error || !jinalaya) {
    return (
      <LightPageShell>
        <section className="max-w-4xl mx-auto light-panel light-panel-left p-6 md:p-10">
          <h1 className="text-3xl font-headline text-gray-900">Jinalaya Not Found</h1>
          <p className="mt-3 text-gray-600">The requested Jinalaya record does not exist.</p>
          <Link
            to="/jinalay-jinodhar"
            className="inline-block mt-6 px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold"
          >
            Back to Jinalay List
          </Link>
        </section>
      </LightPageShell>
    );
  }

  const displayStatus = {
    done: 'completed',
    process: 'inProgress',
    plan: 'planned',
    completed: 'completed',
    inProgress: 'inProgress',
    planned: 'planned'
  }[jinalaya.status] || jinalaya.status;

  const coverImage = jinalaya.after_img || jinalaya.process_img || jinalaya.before_img || '/images/Upasray.png';

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <header className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6 md:gap-8">
          <article className="light-panel light-panel-left p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-bold rounded-full border ${
                  statusClassNames[displayStatus] ?? statusClassNames.planned
                }`}
              >
                {t(siteCopy.statuses[displayStatus] || jinalaya.status)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-headline text-gray-900 leading-tight">{jinalaya.name}</h1>
            <p className="mt-3 text-sm md:text-base text-gray-600">{jinalaya.village}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">Mulnayak</p>
                <p className="mt-1.5 text-gray-800">{jinalaya.mulnayak || 'N/A'}</p>
              </div>
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">Route</p>
                <p className="mt-1.5 text-gray-800">{jinalaya.route || 'N/A'}</p>
              </div>
              <div className="light-chip p-4 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.location)}</p>
                <p className="mt-1.5 text-gray-800 line-clamp-1">{jinalaya.location || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
              {jinalaya.description && (
                <p>
                  <span className="font-bold text-[#8f6d2f]">Description: </span>
                  {jinalaya.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {jinalaya.location && (
                <a
                  href={jinalaya.location}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
                >
                  {t(siteCopy.common.getDirections)}
                </a>
              )}
              <Link
                to="/jinalay-jinodhar"
                className="px-6 py-3 border border-[#c5a059] text-[#8f6d2f] uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#f7f0df] transition-colors"
              >
                Back to List
              </Link>
            </div>
          </article>

          <article className="hidden lg:block light-panel light-panel-right light-card-image overflow-hidden">
            <SecureImage
              src={coverImage}
              alt={jinalaya.name}
              containerClassName="w-full h-full min-h-[280px]"
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openGallery(coverImage, jinalaya.name)}
            />
          </article>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Before Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">Before</h2>
            {jinalaya.before_img ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(jinalaya.before_img, `${jinalaya.name} - Before`)}
                >
                  <SecureImage
                    src={jinalaya.before_img}
                    alt={`${jinalaya.name} - Before`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-gray-900 rounded-sm">View Full</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-sm">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No Image</span>
              </div>
            )}
          </article>

          {/* Process Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">In Process</h2>
            {jinalaya.process_img ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(jinalaya.process_img, `${jinalaya.name} - Process`)}
                >
                  <SecureImage
                    src={jinalaya.process_img}
                    alt={`${jinalaya.name} - Process`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-gray-900 rounded-sm">View Full</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-sm">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No Image</span>
              </div>
            )}
          </article>

          {/* After Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">After</h2>
            {jinalaya.after_img ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(jinalaya.after_img, `${jinalaya.name} - After`)}
                >
                  <SecureImage
                    src={jinalaya.after_img}
                    alt={`${jinalaya.name} - After`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-gray-900 rounded-sm">View Full</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 bg-gray-50 flex items-center justify-center border border-dashed border-gray-200 rounded-sm">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No Image</span>
              </div>
            )}
          </article>
        </section>
      </section>

      <GalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        title={galleryTitle}
      />
    </LightPageShell>
  );
};

export default JinalayDetailPage;
