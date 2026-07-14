import { useRef, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LightPageShell } from '../components/LightPageShell.jsx';
import SecureImage from '../components/SecureImage.jsx';
import { siteCopy } from '../content/siteCopy.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { dbCache, jinalayasDB } from '../lib/database.js';
import { getSafeImageUrl } from '../utils/imageUtils.js';

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
  const directions = [
    { x: 0, y: -80 },
    { x: 80, y: 0 },
    { x: 0, y: 80 },
    { x: -80, y: 0 }
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

const JinalayJirnodharPage = () => {
  const { t } = useLanguage();
  const [jinalayas, setJinalayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
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

  const cacheKey = 'jinalay_jirnodhar_page';

  const sanitizeJinalaya = (item) => ({
    ...item,
    coverImage: getSafeImageUrl(item?.coverImage, '/images/Upasray.png'),
  });

  useEffect(() => {
    let cancelled = false;

    const loadJinalayas = async () => {
      try {
        const cachedJinalayas = dbCache.read(cacheKey);
        if (cachedJinalayas) {
          setJinalayas(cachedJinalayas.map(sanitizeJinalaya));
          setLoading(false);
        }

        const data = await jinalayasDB.getAll();
        const processed = data.map(j => ({
          ...j,
          coverImage: getSafeImageUrl(j.after_img || j.process_img || j.before_img, '/images/Upasray.png')
        }));

        if (!cancelled) {
          setJinalayas(processed.map(sanitizeJinalaya));
          setError(null);
          dbCache.write(cacheKey, processed.map(sanitizeJinalaya));
        }
      } catch (err) {
        console.error('Error loading jinalayas:', err);
        if (!dbCache.read(cacheKey)) {
          setError('Failed to load jinalayas');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJinalayas();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredJinalayas = useMemo(() => {
    if (!searchQuery.trim()) return jinalayas;
    const lowerQuery = searchQuery.toLowerCase();
    return jinalayas.filter(j =>
      j.name?.toLowerCase().includes(lowerQuery) ||
      j.village?.toLowerCase().includes(lowerQuery)
    );
  }, [jinalayas, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJinalayas.length, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredJinalayas.length / itemsPerPage));
  const visibleJinalayas = filteredJinalayas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const delayPerPin = Math.min(150, 4000 / Math.max(1, jinalayas.length));
  const pinIconsRef = useRef({});

  const getVisiblePageNumbers = () => {
    const maxVisible = 4;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const mapLocations = useMemo(() => {
    return filteredJinalayas.map(j => parseLocation(j.location)).filter(Boolean);
  }, [filteredJinalayas]);

  const mapMarkers = useMemo(() => {
    return filteredJinalayas.map((jinalaya) => {
      const coords = parseLocation(jinalaya.location);
      if (!coords) return null;

      const originalIdx = jinalayas.findIndex(j => j.id === jinalaya.id);
      if (!pinIconsRef.current[jinalaya.id]) {
        pinIconsRef.current[jinalaya.id] = createCustomIcon(originalIdx * delayPerPin, originalIdx, isMobileViewport);
      }

      return (
        <Marker
          key={jinalaya.id}
          position={coords}
          icon={pinIconsRef.current[jinalaya.id]}
        >
          <Popup className="custom-popup">
            <div className="text-center p-1 flex flex-col items-center">
              <h3 className="font-headline font-bold text-[#7a5f2d] text-sm mb-1">{jinalaya.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">{jinalaya.village}</p>
              <div className="flex flex-col gap-2 w-full mt-1">
                <Link
                  to={`/jinalay-jirnodhar/${jinalaya.id}`}
                  className="bg-transparent border border-[#c5a059] !text-[#c5a059] px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-[#c5a059] hover:!text-white transition-colors w-full shadow-sm inline-flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#c5a059] !text-white px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-[#b08d4a] transition-colors w-full shadow-sm inline-flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  Direction
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [jinalayas, delayPerPin]);
  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
            {t(siteCopy.navItems.find(i => i.key === 'jirnodhar')?.dropdown?.find(d => d.key === 'jinalay')?.label) || 'Jinalay Jirnodhar'}
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">
            {t(siteCopy.navItems.find(i => i.key === 'jirnodhar')?.dropdown?.find(d => d.key === 'jinalay')?.label) || 'Jinalay Jirnodhar'}
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-4xl leading-relaxed">
            Our group is dedicated to the restoration and maintenance of sacred Jinalayas. Explore our ongoing and completed Jinalay projects across various routes.
          </p>
        </header>

        {/* Interactive Map Section */}
        <section className="light-panel min-h-[400px] md:min-h-[600px] p-6 md:p-10 flex flex-col items-center justify-center bg-white border border-[#ddd2b7] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 w-full h-full flex flex-col items-center">
            <h2 className="text-xl md:text-2xl font-headline text-[#7a5f2d] mb-8 uppercase tracking-widest opacity-80">Jinalay Locations & Tirth Network</h2>

            <div className="w-full h-[350px] md:h-[500px] rounded-sm overflow-hidden border border-[#c5a059]/30 shadow-inner bg-[#f9f7f2] relative group">
              <div className="absolute inset-0 flex items-center justify-center bg-[#f9f7f2] animate-pulse group-[.loaded]:hidden">
                <span className="text-[#c5a059] font-headline text-xs tracking-widest animate-bounce">Loading Sacred Map...</span>
              </div>

              <MapContainer
                center={[21.1702, 72.8311]}
                zoom={6}
                scrollWheelZoom={false}
                dragging={!isMobileViewport || true}
                touchZoom={true}
                tap={false}
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

        {/* Search Bar Section */}
        <section className="px-6 md:px-0 flex justify-center md:justify-end">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search by name or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 border border-[#ddd2b7] bg-white rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:border-[#c5a059] shadow-sm transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
        ) : filteredJinalayas.length === 0 ? (
          <section className="light-panel light-panel-left p-6 md:p-10 text-center">
            <p className="text-gray-600 italic">{searchQuery ? 'No Jinalayas match your search.' : 'No Jinalaya records found. Check back later for updates.'}</p>
          </section>
        ) : (
          <section ref={listingsRef} className="space-y-6 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleJinalayas.map((jinalaya) => (
                <article key={jinalaya.id} className="light-panel-soft light-card-image overflow-hidden bg-white border border-[#ddd2b7] shadow-sm hover:shadow-md transition-shadow">
                  <SecureImage
                    src={jinalaya.coverImage}
                    alt={jinalaya.name}
                    containerClassName="w-full h-52"
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xl md:text-2xl font-headline text-gray-900 leading-tight">{jinalaya.name}</h2>
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-bold rounded-full border shrink-0 ${statusClassNames[jinalaya.status] ?? statusClassNames.planned
                          }`}
                      >
                        {t(siteCopy.statuses[jinalaya.status] || jinalaya.status)}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-1">
                      <p className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{jinalaya.village}</p>
                      {jinalaya.mulnayak && (
                        <p className="text-xs text-gray-500 italic">Mulnayak: {jinalaya.mulnayak}</p>
                      )}
                    </div>

                    <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {jinalaya.description || "Sacred restoration work in progress to preserve our divine heritage."}
                    </p>

                    <div className="mt-5">
                      <Link
                        to={`/jinalay-jirnodhar/${jinalaya.id}`}
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

                  {getVisiblePageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => goToPage(pageNumber)}
                      className={`shrink-0 min-w-10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest border rounded-sm transition-colors ${pageNumber === currentPage
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
                  Showing {visibleJinalayas.length} of {filteredJinalayas.length} records
                </p>
              </div>
            )}
          </section>
        )}
      </section>
    </LightPageShell>
  );
};

export default JinalayJirnodharPage;
