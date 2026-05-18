import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { siteCopy } from './content/siteCopy.js';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { useLanguage } from './context/LanguageContext.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutGirnarPage = lazy(() => import('./pages/AboutGirnarPage.jsx'));
const UpashrayJinodharPage = lazy(() => import('./pages/UpashrayJinodharPage.jsx'));
const JinalayJinodharPage = lazy(() => import('./pages/JinalayJinodharPage.jsx'));
const UpashrayDetailPage = lazy(() => import('./pages/UpashrayDetailPage.jsx'));
const MonthlyBusYatraPage = lazy(() => import('./pages/MonthlyBusYatraPage.jsx'));
const EventsPage = lazy(() => import('./pages/EventsPage.jsx'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage.jsx'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage.jsx'));
const MemberPanelPage = lazy(() => import('./pages/MemberPanelPage.jsx'));

const RouteLoadingFallback = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-6 text-center">
      <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-8">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-[#8f6d2f] text-xs uppercase tracking-[0.2em] font-bold">{t(siteCopy.common.loadingPage)}</p>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

const withLazyBoundary = (element) => <Suspense fallback={<RouteLoadingFallback />}>{element}</Suspense>;

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.key} className="route-transition-enter">
      <Routes location={location}>
        <Route path="/" element={withLazyBoundary(<HomePage />)} />
        <Route path="/about-girnar" element={withLazyBoundary(<AboutGirnarPage />)} />
        <Route path="/upashray-jinodhar" element={withLazyBoundary(<UpashrayJinodharPage />)} />
        <Route path="/jinalay-jinodhar" element={withLazyBoundary(<JinalayJinodharPage />)} />
        <Route path="/upashray-jinodhar/:slug" element={withLazyBoundary(<UpashrayDetailPage />)} />
        <Route path="/monthly-bus-yatra" element={withLazyBoundary(<MonthlyBusYatraPage />)} />
        <Route path="/events" element={withLazyBoundary(<EventsPage />)} />
        <Route path="/contact-us" element={withLazyBoundary(<ContactUsPage />)} />
        <Route path="/admin" element={withLazyBoundary(<AdminPanelPage />)} />
        <Route path="/member" element={withLazyBoundary(<MemberPanelPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
