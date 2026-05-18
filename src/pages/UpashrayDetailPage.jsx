import { Link, useParams } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { getUpashrayBySlug } from '../content/upashrays.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const statusClassNames = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  inProgress: 'bg-amber-100 text-amber-700 border-amber-200',
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
};

const normalizeGallery = (galleryValue) => {
  if (Array.isArray(galleryValue)) {
    return galleryValue;
  }
  if (!galleryValue) {
    return [];
  }
  return [galleryValue];
};

const UpashrayDetailPage = () => {
  const { slug } = useParams();
  const { t } = useLanguage();
  const pageCopy = siteCopy.upashrayDetailPage;
  const upashray = getUpashrayBySlug(slug);

  if (!upashray) {
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

  const beforeImages = normalizeGallery(upashray.images.before);
  const processImages = normalizeGallery(upashray.images.process);
  const afterImages = normalizeGallery(upashray.images.after);

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <header className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6 md:gap-8">
          <article className="light-panel light-panel-left p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-bold rounded-full border ${
                  statusClassNames[upashray.status] ?? statusClassNames.planned
                }`}
              >
                {t(siteCopy.statuses[upashray.status])}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-headline text-gray-900 leading-tight">{t(upashray.name)}</h1>
            <p className="mt-3 text-sm md:text-base text-gray-600">{t(upashray.place)}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.pincode)}</p>
                <p className="mt-1.5 text-gray-800">{upashray.pincode}</p>
              </div>
              <div className="light-chip p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.upashrayCount)}</p>
                <p className="mt-1.5 text-gray-800">{t(upashray.upashrayCount)}</p>
              </div>
              <div className="light-chip p-4 sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7c3d] font-bold">{t(siteCopy.common.mulnayak)}</p>
                <p className="mt-1.5 text-gray-800">{t(upashray.mulnayak)}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
              <p>
                <span className="font-bold text-[#8f6d2f]">{t(siteCopy.common.routeNote)}: </span>
                {t(upashray.distanceNote)}
              </p>
              <p>
                <span className="font-bold text-[#8f6d2f]">{t(pageCopy.sections.description)}: </span>
                {t(upashray.description)}
              </p>
              <p>
                <span className="font-bold text-[#8f6d2f]">{t(pageCopy.sections.locationDetails)}: </span>
                {t(upashray.locationText)}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={upashray.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#c5a059] text-white uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#b08d4a] transition-colors"
              >
                {t(siteCopy.common.getDirections)}
              </a>
              <Link
                to="/upashray-jinodhar"
                className="px-6 py-3 border border-[#c5a059] text-[#8f6d2f] uppercase tracking-[0.16em] text-[10px] font-bold hover:bg-[#f7f0df] transition-colors"
              >
                {t(siteCopy.common.backToList)}
              </Link>
            </div>
          </article>

          <article className="hidden lg:block light-panel light-panel-right light-card-image overflow-hidden">
            <SecureImage
              src={upashray.coverImage}
              alt={t(upashray.name)}
              containerClassName="w-full h-full min-h-[280px]"
              className="w-full h-full object-cover"
            />
          </article>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections.before)}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {beforeImages.map((imageSrc, index) => (
                <SecureImage
                  key={`${imageSrc}-${index}`}
                  src={imageSrc}
                  alt={`${t(upashray.name)} ${t(pageCopy.sections.before)}`}
                  containerClassName="w-full h-44 rounded-sm border border-gray-100"
                  className="w-full h-44 object-cover"
                />
              ))}
            </div>
          </article>

          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections.process)}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {processImages.map((imageSrc, index) => (
                <SecureImage
                  key={`${imageSrc}-${index}`}
                  src={imageSrc}
                  alt={`${t(upashray.name)} ${t(pageCopy.sections.process)}`}
                  containerClassName="w-full h-44 rounded-sm border border-gray-100"
                  className="w-full h-44 object-cover"
                />
              ))}
            </div>
          </article>

          <article className="light-panel-soft p-5">
            <h2 className="text-xl font-headline text-gray-900">{t(pageCopy.sections.after)}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {afterImages.map((imageSrc, index) => (
                <SecureImage
                  key={`${imageSrc}-${index}`}
                  src={imageSrc}
                  alt={`${t(upashray.name)} ${t(pageCopy.sections.after)}`}
                  containerClassName="w-full h-44 rounded-sm border border-gray-100"
                  className="w-full h-44 object-cover"
                />
              ))}
            </div>
          </article>
        </section>

        <section className="light-panel-soft p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-headline text-gray-900">{t(pageCopy.futureAnimationTitle)}</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">{t(upashray.futureAnimation.note)}</p>
        </section>
      </section>
    </LightPageShell>
  );
};

export default UpashrayDetailPage;
