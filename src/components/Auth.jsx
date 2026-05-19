import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import { upashraysDB, membersDB, jinalayasDB, checkingReportsDB, adminProfilesDB, yatrikRegistrationsDB, yatraDatesDB, upashrayMediaDB } from '../lib/database.js';
import LoginForm from './auth/LoginForm';
import LoadingOverlay from './auth/LoadingOverlay';
import AdminPanel from './admin/AdminPanel';
import MemberPanel from './member/MemberPanel';

const ADMIN_CREDENTIALS = {
  email: 'GirnarTirthYatraGroup@gmail.com',
  password: 'Girnar@22'
};

const PORTAL_CACHE_KEY = 'girnar_portal_state_v1';

export const AuthView = ({ onBack, initialView = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('login'); // 'login', 'admin', 'member'
  const [isInitializing, setIsInitializing] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [upashrays, setUpashrays] = useState([]);
  const [jinalayas, setJinalayas] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState('upashrays'); // 'upashrays', 'members', 'jinalayas', 'reports', 'bus-yatra'
  const [allReports, setAllReports] = useState([]);
  const [busRegistrations, setBusRegistrations] = useState([]);
  const [yatraDates, setYatraDates] = useState([]);
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
      if (!tab) {
        navigate('/admin/upashrays', { replace: true });
      } else if (tab !== activeTab) {
        setActiveTab(tab);
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
    beforeFiles: [], processFiles: [], afterFiles: [], status: 'plan'
  });

  // Form State for Yatra Dates
  const [yatraDateFormData, setYatraDateFormData] = useState({
    date_text: '', description: '', image: '', registration_open: true
  });
  const [isYatraDateModalOpen, setIsYatraDateModalOpen] = useState(false);
  const [editingYatraDateId, setEditingYatraDateId] = useState(null);

  // State for Checking Report
  const [checkingReport, setCheckingReport] = useState(CHECKING_POINTS.map((point, index) => ({
    id: index, point, description: '', isChecked: false, images: []
  })));
  const [generalNotes, setGeneralNotes] = useState('');

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
    if (state.upashrays) setUpashrays(state.upashrays);
    if (state.members) setMembers(state.members);
    if (state.jinalayas) setJinalayas(state.jinalayas);
    if (state.allReports) setAllReports(state.allReports);
  };

  // Modular Data Loading
  const [loadedData, setLoadedData] = useState({
    upashrays: false, members: false, jinalayas: false, reports: false, busYatra: false
  });

  const loadUpashrays = async () => {
    try {
      const data = await upashraysDB.getAll();
      const processed = data.map(u => ({
        ...u,
        name: u.name || '', village: u.village || '', route: u.route || '',
        beforeImg: u.before_img || '/images/Upasray.png',
        processImg: u.process_img || '/images/Upasray.png',
        afterImg: u.after_img || '/images/Upasray.png',
        reports: []
      }));
      setUpashrays(processed);
      setLoadedData(prev => ({ ...prev, upashrays: true }));
      updateCache({ upashrays: processed });
    } catch (e) { console.error(e); }
  };

  const loadUpashrayReports = async () => {
    try {
      const reports = await checkingReportsDB.getAll();
      const reportsByUpashray = {};
      reports.forEach(r => {
        if (r && r.upashray_id) {
          if (!reportsByUpashray[r.upashray_id]) reportsByUpashray[r.upashray_id] = [];
          reportsByUpashray[r.upashray_id].push({
            ...r, title: 'Checking Report',
            date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
          });
        }
      });

      setUpashrays(prev => {
        const updated = prev.map(u => ({ ...u, reports: reportsByUpashray[u.id] || [] }));
        updateCache({ upashrays: updated });
        return updated;
      });
    } catch (e) { console.error(e); }
  };

  const loadMembers = async () => {
    try {
      const data = await membersDB.getAll();
      const processed = data.map(m => ({ ...m, hasAccess: !!m.has_access }));
      setMembers(processed);
      setLoadedData(prev => ({ ...prev, members: true }));
      updateCache({ members: processed });
    } catch (e) { console.error(e); }
  };

  const loadJinalayas = async () => {
    try {
      const data = await jinalayasDB.getAll();
      const processed = data.map(j => ({
        ...j,
        beforeImg: j.before_img || '/images/Upasray.png',
        processImg: j.process_img || '/images/Upasray.png',
        afterImg: j.after_img || '/images/Upasray.png'
      }));
      setJinalayas(processed);
      setLoadedData(prev => ({ ...prev, jinalayas: true }));
      updateCache({ jinalayas: processed });
    } catch (e) { console.error(e); }
  };

  const loadReports = async () => {
    try {
      const [reportsData, upashraysData, membersData] = await Promise.all([
        checkingReportsDB.getAll(), upashraysDB.getAll(), membersDB.getAll()
      ]);
      
      const processed = reportsData.map(r => {
        const upashray = upashraysData.find(u => String(u.id) === String(r.upashray_id));
        const member = membersData.find(m => String(m.id) === String(r.member_id));
        return {
          ...r,
          upashrayName: upashray ? upashray.name : 'Unknown Upashray',
          village: upashray ? upashray.village : 'Unknown Location',
          route: upashray ? upashray.route : '',
          memberName: member ? member.name : 'Unknown Member',
          date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
        };
      });
      setAllReports(processed);
      setLoadedData(prev => ({ ...prev, reports: true }));
      updateCache({ allReports: processed });
    } catch (e) { console.error(e); }
  };

  const loadBusYatra = async () => {
    try {
      const [busData, datesData] = await Promise.all([
        yatrikRegistrationsDB.getAll(), yatraDatesDB.getAll()
      ]);
      const processedDates = datesData.map(d => ({ ...d, registration_open: d.registration_open !== false }));
      setBusRegistrations(busData);
      setYatraDates(processedDates);
      setLoadedData(prev => ({ ...prev, busYatra: true }));
      updateCache({ busRegistrations: busData, yatraDates: processedDates });
    } catch (e) { console.error(e); }
  };

  const updateCache = (newState) => {
    const currentCache = readPortalCache() || {};
    writePortalCache({ ...currentCache, ...newState });
  };

  const loadAdminData = async () => {
    const cached = readPortalCache();
    if (cached) applyPortalState(cached);
    
    setIsLoadingData(true);
    setProcessingMessage('Syncing initial data...');
    await loadUpashrays();
    setIsLoadingData(false);
    
    // Load others in background
    loadAllDataInBackground();
  };

  const loadMemberData = async () => {
    const cached = readPortalCache();
    if (cached) applyPortalState(cached);

    setIsLoadingData(true);
    setProcessingMessage('Syncing member database...');
    await loadUpashrays();
    setIsLoadingData(false);

    loadAllDataInBackground();
  };

  const loadAllDataInBackground = async () => {
    if (view === 'admin' || initialView === 'admin') {
      await Promise.all([loadMembers(), loadJinalayas(), loadReports(), loadBusYatra(), loadUpashrayReports()]);
    } else {
      await Promise.all([loadReports(), loadUpashrayReports()]);
    }
  };

  const loadAllData = async () => {
    if (view === 'admin' || initialView === 'admin') {
      await loadAdminData();
    } else {
      await loadMemberData();
    }
  };

  // Session Check
  useEffect(() => {
    const checkSession = async () => {
      setIsInitializing(true);
      try {
        const override = localStorage.getItem('auth_override');
        if (override === 'admin' && initialView === 'admin') {
          setView('admin');
          setIsInitializing(false);
          await loadAllData();
          return;
        } else if (override === 'member' && initialView === 'member') {
          const storedMemberId = localStorage.getItem('auth_member_id');
          if (storedMemberId) setCurrentMemberId(storedMemberId);
          setView('member');
          setIsInitializing(false);
          await loadAllData();
          return;
        }

        if (!supabase || !supabase.auth) {
          setView('login');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const email = session.user.email || '';
          const normalizedEmail = email.toLowerCase();

          const [adminProfile, memberRecord] = await Promise.all([
            adminProfilesDB.getByUserId(session.user.id).catch(() => null),
            membersDB.getByEmail(normalizedEmail).catch(() => null)
          ]);

          const isDefaultAdminEmail = normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase();

          if (initialView === 'admin' && (adminProfile || isDefaultAdminEmail)) {
            setView('admin');
            await loadAllData();
          } else if (initialView === 'member' && memberRecord?.has_access) {
            setCurrentMemberId(memberRecord.id);
            setView('member');
            await loadAllData();
          } else {
            setView('login');
          }
        } else {
          setView('login');
        }
      } catch (err) {
        console.error('Session check error:', err);
        if (String(err?.message || '').toLowerCase().includes('refresh token')) {
          await supabase.auth.signOut().catch(() => { });
        }
        setView('login');
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
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
            setView('member');
            setError('');
            navigate('/member/upashray-reports');
            await loadAllData();
          } else if (!memberRecord.has_access) {
            setError('Your account does not have access. Please contact Admin.');
          } else { setError('Member credentials are wrong'); }
        } else { setError('Member not found or access not granted'); }
      } catch (err) { setError('An error occurred during login'); }
      setIsProcessing(false);
      return;
    }

    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('auth_override', 'admin');
      setView('admin');
      setError('');
      navigate('/admin/upashrays');
      await loadAllData();
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
    return (
      <div className="fixed inset-0 z-[200] bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-8">
          <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[#8f6d2f] text-xs uppercase tracking-[0.2em] font-bold">Checking Session...</p>
        </div>
      </div>
    );
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
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    setIsProcessing(true);
    setProcessingMessage('Deleting media...');
    try {
      await upashrayMediaDB.delete(mediaId);
      const fieldName = `existing${category}Media`;
      setFormData(prev => ({ ...prev, [fieldName]: prev[fieldName].filter(m => m.id !== mediaId) }));
      await loadUpashrays();
    } catch (err) { alert('Failed to delete media'); } finally { setIsProcessing(false); }
  };

  const handleSaveUpashray = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingId ? 'Updating Upashray...' : 'Adding Upashray...');
    try {
      const upashrayData = {
        name: formData.name, village: formData.village, route: formData.route,
        trusty: formData.trusty, mobile: formData.mobile, location: formData.location,
        description: formData.description, slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status
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
      loadUpashrayReports(); resetForm();
    } catch (err) { alert('Failed to save upashray'); } finally { setIsProcessing(false); }
  };

  const startEdit = async (u) => {
    setIsProcessing(true);
    setProcessingMessage('Loading upashray details...');
    try {
      const media = await upashrayMediaDB.getByUpashrayId(u.id);
      setEditingId(u.id);
      setFormData({
        name: u.name || '', village: u.village || '', route: u.route || '', trusty: u.trusty || '', mobile: u.mobile || '',
        location: u.location || '', description: u.description || '', slug: u.slug || '', status: u.status || 'Plan',
        beforeFiles: [], processFiles: [], afterFiles: [],
        existingBeforeMedia: media.filter(m => m.category === 'Before'),
        existingProcessMedia: media.filter(m => m.category === 'Process'),
        existingAfterMedia: media.filter(m => m.category === 'After')
      });
      setIsModalOpen(true);
    } catch (err) { } finally { setIsProcessing(false); }
  };

  const deleteUpashray = async (id) => {
    if (window.confirm('Are you sure you want to delete this upashray?')) {
      const originalUpashrays = [...upashrays];
      setUpashrays(prev => prev.filter(u => u.id !== id));
      try { await upashraysDB.delete(id); } catch (err) { setUpashrays(originalUpashrays); alert('Failed to delete upashray'); }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', village: '', route: '', trusty: '', mobile: '', location: '', description: '', slug: '',
      beforeFiles: [], processFiles: [], afterFiles: [], status: 'Plan'
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
        code: memberFormData.code || (memberFormData.name.substring(0, 2).toUpperCase() + 'GYG022')
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
    } catch (err) { alert('Failed to save member'); } finally { setIsProcessing(false); }
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
    setMembers(prev => prev.map(m => m.id === id ? { ...m, hasAccess: !m.hasAccess } : m));
    try { await membersDB.update(id, { has_access: !member.hasAccess }); }
    catch (err) { setMembers(prev => prev.map(m => m.id === id ? { ...m, hasAccess: member.hasAccess } : m)); }
  };

  const deleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const originalMembers = [...members];
      setMembers(prev => prev.filter(m => m.id !== id));
      try { await membersDB.delete(id); } catch (err) { setMembers(originalMembers); alert('Failed to delete member'); }
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
        name: jinalayaFormData.name, village: jinalayaFormData.village, route: jinalayaFormData.route,
        mulnayak: jinalayaFormData.mulnayak, location: jinalayaFormData.location, description: jinalayaFormData.description,
        status: jinalayaFormData.status, before_img: jinalayaFormData.beforeImg,
        process_img: jinalayaFormData.processImg, after_img: jinalayaFormData.afterImg
      };
      let savedJinalaya;
      if (editingJinalayaId) {
        savedJinalaya = await jinalayasDB.update(editingJinalayaId, data);
        setJinalayas(prev => prev.map(j => j.id === editingJinalayaId ? { ...savedJinalaya, beforeImg: savedJinalaya.before_img, processImg: savedJinalaya.process_img, afterImg: savedJinalaya.after_img } : j));
      } else {
        savedJinalaya = await jinalayasDB.create(data);
        setJinalayas(prev => [{ ...savedJinalaya, beforeImg: savedJinalaya.before_img, processImg: savedJinalaya.process_img, afterImg: savedJinalaya.after_img }, ...prev]);
      }
      resetJinalayaForm();
    } catch (err) { alert('Failed to save jinalaya'); } finally { setIsProcessing(false); }
  };

  const startEditJinalaya = (j) => {
    setEditingJinalayaId(j.id);
    setJinalayaFormData({
      name: j.name, village: j.village, route: j.route, mulnayak: j.mulnayak, location: j.location, description: j.description,
      status: j.status, beforeImg: j.beforeImg, processImg: j.processImg, afterImg: j.afterImg
    });
    setIsJinalayaModalOpen(true);
  };

  const deleteJinalaya = async (id) => {
    if (window.confirm('Are you sure you want to delete this jinalaya?')) {
      const originalJinalayas = [...jinalayas];
      setJinalayas(prev => prev.filter(j => j.id !== id));
      try { await jinalayasDB.delete(id); } catch (err) { setJinalayas(originalJinalayas); alert('Failed to delete jinalaya'); }
    }
  };

  const resetJinalayaForm = () => {
    setEditingJinalayaId(null);
    setJinalayaFormData({
      name: '', village: '', route: '', mulnayak: '', location: '', description: '',
      beforeImg: '', processImg: '', afterImg: '', status: 'Plan'
    });
    setIsJinalayaModalOpen(false);
  };

  // Yatra Date Handlers
  const handleYatraFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setYatraDateFormData({ ...yatraDateFormData, image: url });
    }
  };

  const handleYatraDateSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingMessage(editingYatraDateId ? 'Updating Yatra Date...' : 'Saving Yatra Date...');
    try {
      const data = {
        date_text: yatraDateFormData.date_text, description: yatraDateFormData.description,
        image: yatraDateFormData.image, registration_open: yatraDateFormData.registration_open
      };
      if (editingYatraDateId) await yatraDatesDB.update(editingYatraDateId, data);
      else await yatraDatesDB.create(data);
      await loadBusYatra();
      setIsYatraDateModalOpen(false);
    } catch (err) { } finally { setIsProcessing(false); }
  };

  const toggleRegistrationStatus = async (id, currentStatus) => {
    setYatraDates(prev => prev.map(d => d.id === id ? { ...d, registration_open: !currentStatus } : d));
    try { await yatraDatesDB.update(id, { registration_open: !currentStatus }); }
    catch (err) { setYatraDates(prev => prev.map(d => d.id === id ? { ...d, registration_open: currentStatus } : d)); }
  };

  const deleteYatraDate = async (id) => {
    if (window.confirm('Are you sure you want to delete this yatra date?')) {
      const originalDates = [...yatraDates];
      setYatraDates(prev => prev.filter(d => d.id !== id));
      try { await yatraDatesDB.delete(id); } catch (err) { setYatraDates(originalDates); alert('Failed to delete yatra date'); }
    }
  };

  const deleteRegistration = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      const originalRegs = [...busRegistrations];
      setBusRegistrations(prev => prev.filter(r => r.id !== id));
      try { await yatrikRegistrationsDB.delete(id); } catch (err) { setBusRegistrations(originalRegs); alert('Failed to delete registration'); }
    }
  };

  const exportRegistrationsToCSV = () => {
    const filtered = busRegistrations.filter(reg => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter));
    if (filtered.length === 0) { alert('No data to export'); return; }
    const headers = ['Yatra Date', 'First Name', 'Last Name', 'Phone', 'Alt Phone', 'Gender', 'Birthdate', 'Remarks'];
    const rows = filtered.map(reg => {
      const yatraDate = yatraDates.find(d => String(d.id) === String(reg.yatra_id))?.date_text || 'Unknown';
      return [yatraDate, reg.first_name, reg.last_name, reg.phone, reg.alt_phone || '', reg.gender, reg.birthdate, (reg.remarks || '').replace(/,/g, ';')];
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
    if (!checkingUpashrayId || !currentMemberId) return;
    setIsProcessing(true);
    setProcessingMessage('Saving Report...');
    try {
      const reportData = { upashray_id: checkingUpashrayId, member_id: currentMemberId, report_date: new Date().toISOString(), points: checkingReport, general_notes: generalNotes };
      await checkingReportsDB.create(reportData);
      await loadReports();
      setCheckingUpashrayId(null);
      setCheckingReport(CHECKING_POINTS.map((point, index) => ({ id: index, point, description: '', isChecked: false, images: [] })));
      setGeneralNotes('');
      alert('Report saved successfully!');
    } catch (err) { alert('Failed to save report'); } finally { setIsProcessing(false); }
  };

  const openReportAndPrint = (report) => { window.open(`/print-report/${report.id}`, '_blank'); };

  const deleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const originalReports = [...allReports];
      setAllReports(prev => prev.filter(r => r.id !== id));
      try { await checkingReportsDB.delete(id); } catch (err) { setAllReports(originalReports); alert('Failed to delete report'); }
    }
  };

  if (view === 'login') {
    return <LoginForm initialView={initialView} onBack={onBack} email={email} setEmail={setEmail} password={password} setPassword={setPassword} error={error} handleLogin={handleLogin} />;
  }

  if (view === 'admin') {
    return (
      <AdminPanel 
        activeTab={activeTab} setActiveTab={(tab) => navigate(`/admin/${tab}`)} loadedData={loadedData} loadMembers={loadMembers} loadJinalayas={loadJinalayas} loadReports={loadReports} loadBusYatra={loadBusYatra} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout}
        upashrays={upashrays} upashraySearch={upashraySearch} setUpashraySearch={setUpashraySearch} setIsModalOpen={setIsModalOpen} startEdit={startEdit} deleteUpashray={deleteUpashray} isModalOpen={isModalOpen} resetForm={resetForm} editingId={editingId} formData={formData} setFormData={setFormData} handleSaveUpashray={handleSaveUpashray} handleMultipleFilesChange={handleMultipleFilesChange} removeMediaFile={removeMediaFile} deleteExistingMedia={deleteExistingMedia}
        yatraSearch={yatraSearch} setYatraSearch={setYatraSearch} setEditingYatraDateId={setEditingYatraDateId} setYatraDateFormData={setYatraDateFormData} setIsYatraDateModalOpen={setIsYatraDateModalOpen} yatraDates={yatraDates} busRegistrations={busRegistrations} toggleRegistrationStatus={toggleRegistrationStatus} deleteYatraDate={deleteYatraDate} registrationYatraFilter={registrationYatraFilter} setRegistrationYatraFilter={setRegistrationYatraFilter} exportRegistrationsToCSV={exportRegistrationsToCSV} deleteRegistration={deleteRegistration} isYatraDateModalOpen={isYatraDateModalOpen} editingYatraDateId={editingYatraDateId} yatraDateFormData={yatraDateFormData} handleYatraFileChange={handleYatraFileChange} handleYatraDateSubmit={handleYatraDateSubmit}
        members={members} memberSearch={memberSearch} setMemberSearch={setMemberSearch} setIsMemberModalOpen={setIsMemberModalOpen} toggleMemberAccess={toggleMemberAccess} startEditMember={startEditMember} deleteMember={deleteMember} isMemberModalOpen={isMemberModalOpen} resetMemberForm={resetMemberForm} editingMemberId={editingMemberId} memberFormData={memberFormData} setMemberFormData={setMemberFormData} handleSaveMember={handleSaveMember}
        jinalayas={jinalayas} jinalayaSearch={jinalayaSearch} setJinalayaSearch={setJinalayaSearch} setIsJinalayaModalOpen={setIsJinalayaModalOpen} startEditJinalaya={startEditJinalaya} deleteJinalaya={deleteJinalaya} isJinalayaModalOpen={isJinalayaModalOpen} resetJinalayaForm={resetJinalayaForm} editingJinalayaId={editingJinalayaId} jinalayaFormData={jinalayaFormData} setJinalayaFormData={setJinalayaFormData} handleSaveJinalaya={handleSaveJinalaya}
        allReports={allReports} reportUpashrayFilter={reportUpashrayFilter} setReportUpashrayFilter={setReportUpashrayFilter} reportMemberFilter={reportMemberFilter} setReportMemberFilter={setReportMemberFilter} reportDateFilter={reportDateFilter} setReportDateFilter={setReportDateFilter} setSelectedReport={setSelectedReport} deleteReport={deleteReport} isReportModalOpen={isReportModalOpen} setIsReportModalOpen={setIsReportModalOpen} selectedReport={selectedReport} openReportAndPrint={openReportAndPrint}
      />
    );
  }

  if (view === 'member') {
    return (
      <MemberPanel 
        memberActiveTab={memberActiveTab} setMemberActiveTab={(tab) => navigate(`/member/${tab}`)} loadedData={loadedData} loadReports={loadReports} loadUpashrayReports={loadUpashrayReports} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout}
        upashrays={upashrays} setCheckingUpashrayId={setCheckingUpashrayId} checkingUpashrayId={checkingUpashrayId} handleSaveCheckingReport={handleSaveCheckingReport} checkingReport={checkingReport} setCheckingReport={setCheckingReport} removePointImage={removePointImage} handlePointImageUpload={handlePointImageUpload} generalNotes={generalNotes} setGeneralNotes={setGeneralNotes}
        allReports={allReports} currentMemberId={currentMemberId} setSelectedReport={setSelectedReport} setIsReportModalOpen={setIsReportModalOpen} isReportModalOpen={isReportModalOpen} selectedReport={selectedReport}
      />
    );
  }

  return <>{(isProcessing || isLoadingData) && <LoadingOverlay message={processingMessage} />}</>;
};
