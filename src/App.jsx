import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { siteCopy } from './content/siteCopy.js';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { useLanguage } from './context/LanguageContext.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutGirnarPage from './pages/AboutGirnarPage.jsx';
import UpashrayJirnodharPage from './pages/UpashrayJirnodharPage.jsx';
import JinalayJirnodharPage from './pages/JinalayJirnodharPage.jsx';
import UpashrayDetailPage from './pages/UpashrayDetailPage.jsx';
import JinalayDetailPage from './pages/JinalayDetailPage.jsx';
import MonthlyBusYatraPage from './pages/MonthlyBusYatraPage.jsx';
import MonthlyBusSponsorshipPage from './pages/MonthlyBusSponsorshipPage.jsx';
import YatraBookingPage from './pages/YatraBookingPage.jsx';
import YatraPaymentPage from './pages/YatraPaymentPage.jsx';
import YatraSuccessPage from './pages/YatraSuccessPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import ContactUsPage from './pages/ContactUsPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import MemberPanelPage from './pages/MemberPanelPage.jsx';
import PrintReportView from './pages/PrintReportView.jsx';

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
    <div key={location.pathname} className="route-transition-enter">
      <Routes location={location}>
        <Route path="/" element={withLazyBoundary(<HomePage />)} />
        <Route path="/about-girnar" element={withLazyBoundary(<AboutGirnarPage />)} />
        <Route path="/upashray-jirnodhar" element={withLazyBoundary(<UpashrayJirnodharPage />)} />
        <Route path="/jinalay-jirnodhar" element={withLazyBoundary(<JinalayJirnodharPage />)} />
        <Route path="/upashray-jirnodhar/:slug" element={withLazyBoundary(<UpashrayDetailPage />)} />
        <Route path="/jinalay-jirnodhar/:id" element={withLazyBoundary(<JinalayDetailPage />)} />
        <Route path="/monthly-bus-yatra" element={withLazyBoundary(<MonthlyBusYatraPage />)} />
        <Route path="/monthly-bus-yatra/sponsorship" element={withLazyBoundary(<MonthlyBusSponsorshipPage />)} />
        <Route path="/monthly-bus-yatra/booking/:yatraId" element={withLazyBoundary(<YatraBookingPage />)} />
        <Route path="/monthly-bus-yatra/payment" element={withLazyBoundary(<YatraPaymentPage />)} />
        <Route path="/monthly-bus-yatra/success" element={withLazyBoundary(<YatraSuccessPage />)} />
        <Route path="/events" element={withLazyBoundary(<EventsPage />)} />
        <Route path="/contact-us" element={withLazyBoundary(<ContactUsPage />)} />
        <Route path="/admin/*" element={withLazyBoundary(<AdminPanelPage />)} />
        <Route path="/member/*" element={withLazyBoundary(<MemberPanelPage />)} />
        <Route path="/print-report/:id" element={withLazyBoundary(<PrintReportView />)} />
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
