import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, upashraysDB, upashrayMediaDB } from '../lib/database.js';

const parseLocation = (locStr) => {
  if (!locStr) return null;
  const match = locStr.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[3])];
  }
  const urlMatch = locStr.match(/@(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
  if (urlMatch) {
    return [parseFloat(urlMatch[1]), parseFloat(urlMatch[3])];
  }
  return null;
};

const createCustomIcon = (delay, idx = 0, isMobile = false) => {
  // 4 main directions: Top, Right, Bottom, Left
  const directions = [
    { x: 0, y: -80 },   // Top
    { x: 80, y: 0 },    // Right
    { x: 0, y: 80 },    // Bottom
    { x: -80, y: 0 }    // Left
  ];
  const dir = directions[idx % 4];
  const startX = dir.x;
  const startY = dir.y;

  const animationStyle = `animation: pin-drop 0.9s cubic-bezier(0.21, 0.82, 0.44, 1) forwards; animation-delay: ${delay}ms; --start-x: ${startX}px; --start-y: ${startY}px; will-change: transform, opacity;`;

  // Use a simple box-shadow or no filter on mobile to prevent horizontal line glitches
  const svgStyle = isMobile 
    ? '' 
    : 'filter: drop-shadow(0px 6px 3px rgba(0,0,0,0.4));';

  return L.divIcon({
    className: 'custom-pin-icon',
    html: `<div class="animate-pin-drop" style="${animationStyle}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="30" style="${svgStyle}">
              <path fill="#e32636" d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/>
              <circle fill="#ffffff" cx="192" cy="192" r="64"/>
            </svg>
          </div>`,
    iconSize: [20, 30],
    iconAnchor: [10, 30],
    popupAnchor: [0, -30],
  });
};

const MapBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const bounds = L.latLngBounds(locations);
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, map]);
  return null;
};

const statusClassNames = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  inProgress: 'bg-amber-100 text-amber-700 border-amber-200',
  planned: 'bg-slate-100 text-slate-700 border-slate-200',
  done: 'bg-green-100 text-green-700 border-green-200',
  process: 'bg-amber-100 text-amber-700 border-amber-200',
  plan: 'bg-slate-100 text-slate-700 border-slate-200',
};

const UpashrayJirnodharPage = () => {
  const { t } = useLanguage();
  const pageCopy = siteCopy.upashrayPage;
  const [upashrays, setUpashrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsRef = useRef(null);
  const shouldScrollRef = useRef(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  useEffect(() => {
    const updateViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const itemsPerPage = 6;

  const cacheKey = 'upashray_jirnodhar_page';

  const normalizeUpashrays = (data, media) => {
    const mediaByUpashrayId = media.reduce((acc, item) => {
      const upashrayId = String(item.upashray_id);
      if (!acc[upashrayId]) {
        acc[upashrayId] = [];
      }
      acc[upashrayId].push(item);
      return acc;
    }, {});

    return data.map((upashray) => {
      const upashrayMedia = mediaByUpashrayId[String(upashray.id)] || [];
      const coverImage =
        upashrayMedia.find((item) => item.media_type === 'before')?.file_url ||
        upashrayMedia[0]?.file_url ||
        '/images/Upasray.png';

      return {
        ...upashray,
        coverImage,
        slug: upashray.slug || upashray.id.toString(),
      };
    });
  };

  useEffect(() => {
    let cancelled = false;

    const loadUpashrays = async () => {
      try {
        const cachedUpashrays = dbCache.read(cacheKey);
        if (cachedUpashrays) {
          setUpashrays(cachedUpashrays);
          setLoading(false);
        }

        const [data, media] = await Promise.all([
          upashraysDB.getAll('id, name, village, route, slug, status, description, location, created_at'),
          upashrayMediaDB.getAll('id, upashray_id, media_type, file_url, sort_order, created_at')
        ]);

        const nextUpashrays = normalizeUpashrays(data || [], media || []);

        if (!cancelled) {
          setUpashrays(nextUpashrays);
          setError(null);
          dbCache.write(cacheKey, nextUpashrays);
        }
      } catch (err) {
        console.error('Error loading upashrays:', err);
        if (!dbCache.read(cacheKey)) {
          setError('Failed to load upashrays');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUpashrays();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [upashrays.length]);

  const totalPages = Math.max(1, Math.ceil(upashrays.length / itemsPerPage));
  const visibleUpashrays = upashrays.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const goToPageAndScroll = (nextPage) => {
    shouldScrollRef.current = true;
    goToPage(nextPage);
  };

  useEffect(() => {
    if (!shouldScrollRef.current) {
      return;
    }

    shouldScrollRef.current = false;
    const targetElement = listingsRef.current;
    if (!targetElement) {
      return;
    }

    const targetTop = window.scrollY + targetElement.getBoundingClientRect().top - 120;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  }, [currentPage]);

  const delayPerPin = Math.min(150, 4000 / Math.max(1, upashrays.length));

  const mapLocations = useMemo(() => {
    return upashrays.map(u => parseLocation(u.location)).filter(Boolean);
  }, [upashrays]);

  const mapMarkers = useMemo(() => {
    return upashrays.map((upashray, idx) => {
      const coords = parseLocation(upashray.location);
      if (!coords) return null;
      return (
        <Marker 
          key={upashray.id} 
          position={coords} 
          icon={createCustomIcon(idx * delayPerPin, idx, isMobileViewport)}
        >
          <Popup className="custom-popup">
            <div className="text-center p-1 flex flex-col items-center">
              <h3 className="font-headline font-bold text-[#7a5f2d] text-sm mb-1">{upashray.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">{upashray.village}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#c5a059] !text-white px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-[#b08d4a] transition-colors w-full shadow-sm mt-1 inline-flex items-center justify-center"
              >
                Direction
              </a>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [upashrays, delayPerPin]);

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
              
              <MapContainer 
                center={[21.1702, 72.8311]} 
                zoom={6} 
                scrollWheelZoom={false}
                dragging={!isMobileViewport || true} // Allow dragging on mobile
                touchZoom={true}
                tap={false} // Prevents double tap issues on some mobile devices
                className="w-full h-full z-10 relative"
                style={{ background: '#f9f7f2' }}
                whenReady={(e) => {
                  if (e.target && e.target.getContainer()) {
                    e.target.getContainer().parentElement.classList.add('loaded');
                  }
                }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapBounds locations={mapLocations} />
                {mapMarkers}
              </MapContainer>
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
          <section ref={listingsRef} className="space-y-6 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleUpashrays.map((upashray) => (
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
                        to={`/upashray-jirnodhar/${upashray.slug}`}
                        className="px-6 py-3 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#b08d4a] transition-colors"
                      >
                        {t(siteCopy.common.viewDetails)}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="flex flex-nowrap items-center justify-center gap-2 overflow-x-auto max-w-full pb-1">
                  <button
                    type="button"
                    onClick={() => goToPageAndScroll(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#ddd2b7] text-gray-700 bg-white rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#8f6d2f] transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      className={`shrink-0 min-w-10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-sm transition-colors ${
                        pageNumber === currentPage
                          ? 'bg-[#c5a059] border-[#c5a059] text-white'
                          : 'bg-white border-[#ddd2b7] text-gray-700 hover:border-[#c5a059] hover:text-[#8f6d2f]'
                      }`}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPageAndScroll(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="shrink-0 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[#ddd2b7] text-gray-700 bg-white rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c5a059] hover:text-[#8f6d2f] transition-colors"
                  >
                    Next
                  </button>
                </div>

                <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#8f6d2f] font-bold opacity-70">
                  Showing {visibleUpashrays.length} of {upashrays.length} records
                </p>
              </div>
            )}
          </section>
        )}
      </section>
    </LightPageShell>
  );
};

export default UpashrayJirnodharPage;
