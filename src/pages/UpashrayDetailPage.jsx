import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import GalleryModal from '../components/GalleryModal.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, upashraysDB, upashrayMediaDB } from '../lib/database.js';

const statusClassNames = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  inProgress: 'bg-amber-100 text-amber-700 border-amber-200',
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  done: 'bg-green-100 text-green-700 border-green-200',
  process: 'bg-amber-100 text-amber-700 border-amber-200',
  plan: 'bg-slate-100 text-slate-700 border-slate-200',
};

const UpashrayDetailPage = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const pageCopy = siteCopy.upashrayDetailPage;
  const [upashray, setUpashray] = useState(null);
  const [beforeImages, setBeforeImages] = useState([]);
  const [processImages, setProcessImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery Modal State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  const cacheKey = `upashray_detail_${slug || 'unknown'}`;

  const applyDetailState = (state) => {
    if (!state) return;
    setUpashray(state.upashray || null);
    setBeforeImages(state.beforeImages || []);
    setProcessImages(state.processImages || []);
    setAfterImages(state.afterImages || []);
  };

  useEffect(() => {
    let cancelled = false;

    const loadUpashrayData = async () => {
      try {
        const cachedState = dbCache.read(cacheKey);
        if (cachedState) {
          applyDetailState(cachedState);
          setLoading(false);
        } else {
          setLoading(true);
        }

        const upashrayData = await upashraysDB.getBySlug(slug, 'id, name, village, route, trusty, mobile, location, description, slug, status, before_img, process_img, after_img, created_at');
        if (!upashrayData) {
          if (!cachedState) {
            setError('Upashray not found');
            setLoading(false);
          }
          return;
        }

        const allMedia = await upashrayMediaDB.getByUpashrayId(upashrayData.id, 'id, upashray_id, media_type, file_url, sort_order, created_at');
        const before = allMedia.filter((m) => m.media_type === 'before');
        const process = allMedia.filter((m) => m.media_type === 'process');
        const after = allMedia.filter((m) => m.media_type === 'after');

        const nextState = {
          upashray: upashrayData,
          beforeImages: before,
          processImages: process,
          afterImages: after,
        };

        if (!cancelled) {
          applyDetailState(nextState);
          setError(null);
          dbCache.write(cacheKey, nextState);
        }
      } catch (err) {
        console.error('Error loading upashray:', err);
        if (!dbCache.read(cacheKey)) {
          setError('Failed to load upashray data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadUpashrayData();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const openGallery = (images, title) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <LightPageShell>
        <section className="max-w-4xl mx-auto light-panel light-panel-left p-6 md:p-10 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 animate-pulse">{t(pageCopy.loading) || 'Loading upashray...'}</p>
          </div>
        </section>
      </LightPageShell>
    );
  }

  if (error || !upashray) {
    return (
      <LightPageShell>
        <section className="max-w-4xl mx-auto light-panel light-panel-left p-6 md:p-10">
          <h1 className="text-3xl font-headline text-gray-900">{t(pageCopy.notFoundTitle)}</h1>
          <p className="mt-3 text-gray-600">{t(pageCopy.notFoundBody)}</p>
          <Link
            to="/upashray-jinodhar"
            className="inline-block mt-6 px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold"
          >
            {t(siteCopy.common.backToList)}
          </Link>
        </section>
      </LightPageShell>
    );
  }

  // Map status for display
  const displayStatus = {
    done: 'completed',
    process: 'inProgress',
    plan: 'planned',
    completed: 'completed',
    inProgress: 'inProgress',
    planned: 'planned'
  }[upashray.status] || upashray.status;

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
                {t(siteCopy.statuses[displayStatus] || upashray.status)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-headline text-gray-900 leading-tight">{upashray.name}</h1>
            <p className="mt-3 text-sm md:text-base text-gray-600">{upashray.village}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.trusty)}</p>
                <p className="mt-1.5 text-gray-800">{upashray.trusty || 'N/A'}</p>
              </div>
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">Phone</p>
                <p className="mt-1.5 text-gray-800">{upashray.mobile || 'N/A'}</p>
              </div>
              <div className="light-chip p-4 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.location)}</p>
                <p className="mt-1.5 text-gray-800">{upashray.location || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
              {upashray.route && (
                <p>
                  <span className="font-bold text-[#8f6d2f]">Route: </span>
                  {upashray.route}
                </p>
              )}
              {upashray.description && (
                <p>
                  <span className="font-bold text-[#8f6d2f]">Description: </span>
                  {upashray.description}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {upashray.location && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(upashray.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
                >
                  {t(siteCopy.common.getDirections)}
                </a>
              )}
              <Link
                to="/upashray-jinodhar"
                className="px-6 py-3 border border-[#c5a059] text-[#8f6d2f] uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#f7f0df] transition-colors"
              >
                {t(siteCopy.common.backToList)}
              </Link>
            </div>
          </article>

          <article className="hidden lg:block light-panel light-panel-right light-card-image overflow-hidden">
            {beforeImages.length > 0 ? (
              <SecureImage
                src={beforeImages[0].file_url}
                alt={upashray.name}
                containerClassName="w-full h-full min-h-[280px]"
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openGallery(beforeImages, `${upashray.name} - Before`)}
              />
            ) : (
              <div className="w-full h-full min-h-[280px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </article>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Before Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections?.before || 'Before')}</h2>
            {beforeImages.length > 0 ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(beforeImages, `${upashray.name} - Before`)}
                >
                  <SecureImage
                    src={beforeImages[0].file_url}
                    alt={`${upashray.name} - Before`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {beforeImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-sm">
                      <div className="text-white text-sm font-bold bg-black/40 px-3 py-1 rounded">{beforeImages.length} photos</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No images yet</p>
              </div>
            )}
          </article>

          {/* In Process Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections?.process || 'In Process')}</h2>
            {processImages.length > 0 ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(processImages, `${upashray.name} - In Process`)}
                >
                  <SecureImage
                    src={processImages[0].file_url}
                    alt={`${upashray.name} - In Process`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {processImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-sm">
                      <div className="text-white text-sm font-bold bg-black/40 px-3 py-1 rounded">{processImages.length} photos</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No images yet</p>
              </div>
            )}
          </article>

          {/* After Section */}
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections?.after || 'After')}</h2>
            {afterImages.length > 0 ? (
              <div className="mt-4">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => openGallery(afterImages, `${upashray.name} - After`)}
                >
                  <SecureImage
                    src={afterImages[0].file_url}
                    alt={`${upashray.name} - After`}
                    containerClassName="w-full h-44 rounded-sm border border-gray-100"
                    className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  {afterImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-sm">
                      <div className="text-white text-sm font-bold bg-black/40 px-3 py-1 rounded">{afterImages.length} photos</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full h-44 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No images yet</p>
              </div>
            )}
          </article>
        </section>
      </section>

      {/* Gallery Modal */}
      <GalleryModal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} images={galleryImages} title={galleryTitle} />
    </LightPageShell>
  );
};

export default UpashrayDetailPage;
