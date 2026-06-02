import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import { upashraysDB, membersDB, jinalayasDB, checkingReportsDB, adminProfilesDB, yatrikRegistrationsDB, yatraDatesDB, upashrayMediaDB, paymentIntentsDB, uploadWebPImage } from '../lib/database.js';
import { dbCache } from '../lib/database.js';
import LoginForm from './auth/LoginForm';
import LoadingOverlay from './auth/LoadingOverlay';
import AdminPanel from './admin/AdminPanel';
import MemberPanel from './member/MemberPanel';
import ConfirmModal from './ConfirmModal.jsx';
import TopLineLoader from './TopLineLoader.jsx';
import ToastViewport from './ToastViewport.jsx';
import { generateMemberCode } from '../utils/memberUtils.js';
import { formatDateForDisplay } from '../utils/dateUtils.js';
import { getPersistableImageUrl, getSafeImageUrl } from '../utils/imageUtils.js';
const ADMIN_CREDENTIALS = {
  email: 'GirnarTirthYatraGroup@gmail.com',
  password: 'Girnar@22'
};

const PORTAL_CACHE_KEY = 'girnar_portal_state_v1';

const ADMIN_TABS = new Set([
  'upashrays',
  'jinalayas',
  'members',
  'reports',
  'bus-yatra',
  'sponsorships',
  'sponsor-payments',
]);

const resolveAdminTabFromPath = (pathname) => {
  const pathParts = pathname.split('/').filter(Boolean);
  const candidateTab = pathParts[0] === 'admin' ? pathParts[1] : null;
  if (candidateTab === 'sponsorships') return 'sponsor-payments';
  return candidateTab && ADMIN_TABS.has(candidateTab) ? candidateTab : 'upashrays';
};

export const AuthView = ({ onBack, initialView = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fast-track state initialization: Check for session override synchronously
  // This removes the 0.5s delay by deciding the view BEFORE the first render
  const [view, setView] = useState(() => {
    const override = localStorage.getItem('auth_override');
    if (override === initialView) return initialView;
    return 'login';
  });
  
  const [isInitializing, setIsInitializing] = useState(() => {
    const override = localStorage.getItem('auth_override');
    // If we have an override, we don't need to show the "Checking Session" screen at all
    return override !== initialView;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [upashrays, setUpashrays] = useState([]);
  const [jinalayas, setJinalayas] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentMemberId, setCurrentMemberId] = useState(() => {
    return localStorage.getItem('auth_member_id') || null;
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState(() => resolveAdminTabFromPath(window.location.pathname)); // 'upashrays', 'members', 'jinalayas', 'reports', 'bus-yatra', 'sponsorships', 'sponsor-payments'
  const [allReports, setAllReports] = useState([]);
  const [busRegistrations, setBusRegistrations] = useState([]);
  const [yatraDates, setYatraDates] = useState([]);
  const [paymentIntents, setPaymentIntents] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [memberActiveTab, setMemberActiveTab] = useState('upashray-reports');

  // Report Filters
  const [reportUpashrayFilter, setReportUpashrayFilter] = useState('all');
  const [reportMemberFilter, setReportMemberFilter] = useState('all');
  const [reportDateFilter, setReportDateFilter] = useState('');

  // Sync state with URL on mount and location change
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const role = pathParts[0]; // 'admin' or 'member'
    const tab = pathParts[1];

    if (view === 'admin' && role === 'admin') {
      const nextTab = resolveAdminTabFromPath(location.pathname);
      if (!tab) {
        navigate('/admin/upashrays', { replace: true });
      } else if (nextTab !== activeTab) {
        setActiveTab(nextTab);
      }
    } else if (view === 'member' && role === 'member') {
      if (!tab) {
        navigate('/member/upashray-reports', { replace: true });
      } else if (tab !== memberActiveTab) {
        setMemberActiveTab(tab);
      }
    }
  }, [location.pathname, view, navigate]);

  const [upashraySearch, setUpashraySearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [jinalayaSearch, setJinalayaSearch] = useState('');
  const [yatraSearch, setYatraSearch] = useState('');
  const [registrationYatraFilter, setRegistrationYatraFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingJinalayaId, setEditingJinalayaId] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isJinalayaModalOpen, setIsJinalayaModalOpen] = useState(false);
  const [checkingUpashrayId, setCheckingUpashrayId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing...');

  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({
    open: false, title: '', message: '', confirmLabel: 'Confirm', cancelLabel: 'Cancel', danger: false, onConfirm: () => {}
  });

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4000);
  };

  const requestConfirmation = (options) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true, title: options.title || 'Confirm', message: options.message || 'Are you sure?',
        confirmLabel: options.confirmLabel || 'Confirm', cancelLabel: options.cancelLabel || 'Cancel',
        danger: options.danger || false,
        onConfirm: () => { setConfirmState(prev => ({ ...prev, open: false })); resolve(true); },
        onCancel: () => { setConfirmState(prev => ({ ...prev, open: false })); resolve(false); }
      });
    });
  };

  // Overlay threshold state to prevent blinking
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isProcessing || isLoadingData || isInitializing) {
      timeoutId = setTimeout(() => {
        setShowOverlay(true);
      }, 300); // 300ms threshold
    } else {
      setShowOverlay(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isProcessing, isLoadingData, isInitializing]);

  const CHECKING_POINTS = [
    "ઉપાશ્રય ના મેઈનગેટ - તથા દરેક રૂમના દરવાજા મિજાગરાના હોલડ્રોપ ચેક કરવા બરાબર ફિટ છે કે નહિ તે લખવું",
    "ઉપાશ્રય ના દરેક બારીઓમાં સ્ટ્રોપર - કાચ ચેક કરવા.",
    "ઉપાશ્રય ના રૂમનું ફ્લોરીંગ - તુટેલું કે બેસી ગયેલ છે ચેક કરવું.",
    "ઉપાશ્રય ની દિવાલ ટાઈલ્સ - ફાટી ગયેલ - તુટી ગયેલ ચેક કરવી.",
    "અગાસીમાં સાફ - સફાઈ ઝાડવા ઉગેલા છે તે ચેક કરવું.",
    "અગાસીમાં પાણી જવાની જગ્યા ચેક કરવી સાફ કરાવવી.",
    "અગાસીમાં જવા માટે દાદર કોઈ જગ્યા એ બનાવવા ના બાકી હોય તો લખવું.",
    "ઉપાશ્રયના રૂમમાં દોરી બાંધવાના હુક - ઘડિયાળ ચેક કરવા.",
    "પાર્કિંગ માં સફાઈ - ઝાડ ઉગ્યા હોય તો ચેક કરવું.",
    "માતૃ ઠલ્લે બેસવા ના બાથરૂમ ની સફાઈ ચેક કરવી.",
    "ટોઈલેટ - બાથરૂમ માં સફાઈ તથા પાણી આવે છે કે નહિ તે ચેક કરવું.",
    "માતૃ પરઠવા કુંડી ઠલ્લે પરઠવા ખાળકુવા બનાવવાના બાકી હોય તો તે લખવું.",
    "દરેક ઉપાશ્રય ના કમ્પાઉન્ડ માં કેમેરા ફીટ કરવા. જ્યાં યોગ્ય લાગે તે જગ્યા એ પણ કેમેરા મૂકવા.",
    "દરેક ઉપાશ્રય વિહાર રૂટનું બોર્ધ - ફોટા મૂકવાના (બાકી હોય ત્યાં)",
    "ઘડિયાળ મૂકવાની.",
    "વિહાર બુક મૂકવી.",
    "આખા ઉપાશ્રય માં તિરાડો પડેલ છે કે નહિ તે ચેક કરવું",
    "આખા ઉપાશ્રય નું કલર કામ ચેક કરવું પોપડા ખરચ્યા છે કે બરાબર તે ચેક કરવું."
  ];

  const JINALAYA_CHECKING_POINTS = [
    'જિનાલયનું મુખ્ય દ્વાર અને બનાવટ સ્થિતિ ચેક કરો',
    'મૂળનાયકની મૂર્તિ અને અભિષેક જગ્યા સફાઈ અને નમાજગી ચેક કરો',
    'પ્રકાશ (લાઇટિંગ) અને વાયરિંગનું સલામત કનેક્શન ચેક કરો',
    'ફ્લોરિંગ અને સિડીની ક્ષતિઓ તપાસો',
    'પ્રદર્શિત ફોટા અને બોર્ડ યોગ્ય રીતે ફિટ છે કે નહીં ચેક કરો',
    'પ્રસાદ અને સેવાઓ માટે વ્યવસ્થા અને ગુણવત્તા તપાસો',
    'પાણીની સ્રોત અને ટોયલેટ સુવિધાઓ કાર્યરત છે કે નહી તપાસો',
    'આસપાસની સફાઈ અને કચરો વ્યવસ્થા ચેક કરો',
    'સુરક્ષા કૅમેરા અને ચોરાવચોર વ્યવસ્થા ઉપલબ્ધ છે તો ચેક કરો',
    'દાન માટે નોટ બુક અને પારદર્શિતા ચેક કરો',
    'મૂર્તિની આસપાસની દ્રષ્ટિ અને ગંધ-માલિન્ય તપાસો',
    'બાગબગીચાની દેખभાળ અને જાળવણી ચેક કરો',
    'મંદિરની દીવાલો, રંગ અને મૂર્તિ સંરક્ષણ તપાસો',
    'સંકુચિત પ્રવેશ અને આક્સેસ માર્ગ ચલાવવા યોગ્ય છે કે નહીં તપાસો',
    'ફરીથી જોખમ સૂચવવા માટે કોઈ તાત્કાલિક મરામત સૂચવો'
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Adding/Editing Upashray
  const [formData, setFormData] = useState({
    name: '', village: '', route: '', trusty: '', mobile: '', location: '', description: '', slug: '',
    beforeFiles: [], processFiles: [], afterFiles: [], status: 'plan'
  });

  // Form State for Adding/Editing Member
  const [memberFormData, setMemberFormData] = useState({
    name: '', email: '', phone: '', password: '', hasAccess: false
  });

  // Form State for Adding/Editing Jinalaya
  const [jinalayaFormData, setJinalayaFormData] = useState({
    name: '', village: '', route: '', mulnayak: '', location: '', description: '',
    beforeFile: null, processFile: null, afterFile: null,
    beforeFiles: [], processFiles: [], afterFiles: [], status: 'plan'
  });

  // Form State for Yatra Dates
  const [yatraDateFormData, setYatraDateFormData] = useState({
    date_text: '', description: '', image: '', registration_open: true, max_capacity: ''
  });
  const [isYatraDateModalOpen, setIsYatraDateModalOpen] = useState(false);
  const [editingYatraDateId, setEditingYatraDateId] = useState(null);

  // State for Checking Report
  const [checkingReport, setCheckingReport] = useState(CHECKING_POINTS.map((point, index) => ({
    id: index, point, description: '', isChecked: false, images: []
  })));
  const [generalNotes, setGeneralNotes] = useState('');
  const [checkingJinalayaId, setCheckingJinalayaId] = useState(null);

  // Populate correct checklist when opening a check modal for Upashray or Jinalaya
  useEffect(() => {
    if (checkingUpashrayId) {
      setCheckingReport(CHECKING_POINTS.map((point, index) => ({ id: index, point, description: '', isChecked: false, images: [] })));
      setGeneralNotes('');
    } else if (checkingJinalayaId) {
      setCheckingReport(JINALAYA_CHECKING_POINTS.map((point, index) => ({ id: index, point, description: '', isChecked: false, images: [] })));
      setGeneralNotes('');
    }
  }, [checkingUpashrayId, checkingJinalayaId]);

  // Cache Utilities
  const readPortalCache = () => {
    try {
      const raw = localStorage.getItem(PORTAL_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.state || null;
    } catch { return null; }
  };

  const writePortalCache = (state) => {
    try {
      localStorage.setItem(PORTAL_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), state }));
    } catch { }
  };

  const applyPortalState = (state) => {
    if (!state) return;
    if (state.busRegistrations) setBusRegistrations(state.busRegistrations);
    if (state.yatraDates) setYatraDates(state.yatraDates);
    if (state.upashrays) {
      setUpashrays(state.upashrays.map((u) => ({
        ...u,
        beforeImg: getSafeImageUrl(u.beforeImg, '/images/Upasray.png'),
        processImg: getSafeImageUrl(u.processImg, '/images/Upasray.png'),
        afterImg: getSafeImageUrl(u.afterImg, '/images/Upasray.png'),
      })));
    }
    if (state.members) setMembers(state.members);
    if (state.jinalayas) {
      setJinalayas(state.jinalayas.map((j) => ({
        ...j,
        beforeImg: getSafeImageUrl(j.beforeImg, '/images/Upasray.png'),
        processImg: getSafeImageUrl(j.processImg, '/images/Upasray.png'),
        afterImg: getSafeImageUrl(j.afterImg, '/images/Upasray.png'),
      })));
    }
    if (state.allReports) setAllReports(state.allReports);
  };

  // Modular Data Loading
  const [loadedData, setLoadedData] = useState({
    upashrays: false, members: false, jinalayas: false, reports: false, busYatra: false, sponsorships: false
  });

  const loadUpashrays = async () => {
    try {
      const data = await upashraysDB.getAll();
      const processed = data.map(u => ({
        ...u,
        name: u.name || '', village: u.village || '', route: u.route || '',
        beforeImg: getSafeImageUrl(u.before_img, '/images/Upasray.png'),
        processImg: getSafeImageUrl(u.process_img, '/images/Upasray.png'),
        afterImg: getSafeImageUrl(u.after_img, '/images/Upasray.png'),
        reports: []
      }));
      
      // Update state
      setUpashrays(processed);
      setLoadedData(prev => ({ ...prev, upashrays: true }));
      
      // Update Cache immediately
      updateCache({ upashrays: processed });
      
      return processed;
    } catch (e) { 
      console.error(e); 
      return [];
    }
  };

  const loadUpashrayReports = async () => {
    const reports = await loadReports();
    if (reports && reports.length > 0) {
      processUpashrayReports(reports);
    }
  };

  const loadMembers = async () => {
    try {
      const data = await membersDB.getAll();
      const processed = data.map(m => ({ ...m, hasAccess: !!m.has_access }));
      setMembers(processed);
      setLoadedData(prev => ({ ...prev, members: true }));
      updateCache({ members: processed });
      return processed;
    } catch (e) { console.error(e); return []; }
  };

  const loadJinalayas = async () => {
    try {
      const data = await jinalayasDB.getAll();
      const processed = data.map(j => ({
        ...j,
        beforeImg: getSafeImageUrl(j.before_img, '/images/Upasray.png'),
        processImg: getSafeImageUrl(j.process_img, '/images/Upasray.png'),
        afterImg: getSafeImageUrl(j.after_img, '/images/Upasray.png')
      }));
      setJinalayas(processed);
      setLoadedData(prev => ({ ...prev, jinalayas: true }));
      updateCache({ jinalayas: processed });
      return processed;
    } catch (e) { console.error(e); return []; }
  };

  const loadReports = async () => {
    try {
      // Fetch reports, upashrays, and members in parallel for speed
      const [reportsData, upashraysData, membersData, jinalayasData] = await Promise.all([
        checkingReportsDB.getAll(),
        upashraysDB.getAll(),
        membersDB.getAll(),
        jinalayasDB.getAll()
      ]);
      
      const processed = reportsData.map(r => {
        const member = membersData.find(m => String(m.id) === String(r.member_id));
        if (r.upashray_id) {
          const upashray = upashraysData.find(u => String(u.id) === String(r.upashray_id));
          return {
            ...r,
            entityType: 'upashray',
            entityName: upashray ? upashray.name : 'Unknown Upashray',
            village: upashray ? upashray.village : 'Unknown Location',
            route: upashray ? upashray.route : '',
            memberName: member ? member.name : 'Unknown Member',
            date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
          };
        } else if (r.jinalaya_id) {
          const jinalaya = jinalayasData.find(j => String(j.id) === String(r.jinalaya_id));
          return {
            ...r,
            entityType: 'jinalaya',
            entityName: jinalaya ? jinalaya.name : 'Unknown Jinalaya',
            village: jinalaya ? jinalaya.village : 'Unknown Location',
            route: jinalaya ? jinalaya.route : '',
            memberName: member ? member.name : 'Unknown Member',
            date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
          };
        }
        return {
          ...r,
          entityType: 'unknown',
          entityName: 'Unknown',
          memberName: member ? member.name : 'Unknown Member',
          date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
        };
      });
      
      setAllReports(processed);
      setLoadedData(prev => ({ ...prev, reports: true }));
      updateCache({ allReports: processed });
      return processed;
    } catch (e) { 
      console.error('Failed to load reports:', e); 
      return []; 
    }
  };

  const loadBusYatra = async () => {
    try {
      const [busData, datesData] = await Promise.all([
        yatrikRegistrationsDB.getAll(), yatraDatesDB.getAll()
      ]);
      const processedDates = datesData.map(d => ({
        ...d,
        date_text: d.trip_date ? formatDateForDisplay(d.trip_date) : d.date_text || '',
        registration_open: d.registration_open !== false,
        max_capacity: d.max_capacity ?? null,
      }));
      setBusRegistrations(busData);
      setYatraDates(processedDates);
      setLoadedData(prev => ({ ...prev, busYatra: true }));
      updateCache({ busRegistrations: busData, yatraDates: processedDates });
      return { busData, processedDates };
    } catch (e) { console.error(e); return { busData: [], processedDates: [] }; }
  };

  const loadPaymentIntents = async () => {
    try {
      const intents = await paymentIntentsDB.getAll();
      const processed = intents.map((intent) => ({
        ...intent,
        createdAtLabel: intent.created_at ? new Date(intent.created_at).toLocaleString() : 'N/A',
        paymentLabel: intent.gateway_payment_id || intent.gateway_order_id || 'Pending',
      }));
      setPaymentIntents(processed);
      setLoadedData(prev => ({ ...prev, sponsorships: true }));
      updateCache({ paymentIntents: processed });
      return processed;
    } catch (e) {
      console.error('Failed to load payment intents:', e);
      return [];
    }
  };

  const updateCache = (newState) => {
    const currentCache = readPortalCache() || {};
    writePortalCache({ ...currentCache, ...newState });
  };

  const loadAdminData = async () => {
    const cached = readPortalCache();
    if (cached) applyPortalState(cached);
    
    // We only show the full screen loader if we don't have cached upashrays
    if (!cached || !cached.upashrays || cached.upashrays.length === 0) {
      setIsLoadingData(true);
      setProcessingMessage('Loading Portal Data...');
    }

    // Load essential data first
    await loadUpashrays();
    setIsLoadingData(false);
    
    // Load others in background
    loadAllDataInBackground();
  };

  const loadMemberData = async () => {
    const cached = readPortalCache();
    if (cached) applyPortalState(cached);

    if (!cached || !cached.upashrays || cached.upashrays.length === 0) {
      setIsLoadingData(true);
      setProcessingMessage('Loading Member Portal...');
    }

    await loadUpashrays();
    setIsLoadingData(false);

    loadAllDataInBackground();
  };

  const processUpashrayReports = (reports) => {
    const reportsByEntity = {};
    reports.forEach(r => {
      const key = r.entityType && r.entityType === 'jinalaya' ? `j_${r.jinalaya_id}` : `u_${r.upashray_id}`;
      if (!reportsByEntity[key]) reportsByEntity[key] = [];
      reportsByEntity[key].push({ ...r, title: 'Checking Report', date: r.date || (r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A') });
    });

    setUpashrays(prev => {
      const updated = prev.map(u => ({ ...u, reports: reportsByEntity[`u_${u.id}`] || [] }));
      updateCache({ upashrays: updated });
      return updated;
    });

    setJinalayas(prev => {
      const updated = prev.map(j => ({ ...j, reports: reportsByEntity[`j_${j.id}`] || [] }));
      updateCache({ jinalayas: updated });
      return updated;
    });
  };

  const loadAllDataInBackground = async () => {
    if (view === 'admin' || initialView === 'admin') {
      // Load most critical background data first
      await loadMembers();
      await loadJinalayas();
      
      // This will load reports and process them for upashrays in one go
      await loadUpashrayReports();
      
      loadBusYatra();
      loadPaymentIntents();
    } else {
      await loadUpashrayReports();
    }
  };

  const loadAllData = async () => {
    if (view === 'admin' || initialView === 'admin') {
      await loadAdminData();
    } else {
      await loadMemberData();
    }
  };

  // Initial Data Load and Session Verification
  useEffect(() => {
    let isMounted = true;

    // Immediately load data from cache if we are already "logged in" via fast-track
    if (!isInitializing) {
      loadAllData();
    }

    const checkSession = async () => {
      // 1. Supabase Session Check (Background verification)
      try {
        if (!supabase?.auth) {
          if (isMounted && isInitializing) {
            setView('login');
            setIsInitializing(false);
          }
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          // If no supabase session and no local override, force login
          const override = localStorage.getItem('auth_override');
          if (!override && isMounted) {
            setView('login');
          }
          if (isMounted) setIsInitializing(false);
          return;
        }

        const email = session.user.email?.toLowerCase() || '';
        const isDefaultAdminEmail = email === ADMIN_CREDENTIALS.email.toLowerCase();

        if (initialView === 'admin') {
          if (isDefaultAdminEmail) {
            if (isMounted) {
              setView('admin');
              setIsInitializing(false);
              loadAllData();
            }
          } else {
            const adminProfile = await adminProfilesDB.getByUserId(session.user.id).catch(() => null);
            if (adminProfile && ['admin', 'editor'].includes(adminProfile.role) && isMounted) {
              setView('admin');
              setIsInitializing(false);
              loadAllData();
            } else if (isMounted) {
              setView('login');
              setIsInitializing(false);
            }
          }
        } else if (initialView === 'member') {
          const memberRecord = await membersDB.getByEmail(email).catch(() => null);
          if (memberRecord?.has_access && isMounted) {
            setCurrentMemberId(memberRecord.id);
            setView('member');
            setIsInitializing(false);
            loadAllData();
          } else if (isMounted) {
            setView('login');
            setIsInitializing(false);
          }
        }
      } catch (err) { 
        console.error('Session verification error:', err);
        if (isMounted && isInitializing) {
          setView('login');
          setIsInitializing(false);
        }
      }
    };

    checkSession();
    return () => { isMounted = false; };
  }, [initialView]);

  const trySupabaseAuthLogin = async (normalizedEmail) => {
    try {
      if (!supabase || !supabase.auth) return false;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail, password
      });

      if (error || !data?.user) return false;

      const [adminProfile, memberRecord] = await Promise.all([
        adminProfilesDB.getByUserId(data.user.id).catch(() => null),
        membersDB.getByEmail(normalizedEmail).catch(() => null)
      ]);

      const isDefaultAdminEmail = normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase();

      if (initialView === 'admin' || isDefaultAdminEmail) {
        const canAccessAdmin = adminProfile && adminProfile.is_active !== false && ['admin', 'editor'].includes(adminProfile.role);

        if (canAccessAdmin || isDefaultAdminEmail) {
          setView('admin');
          setError('');
          navigate('/admin/upashrays');
          await loadAllData();
          return true;
        }

        await supabase.auth.signOut().catch(() => { });
        setError('You do not have admin access for this account');
        return true;
      } else if (initialView === 'member') {
        if (memberRecord && memberRecord.has_access) {
          setCurrentMemberId(memberRecord.id);
          setView('member');
          setError('');
          navigate('/member/upashray-reports');
          await loadAllData();
          return true;
        }
        await supabase.auth.signOut().catch(() => { });
        setError('You do not have member access for this account');
        return true;
      }
      return false;
    } catch (e) { console.error(e); return false; }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage('Authenticating...');
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const loggedInWithSupabase = await trySupabaseAuthLogin(normalizedEmail);
      if (loggedInWithSupabase) return;
    } catch (authError) { }

    if (initialView === 'admin') {
      if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('auth_override', 'admin');
        setView('admin');
        setError('');
        navigate('/admin/upashrays');
        await loadAllData();
      } else { setError('Admin credentials are wrong'); }
      setIsProcessing(false);
      return;
    }

    if (initialView === 'member') {
      try {
        const memberRecord = await membersDB.getByEmail(normalizedEmail).catch(() => null);
        if (memberRecord) {
          if (memberRecord.has_access && password === memberRecord.password) {
            setCurrentMemberId(memberRecord.id);
            localStorage.setItem('auth_override', 'member');
            localStorage.setItem('auth_member_id', memberRecord.id);
            
            // Load data BEFORE switching view to ensure a smooth transition
            setProcessingMessage('Loading your dashboard...');
            await loadAllData();
            
            setView('member');
            setError('');
            navigate('/member/upashray-reports');
          } else if (!memberRecord.has_access) {
            setError('Your account does not have access. Please contact Admin.');
          } else { setError('Member credentials are wrong'); }
        } else { setError('Member not found or access not granted'); }
      } catch (err) { 
        console.error('Login error:', err);
        setError('An error occurred during login'); 
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('auth_override', 'admin');
      
      setProcessingMessage('Loading Admin Portal...');
      await loadAllData();
      
      setView('admin');
      setError('');
      navigate('/admin/upashrays');
    } else { setError('Credentials are wrong'); }
    setIsProcessing(false);
  };

  const handleLogout = async () => {
    setIsProcessing(true);
    setProcessingMessage('Logging out...');
    localStorage.removeItem('auth_override');
    localStorage.removeItem('auth_member_id');
    localStorage.removeItem(PORTAL_CACHE_KEY);
    try {
      if (supabase && supabase.auth) await supabase.auth.signOut();
    } catch (e) { }
    setView('login');
    navigate(initialView === 'admin' ? '/admin' : '/member');
    setIsProcessing(false);
  };

  if (isInitializing) {
    // If we are fast-tracking or checking session, we use the threshold to avoid a blink
    return showOverlay ? <LoadingOverlay message="Checking Session..." /> : null;
  }

  const handleMultipleFilesChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ...files] }));
    }
  };

  const removeMediaFile = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const deleteExistingMedia = async (mediaId, category) => {
    const confirmed = await requestConfirmation({
      title: 'Delete this image?',
      message: 'This will permanently remove the image from the database and storage.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      danger: true
    });
    if (!confirmed) return;
    
    setIsProcessing(true);
    setProcessingMessage('Deleting media...');
    try {
      await upashrayMediaDB.delete(mediaId);
      const fieldName = `existing${category}Media`;
      setFormData(prev => ({ ...prev, [fieldName]: prev[fieldName].filter(m => m.id !== mediaId) }));
      await loadUpashrays();
      pushToast('Media removed successfully.', 'success');
    } catch (err) { pushToast('Failed to delete media.', 'error'); } finally { setIsProcessing(false); }
  };

  const deleteLegacyUpashrayMedia = async (id, category) => {
    const confirmed = await requestConfirmation({
      title: 'Delete this image?',
      message: 'This will permanently remove the image from the database.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      danger: true
    });
    if (!confirmed) return;
    
    setIsProcessing(true);
    setProcessingMessage('Deleting legacy media...');
    try {
      const dbField = category === 'before' ? 'before_img' : category === 'process' ? 'process_img' : 'after_img';
      const stateField = category === 'before' ? 'beforeImg' : category === 'process' ? 'processImg' : 'afterImg';
      
      await upashraysDB.update(id, { [dbField]: null });
      setFormData(prev => ({ ...prev, [stateField]: '/images/Upasray.png' }));
      setUpashrays(prev => prev.map(u => u.id === id ? { ...u, [stateField]: '/images/Upasray.png' } : u));
      dbCache.remove('upashray_jirnodhar_page');
      dbCache.remove(`upashray_detail_${id}`);
      pushToast('Legacy media removed successfully.', 'success');
    } catch (err) { pushToast('Failed to delete legacy media.', 'error'); } finally { setIsProcessing(false); }
  };

  const deleteJinalayaMedia = async (id, category) => {
    const confirmed = await requestConfirmation({
      title: 'Delete this image?',
      message: 'This will permanently remove the image from the database.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      danger: true
    });
    if (!confirmed) return;
    
    setIsProcessing(true);
    setProcessingMessage('Deleting media...');
    try {
      const dbField = category === 'before' ? 'before_img' : category === 'process' ? 'process_img' : 'after_img';
      const stateField = category === 'before' ? 'beforeImg' : category === 'process' ? 'processImg' : 'afterImg';
      
      await jinalayasDB.update(id, { [dbField]: null });
      setJinalayaFormData(prev => ({ ...prev, [stateField]: '/images/Upasray.png' }));
      setJinalayas(prev => prev.map(j => j.id === id ? { ...j, [stateField]: '/images/Upasray.png' } : j));
      dbCache.remove('jinalay_jirnodhar_page');
      dbCache.remove(`jinalay_detail_${id}`);
      pushToast('Media removed successfully.', 'success');
    } catch (err) { pushToast('Failed to delete media.', 'error'); } finally { setIsProcessing(false); }
  };

  const handleSaveUpashray = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingId ? 'Updating Upashray...' : 'Adding Upashray...');
    try {
      const upashrayData = {
        name: formData.name,
        village: formData.village,
        route: formData.route,
        description: formData.description,
        trusty: formData.trusty, mobile: formData.mobile, location: formData.location,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status.toLowerCase()
      };

      let upashrayId = editingId;
      let savedUpashray;
      if (editingId) {
        savedUpashray = await upashraysDB.update(editingId, upashrayData);
      } else {
        savedUpashray = await upashraysDB.create(upashrayData);
        upashrayId = savedUpashray.id;
      }

      const categories = [{ field: 'beforeFiles', label: 'Before' }, { field: 'processFiles', label: 'Process' }, { field: 'afterFiles', label: 'After' }];
      for (const cat of categories) {
        if (formData[cat.field] && formData[cat.field].length > 0) {
          setProcessingMessage(`Uploading ${cat.label} images...`);
          for (const file of formData[cat.field]) await upashrayMediaDB.upload(upashrayId, file, cat.label);
        }
      }

      const processedUpashray = {
        ...savedUpashray, name: savedUpashray.name || '', village: savedUpashray.village || '', route: savedUpashray.route || '',
        beforeImg: savedUpashray.before_img || '/images/Upasray.png',
        processImg: savedUpashray.process_img || '/images/Upasray.png',
        afterImg: savedUpashray.after_img || '/images/Upasray.png',
        reports: []
      };

      if (editingId) { setUpashrays(prev => prev.map(u => u.id === editingId ? { ...u, ...processedUpashray } : u)); }
      else { setUpashrays(prev => [processedUpashray, ...prev]); }
      dbCache.remove('upashray_jirnodhar_page');
      dbCache.remove(`upashray_detail_${upashrayId}`);
      loadUpashrayReports(); resetForm();
      pushToast(editingId ? 'Upashray updated successfully.' : 'Upashray created successfully.', 'success');
    } catch (err) { console.error('Failed to save upashray:', err); pushToast(err?.message || 'Failed to save upashray', 'error'); } finally { setIsProcessing(false); }
  };

  const startEdit = async (u) => {
    setIsProcessing(true);
    setProcessingMessage('Loading upashray details...');
    try {
      const media = await upashrayMediaDB.getByUpashrayId(u.id);
      setEditingId(u.id);
      setFormData({
        name: u.name || '',
        village: u.village || '',
        route: u.route || '',
        description: u.description || '',
        trusty: u.trusty || '', mobile: u.mobile || '',
        location: u.location || '', slug: u.slug || '', status: u.status || 'plan',
        beforeFiles: [], processFiles: [], afterFiles: [],
        existingBeforeMedia: media.filter(m => m.media_type === 'before'),
        existingProcessMedia: media.filter(m => m.media_type === 'process'),
        existingAfterMedia: media.filter(m => m.media_type === 'after'),
        beforeImg: u.beforeImg || '/images/Upasray.png',
        processImg: u.processImg || '/images/Upasray.png',
        afterImg: u.afterImg || '/images/Upasray.png'
      });
      setIsModalOpen(true);
    } catch (err) { } finally { setIsProcessing(false); }
  };

  const deleteUpashray = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Upashray?',
      message: 'Are you sure you want to delete this upashray? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalUpashrays = [...upashrays];
      setUpashrays(prev => prev.filter(u => u.id !== id));
      try { 
        await upashraysDB.delete(id); 
        pushToast('Upashray deleted successfully.', 'success');
      } catch (err) { 
        setUpashrays(originalUpashrays); 
        pushToast('Failed to delete upashray', 'error'); 
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', village: '', route: '', trusty: '', mobile: '', location: '', description: '', slug: '',
      beforeFiles: [], processFiles: [], afterFiles: [], status: 'plan'
    });
    setIsModalOpen(false);
  };

  // Member Handlers
  const handleSaveMember = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingMemberId ? 'Updating Member...' : 'Adding Member...');
    try {
      const data = {
        name: memberFormData.name, email: memberFormData.email.toLowerCase(), phone: memberFormData.phone,
        password: memberFormData.password, has_access: memberFormData.hasAccess,
        code: memberFormData.code || generateMemberCode(memberFormData.name, members)
      };
      let savedMember;
      if (editingMemberId) {
        savedMember = await membersDB.update(editingMemberId, data);
        setMembers(prev => prev.map(m => m.id === editingMemberId ? { ...savedMember, hasAccess: !!savedMember.has_access } : m));
      } else {
        savedMember = await membersDB.create(data);
        setMembers(prev => [{ ...savedMember, hasAccess: !!savedMember.has_access }, ...prev]);
      }
      resetMemberForm();
      pushToast(editingMemberId ? 'Member updated successfully.' : 'Member added successfully.', 'success');
    } catch (err) { pushToast('Failed to save member', 'error'); } finally { setIsProcessing(false); }
  };

  const startEditMember = (m) => {
    setEditingMemberId(m.id);
    setMemberFormData({
      name: m.name, email: m.email, phone: m.phone, password: m.password, hasAccess: m.hasAccess, code: m.code
    });
    setIsMemberModalOpen(true);
  };

  const toggleMemberAccess = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const confirmed = await requestConfirmation({
      title: member.hasAccess ? 'Revoke Access?' : 'Grant Access?',
      message: member.hasAccess 
        ? `Are you sure you want to revoke portal access for ${member.name}?` 
        : `Are you sure you want to grant portal access to ${member.name}?`,
      confirmLabel: member.hasAccess ? 'Revoke' : 'Grant',
      danger: member.hasAccess
    });
    if (!confirmed) return;

    setMembers(prev => prev.map(m => m.id === id ? { ...m, hasAccess: !m.hasAccess } : m));
    try { 
      await membersDB.update(id, { has_access: !member.hasAccess }); 
      pushToast(`Member access ${!member.hasAccess ? 'enabled' : 'disabled'} successfully.`, 'success');
    } catch (err) { 
      setMembers(prev => prev.map(m => m.id === id ? { ...m, hasAccess: member.hasAccess } : m));
      pushToast('Failed to toggle member access', 'error');
    }
  };

  const deleteMember = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Member?',
      message: 'Are you sure you want to delete this member? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalMembers = [...members];
      setMembers(prev => prev.filter(m => m.id !== id));
      try { 
        await membersDB.delete(id); 
        pushToast('Member deleted successfully.', 'success');
      } catch (err) { 
        setMembers(originalMembers); 
        pushToast('Failed to delete member', 'error'); 
      }
    }
  };

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberFormData({ name: '', email: '', phone: '', password: '', hasAccess: false });
    setIsMemberModalOpen(false);
  };

  // Jinalaya Handlers
  const handleSaveJinalaya = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingJinalayaId ? 'Updating Jinalaya...' : 'Adding Jinalaya...');
    try {
      const data = {
        name: jinalayaFormData.name,
        village: jinalayaFormData.village,
        route: jinalayaFormData.route,
        mulnayak: jinalayaFormData.mulnayak,
        description: jinalayaFormData.description,
        location: jinalayaFormData.location,
        status: jinalayaFormData.status.toLowerCase()
      };

      let savedJinalaya;
      if (editingJinalayaId) {
        savedJinalaya = await jinalayasDB.update(editingJinalayaId, data);
      } else {
        savedJinalaya = await jinalayasDB.create(data);
      }

      const imageFields = [
        { fileField: 'beforeFile', imageField: 'beforeImg', dbField: 'before_img', mediaType: 'before' },
        { fileField: 'processFile', imageField: 'processImg', dbField: 'process_img', mediaType: 'process' },
        { fileField: 'afterFile', imageField: 'afterImg', dbField: 'after_img', mediaType: 'after' }
      ];

      const imageUpdates = {};
      for (const field of imageFields) {
        const selectedFile = jinalayaFormData[field.fileField];
        if (selectedFile) {
          imageUpdates[field.dbField] = await uploadWebPImage({
            bucketName: 'jinalaya-media',
            folderName: 'jinalayas',
            recordId: savedJinalaya.id,
            file: selectedFile,
            mediaType: field.mediaType
          });
        } else {
          imageUpdates[field.dbField] = getPersistableImageUrl(jinalayaFormData[field.imageField]);
        }
      }

      if (Object.values(imageUpdates).some(Boolean)) {
        savedJinalaya = await jinalayasDB.update(savedJinalaya.id, imageUpdates);
      }

      const normalizedJinalaya = {
        ...savedJinalaya,
        beforeImg: getSafeImageUrl(savedJinalaya.before_img, '/images/Upasray.png'),
        processImg: getSafeImageUrl(savedJinalaya.process_img, '/images/Upasray.png'),
        afterImg: getSafeImageUrl(savedJinalaya.after_img, '/images/Upasray.png')
      };

      if (editingJinalayaId) {
        setJinalayas(prev => prev.map(j => j.id === editingJinalayaId ? normalizedJinalaya : j));
      } else {
        setJinalayas(prev => [normalizedJinalaya, ...prev]);
      }

      dbCache.remove('jinalay_jirnodhar_page');
      dbCache.remove(`jinalay_detail_${savedJinalaya.id}`);

      resetJinalayaForm();
      pushToast(editingJinalayaId ? 'Jinalaya updated successfully.' : 'Jinalaya added successfully.', 'success');
    } catch (err) { console.error('Failed to save jinalaya:', err); pushToast(err?.message || 'Failed to save jinalaya', 'error'); } finally { setIsProcessing(false); }
  };

  const startEditJinalaya = (j) => {
    setEditingJinalayaId(j.id);
    setJinalayaFormData({
      name: j.name || '',
      village: j.village || '',
      route: j.route || '',
      mulnayak: j.mulnayak || '',
      description: j.description || '',
      location: j.location || '', status: j.status || 'plan',
      beforeFile: null, processFile: null, afterFile: null,
      beforeImg: j.beforeImg || '', processImg: j.processImg || '', afterImg: j.afterImg || ''
    });
    setIsJinalayaModalOpen(true);
  };

  const deleteJinalaya = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Jinalaya?',
      message: 'Are you sure you want to delete this jinalaya? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalJinalayas = [...jinalayas];
      setJinalayas(prev => prev.filter(j => j.id !== id));
      try { 
        await jinalayasDB.delete(id); 
        pushToast('Jinalaya deleted successfully.', 'success');
      } catch (err) { 
        setJinalayas(originalJinalayas); 
        pushToast('Failed to delete jinalaya', 'error'); 
      }
    }
  };

  const resetJinalayaForm = () => {
    setEditingJinalayaId(null);
    setJinalayaFormData({
      name: '', village: '', route: '', mulnayak: '', location: '', description: '',
      beforeFile: null, processFile: null, afterFile: null,
      beforeImg: '', processImg: '', afterImg: '', status: 'plan'
    });
    setIsJinalayaModalOpen(false);
  };

  // Yatra Date Handlers
  const handleYatraFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setYatraDateFormData({ ...yatraDateFormData, image: url, imageFile: file });
    }
  };

  const handleYatraDateSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingYatraDateId ? 'Updating Yatra Date...' : 'Saving Yatra Date...');
    try {
      let savedDate;
      const data = {
        date_text: yatraDateFormData.date_text,
        description: yatraDateFormData.description,
        registration_open: yatraDateFormData.registration_open,
        price_per_person: yatraDateFormData.price_per_person || 900,
        max_capacity: yatraDateFormData.max_capacity === '' ? null : yatraDateFormData.max_capacity,
      };

      if (!yatraDateFormData.imageFile) {
        data.image = yatraDateFormData.image;
      }

      if (editingYatraDateId) {
        savedDate = await yatraDatesDB.update(editingYatraDateId, data);
      } else {
        savedDate = await yatraDatesDB.create(data);
      }

      if (yatraDateFormData.imageFile) {
        setProcessingMessage('Uploading Image...');
        const imageUrl = await uploadWebPImage({
          bucketName: 'Yatra_dates',
          folderName: 'yatra-dates',
          recordId: savedDate.id,
          file: yatraDateFormData.imageFile,
          mediaType: 'cover'
        });
        savedDate = await yatraDatesDB.update(savedDate.id, { image: imageUrl });
      }

      await loadBusYatra();
      setIsYatraDateModalOpen(false);
      setYatraDateFormData({ date_text: '', description: '', image: '', registration_open: true, max_capacity: '', imageFile: null });
      pushToast(editingYatraDateId ? 'Yatra date updated.' : 'Yatra date added.', 'success');
    } catch (err) { pushToast(err.message || 'Failed to save yatra date', 'error'); } finally { setIsProcessing(false); }
  };

  const toggleRegistrationStatus = async (id, currentStatus) => {
    const confirmed = await requestConfirmation({
      title: currentStatus ? 'Close Registration?' : 'Open Registration?',
      message: currentStatus 
        ? 'New registrations will be blocked for this date.' 
        : 'Users will be able to register for this yatra date.',
      confirmLabel: currentStatus ? 'Close' : 'Open',
      danger: currentStatus
    });
    if (!confirmed) return;

    setYatraDates(prev => prev.map(d => d.id === id ? { ...d, registration_open: !currentStatus } : d));
    try { 
      await yatraDatesDB.update(id, { registration_open: !currentStatus }); 
      pushToast(`Registration ${!currentStatus ? 'opened' : 'closed'} successfully.`, 'success');
    } catch (err) { 
      setYatraDates(prev => prev.map(d => d.id === id ? { ...d, registration_open: currentStatus } : d)); 
      pushToast('Failed to toggle registration status', 'error');
    }
  };

  const deleteYatraDate = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Yatra Date?',
      message: 'Are you sure you want to delete this yatra date? All associated registrations will also be removed.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalDates = [...yatraDates];
      setYatraDates(prev => prev.filter(d => d.id !== id));
      try { 
        await yatraDatesDB.delete(id); 
        pushToast('Yatra date deleted.', 'success');
      } catch (err) { 
        setYatraDates(originalDates); 
        pushToast('Failed to delete yatra date', 'error'); 
      }
    }
  };

  const deleteRegistration = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Registration?',
      message: 'Are you sure you want to delete this registration? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalRegs = [...busRegistrations];
      setBusRegistrations(prev => prev.filter(r => r.id !== id));
      try { 
        await yatrikRegistrationsDB.delete(id); 
        pushToast('Registration deleted.', 'success');
      } catch (err) { 
        setBusRegistrations(originalRegs); 
        pushToast('Failed to delete registration', 'error'); 
      }
    }
  };

  const addOfflineRegistration = async (registrationData) => {
    const yatraId = String(registrationData.yatra_id || '').trim();
    if (!yatraId) {
      throw new Error('Please select a yatra date');
    }

    const firstName = String(registrationData.first_name || '').trim();
    const lastName = String(registrationData.last_name || '').trim();
    const phone = String(registrationData.phone || '').trim();
    const birthdate = String(registrationData.birthdate || '').trim();
    const gender = String(registrationData.gender || '').trim();

    if (!firstName || !lastName || !phone || !birthdate || !gender) {
      throw new Error('Please fill all required fields');
    }

    const targetYatra = yatraDates.find(date => String(date.id) === yatraId);
    if (!targetYatra) {
      throw new Error('Selected yatra date was not found');
    }

    const maxCapacity = Number(targetYatra.max_capacity || 0);
    if (maxCapacity > 0) {
      const currentCount = busRegistrations.filter(reg => String(reg.yatra_id) === yatraId).length;
      if (currentCount >= maxCapacity) {
        throw new Error('Sorry, this yatra is completely full (0 tickets remaining).');
      }
    }

    const savedRegistration = await yatrikRegistrationsDB.create({
      first_name: firstName,
      last_name: lastName,
      phone,
      email: String(registrationData.email || '').trim() || null,
      birthdate,
      gender,
      remarks: String(registrationData.remarks || '').trim() || null,
      yatra_id: Number(yatraId),
      registration_source: 'offline',
    });

    const nextRegistrations = [savedRegistration, ...busRegistrations];
    setBusRegistrations(nextRegistrations);
    updateCache({ busRegistrations: nextRegistrations });
    pushToast('Offline registration added successfully.', 'success');
    return savedRegistration;
  };

  const exportRegistrationsToCSV = () => {
    const filtered = busRegistrations.filter(reg => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter));
    if (filtered.length === 0) { alert('No data to export'); return; }
    const headers = ['Yatra Date', 'First Name', 'Last Name', 'Phone', 'Alt Phone', 'Gender', 'Birthdate', 'Source', 'Remarks'];
    const rows = filtered.map(reg => {
      const yatraDate = yatraDates.find(d => String(d.id) === String(reg.yatra_id))?.date_text || 'Unknown';
      return [yatraDate, reg.first_name, reg.last_name, reg.phone, reg.alt_phone || '', reg.gender, reg.birthdate, reg.registration_source || 'online', (reg.remarks || '').replace(/,/g, ';')];
    });
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `yatra_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Checking Report Handlers
  const handlePointImageUpload = (index, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newReport = [...checkingReport];
    newReport[index].images = [...(newReport[index].images || []), url];
    setCheckingReport(newReport);
  };

  const removePointImage = (pointIndex, imgIndex) => {
    const newReport = [...checkingReport];
    newReport[pointIndex].images = newReport[pointIndex].images.filter((_, i) => i !== imgIndex);
    setCheckingReport(newReport);
  };

  const handleSaveCheckingReport = async (e) => {
    e.preventDefault();
    if ((!checkingUpashrayId && !checkingJinalayaId) || !currentMemberId) return;
    setIsProcessing(true);
    setProcessingMessage('Saving Report...');
    try {
      const reportData = {
        member_id: currentMemberId,
        report_date: new Date().toISOString(),
        points: checkingReport,
        general_notes: generalNotes
      };
      if (checkingUpashrayId) reportData.upashray_id = checkingUpashrayId;
      if (checkingJinalayaId) reportData.jinalaya_id = checkingJinalayaId;
      await checkingReportsDB.create(reportData);
      await loadReports();
      setCheckingUpashrayId(null);
      setCheckingJinalayaId(null);
      setCheckingReport(CHECKING_POINTS.map((point, index) => ({ id: index, point, description: '', isChecked: false, images: [] })));
      setGeneralNotes('');
      pushToast('Report saved successfully!', 'success');
    } catch (err) { pushToast('Failed to save report', 'error'); } finally { setIsProcessing(false); }
  };

  const openReportAndPrint = (report) => { window.open(`/print-report/${report.id}`, '_blank'); };

  const deleteReport = async (id) => {
    const confirmed = await requestConfirmation({
      title: 'Delete Report?',
      message: 'Are you sure you want to delete this report? This action cannot be undone.',
      confirmLabel: 'Delete',
      danger: true
    });
    if (confirmed) {
      const originalReports = [...allReports];
      setAllReports(prev => prev.filter(r => r.id !== id));
      try { 
        await checkingReportsDB.delete(id); 
        pushToast('Report deleted.', 'success');
      } catch (err) { 
        setAllReports(originalReports); 
        pushToast('Failed to delete report', 'error'); 
      }
    }
  };

  const GlobalUX = () => (
    <>
      <TopLineLoader active={isProcessing || isLoadingData || isInitializing} label={processingMessage || 'Loading...'} />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        open={confirmState.open} title={confirmState.title} message={confirmState.message}
        confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} danger={confirmState.danger}
        onConfirm={confirmState.onConfirm} onCancel={confirmState.onCancel}
      />
    </>
  );

  if (view === 'login') {
    return (
      <>
        <GlobalUX />
        <LoginForm initialView={initialView} onBack={onBack} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={error} handleLogin={handleLogin} />
        {showOverlay && <LoadingOverlay message={processingMessage} />}
      </>
    );
  }

  if (view === 'admin') {
    return (
      <>
        <GlobalUX />
        <AdminPanel 
          activeTab={activeTab} setActiveTab={(tab) => navigate(`/admin/${tab}`)} loadedData={loadedData} loadMembers={loadMembers} loadJinalayas={loadJinalayas} loadReports={loadReports} loadBusYatra={loadBusYatra} loadPaymentIntents={loadPaymentIntents} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout}
          upashrays={upashrays} upashraySearch={upashraySearch} setUpashraySearch={setUpashraySearch} setIsModalOpen={setIsModalOpen} startEdit={startEdit} deleteUpashray={deleteUpashray} isModalOpen={isModalOpen} resetForm={resetForm} editingId={editingId} formData={formData} setFormData={setFormData} handleSaveUpashray={handleSaveUpashray} handleMultipleFilesChange={handleMultipleFilesChange} removeMediaFile={removeMediaFile} deleteExistingMedia={deleteExistingMedia} deleteLegacyUpashrayMedia={deleteLegacyUpashrayMedia}
          yatraSearch={yatraSearch} setYatraSearch={setYatraSearch} setEditingYatraDateId={setEditingYatraDateId} setYatraDateFormData={setYatraDateFormData} setIsYatraDateModalOpen={setIsYatraDateModalOpen} yatraDates={yatraDates} busRegistrations={busRegistrations} toggleRegistrationStatus={toggleRegistrationStatus} deleteYatraDate={deleteYatraDate} registrationYatraFilter={registrationYatraFilter} setRegistrationYatraFilter={setRegistrationYatraFilter} exportRegistrationsToCSV={exportRegistrationsToCSV} deleteRegistration={deleteRegistration} addOfflineRegistration={addOfflineRegistration} isYatraDateModalOpen={isYatraDateModalOpen} editingYatraDateId={editingYatraDateId} yatraDateFormData={yatraDateFormData} handleYatraFileChange={handleYatraFileChange} handleYatraDateSubmit={handleYatraDateSubmit}
          members={members} memberSearch={memberSearch} setMemberSearch={setMemberSearch} setIsMemberModalOpen={setIsMemberModalOpen} toggleMemberAccess={toggleMemberAccess} startEditMember={startEditMember} deleteMember={deleteMember} isMemberModalOpen={isMemberModalOpen} resetMemberForm={resetMemberForm} editingMemberId={editingMemberId} memberFormData={memberFormData} setMemberFormData={setMemberFormData} handleSaveMember={handleSaveMember}
          jinalayas={jinalayas} jinalayaSearch={jinalayaSearch} setJinalayaSearch={setJinalayaSearch} setIsJinalayaModalOpen={setIsJinalayaModalOpen} startEditJinalaya={startEditJinalaya} deleteJinalaya={deleteJinalaya} isJinalayaModalOpen={isJinalayaModalOpen} resetJinalayaForm={resetJinalayaForm} editingJinalayaId={editingJinalayaId} jinalayaFormData={jinalayaFormData} setJinalayaFormData={setJinalayaFormData} handleSaveJinalaya={handleSaveJinalaya} deleteJinalayaMedia={deleteJinalayaMedia}
          allReports={allReports} reportUpashrayFilter={reportUpashrayFilter} setReportUpashrayFilter={setReportUpashrayFilter} reportMemberFilter={reportMemberFilter} setReportMemberFilter={setReportMemberFilter} reportDateFilter={reportDateFilter} setReportDateFilter={setReportDateFilter} setSelectedReport={setSelectedReport} deleteReport={deleteReport} isReportModalOpen={isReportModalOpen} setIsReportModalOpen={setIsReportModalOpen} selectedReport={selectedReport} openReportAndPrint={openReportAndPrint}
        />
      </>
    );
  }

  if (view === 'member') {
    return (
      <>
        <GlobalUX />
        <MemberPanel 
          memberActiveTab={memberActiveTab} setMemberActiveTab={(tab) => navigate(`/member/${tab}`)} loadedData={loadedData} loadReports={loadReports} loadUpashrayReports={loadUpashrayReports} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout}
          upashrays={upashrays} jinalayas={jinalayas} setCheckingUpashrayId={setCheckingUpashrayId} checkingUpashrayId={checkingUpashrayId} setCheckingJinalayaId={setCheckingJinalayaId} checkingJinalayaId={checkingJinalayaId} handleSaveCheckingReport={handleSaveCheckingReport} checkingReport={checkingReport} setCheckingReport={setCheckingReport} removePointImage={removePointImage} handlePointImageUpload={handlePointImageUpload} generalNotes={generalNotes} setGeneralNotes={setGeneralNotes}
          allReports={allReports} currentMemberId={currentMemberId} setSelectedReport={setSelectedReport} setIsReportModalOpen={setIsReportModalOpen} isReportModalOpen={isReportModalOpen} selectedReport={selectedReport}
        />
      </>
    );
  }

  return showOverlay ? (
    <>
      <GlobalUX />
      <LoadingOverlay message={processingMessage} />
    </>
  ) : <GlobalUX />;
};
