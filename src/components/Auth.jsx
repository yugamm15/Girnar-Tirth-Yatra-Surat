import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { upashraysDB, membersDB, jinalayasDB, checkingReportsDB, adminProfilesDB } from '../lib/database.js';

const ADMIN_CREDENTIALS = {
  email: 'GirnarTirthYatraGroup@gmail.com',
  password: 'Girnar@22'
};

const generateMemberCode = (name) => {
  if (!name) return '';
  const prefix = name.substring(0, 2).toUpperCase();
  return `${prefix}GYG022`;
};

export const AuthView = ({ onBack, initialView = 'login' }) => {
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
  const [activeTab, setActiveTab] = useState('upashrays'); // 'upashrays', 'members', 'jinalayas', 'reports'
  const [allReports, setAllReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Report Filters
  const [reportUpashrayFilter, setReportUpashrayFilter] = useState('all');
  const [reportMemberFilter, setReportMemberFilter] = useState('all');
  const [reportDateFilter, setReportDateFilter] = useState('');

  const [upashraySearch, setUpashraySearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [jinalayaSearch, setJinalayaSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingJinalayaId, setEditingJinalayaId] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isJinalayaModalOpen, setIsJinalayaModalOpen] = useState(false);
  const [checkingUpashrayId, setCheckingUpashrayId] = useState(null);

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
    "દરેક ઉપાશ્રય વિહાર રૂટનું બોર્ડ - ફોટા મૂકવાના (બાકી હોય ત્યાં)",
    "ઘડિયાળ મૂકવાની.",
    "વિહાર બુક મૂકવી.",
    "આખા ઉપાશ્રય માં તિરાડો પડેલ છે કે નહિ તે ચેક કરવું",
    "આખા ઉપાશ્રય નું કલર કામ ચેક કરવું પોપડા ખરચ્યા છે કે બરાબર તે ચેક કરવું."
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Adding/Editing Upashray
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    route: '',
    trusty: '',
    mobile: '',
    location: '',
    description: '',
    beforeImg: null,
    processImg: null,
    afterImg: null,
    status: 'Plan'
  });

  // Form State for Adding/Editing Member
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    hasAccess: false
  });

  // Form State for Adding/Editing Jinalaya
  const [jinalayaFormData, setJinalayaFormData] = useState({
    name: '',
    village: '',
    route: '',
    mulnayak: '',
    location: '',
    description: '',
    beforeImg: null,
    processImg: null,
    afterImg: null,
    status: 'Plan'
  });

  // State for Checking Report
  const [checkingReport, setCheckingReport] = useState(CHECKING_POINTS.map((point, index) => ({
    id: index,
    point,
    description: '',
    isChecked: false
  })));

  // Load data from database
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [upashraysData, membersData, jinalayasData, reportsData] = await Promise.all([
        upashraysDB.getAll().catch(err => { console.error('Upashrays load error:', err); return []; }),
        membersDB.getAll().catch(err => { console.error('Members load error:', err); return []; }),
        jinalayasDB.getAll().catch(err => { console.error('Jinalayas load error:', err); return []; }),
        checkingReportsDB.getAll().catch(err => { console.error('Reports load error:', err); return []; })
      ]);

      if (Array.isArray(upashraysData)) {
        setUpashrays(upashraysData.map(u => {
          if (!u) return null;
          // Find reports for this upashray
          const uReports = Array.isArray(reportsData)
            ? reportsData
              .filter(r => r && r.upashray_id === u.id)
              .map(r => ({
                id: r.id,
                title: 'Checking Report',
                date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
              }))
            : [];

          return {
            ...u,
            name: u.name || '',
            village: u.village || '',
            route: u.route || '',
            beforeImg: u.before_img || '/images/Upasray.png',
            processImg: u.process_img || '/images/Upasray.png',
            afterImg: u.after_img || '/images/Upasray.png',
            reports: uReports.length > 0 ? uReports : (u.reports || [])
          };
        }).filter(Boolean));
      }

      if (Array.isArray(membersData)) {
        setMembers(membersData.map(m => {
          if (!m) return null;
          return {
            ...m,
            name: m.name || '',
            email: m.email || '',
            phone: m.phone || '',
            password: m.password || '',
            hasAccess: !!m.has_access
          };
        }).filter(Boolean));
      }

      if (Array.isArray(jinalayasData)) {
        setJinalayas(jinalayasData.map(j => {
          if (!j) return null;
          return {
            ...j,
            name: j.name || '',
            beforeImg: j.before_img || '/images/Upasray.png',
            processImg: j.process_img || '/images/Upasray.png',
            afterImg: j.after_img || '/images/Upasray.png'
          };
        }).filter(Boolean));
      }

      // Process all reports for the admin view
      if (Array.isArray(reportsData)) {
        const processedReports = reportsData.map(r => {
          const upashray = Array.isArray(upashraysData) ? upashraysData.find(u => String(u.id) === String(r.upashray_id)) : null;
          const member = Array.isArray(membersData) ? membersData.find(m => String(m.id) === String(r.member_id)) : null;
          return {
            ...r,
            upashrayName: upashray ? upashray.name : 'Unknown Upashray',
            village: upashray ? upashray.village : 'Unknown Location',
            route: upashray ? upashray.route : '',
            memberName: member ? member.name : 'Unknown Member',
            date: r.report_date ? new Date(r.report_date).toLocaleDateString() : 'N/A'
          };
        });
        setAllReports(processedReports);
      }
    } catch (dbError) {
      console.log('Database error or not configured, using local data:', dbError.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Check for existing session and initialize view
  useEffect(() => {
    const checkSession = async () => {
      setIsInitializing(true);
      try {
        const override = localStorage.getItem('auth_override');
        if (override === 'admin' && initialView === 'admin') {
          setView('admin');
          await loadAllData();
          setIsInitializing(false);
          return;
        } else if (override === 'member' && initialView === 'member') {
          const storedMemberId = localStorage.getItem('auth_member_id');
          if (storedMemberId) setCurrentMemberId(storedMemberId);
          setView('member');
          await loadAllData();
          setIsInitializing(false);
          return;
        }

        if (!supabase || !supabase.auth) {
          console.warn('Supabase auth not available');
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
        email: normalizedEmail,
        password
      });

      if (error || !data?.user) {
        return false;
      }

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
          await loadAllData();
          return true;
        }

        await supabase.auth.signOut().catch(() => { });
        setError('You do not have admin access for this account');
        return true;
      }

      if (initialView === 'member') {
        const canAccessMember = memberRecord && memberRecord.has_access;

        if (canAccessMember) {
          setCurrentMemberId(memberRecord?.id || data.user.id);
          setView('member');
          setError('');
          await loadAllData();
          return true;
        }

        await supabase.auth.signOut().catch(() => { });
        setError('Your account does not have access. Please contact Admin.');
        return true;
      }
    } catch (err) {
      console.error('Supabase login error:', err);
    }

    return false;
  };

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const loggedInWithSupabase = await trySupabaseAuthLogin(normalizedEmail);
      if (loggedInWithSupabase) {
        return;
      }
    } catch (authError) {
      console.log('Supabase auth login failed, using fallback credentials:', authError.message);
    }

    // Admin login attempt
    if (initialView === 'admin') {
      if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('auth_override', 'admin');
        setView('admin');
        setError('');
        await loadAllData();
      } else {
        setError('Admin credentials are wrong');
      }
      return;
    }

    // Member login attempt
    if (initialView === 'member') {
      try {
        // Check the database for this specific member
        const memberRecord = await membersDB.getByEmail(normalizedEmail).catch(() => null);

        if (memberRecord) {
          if (memberRecord.has_access && password === memberRecord.password) {
            setCurrentMemberId(memberRecord.id);
            localStorage.setItem('auth_override', 'member');
            localStorage.setItem('auth_member_id', memberRecord.id);
            setView('member');
            setError('');
            await loadAllData();
          } else if (!memberRecord.has_access) {
            setError('Your account does not have access. Please contact Admin.');
          } else {
            setError('Member credentials are wrong');
          }
        } else {
          setError('Member not found or access not granted');
        }
      } catch (err) {
        console.error('Member login error:', err);
        setError('An error occurred during login');
      }
      return;
    }

    // Generic login (fallback)
    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('auth_override', 'admin');
      setView('admin');
      setError('');
      await loadAllData();
    } else {
      setError('Credentials are wrong');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('auth_override');
    localStorage.removeItem('auth_member_id');
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut();
      }
    } catch (e) {}
    setView('login');
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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: url });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      village: '',
      route: '',
      trusty: '',
      mobile: '',
      location: '',
      description: '',
      beforeImg: null,
      processImg: null,
      afterImg: null,
      status: 'Plan'
    });
    setIsModalOpen(false);
  };

  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberFormData({
      name: '',
      email: '',
      phone: '',
      hasAccess: false
    });
    setIsMemberModalOpen(false);
  };

  const resetJinalayaForm = () => {
    setEditingJinalayaId(null);
    setJinalayaFormData({
      name: '',
      village: '',
      route: '',
      mulnayak: '',
      location: '',
      description: '',
      beforeImg: null,
      processImg: null,
      afterImg: null,
      status: 'Plan'
    });
    setIsJinalayaModalOpen(false);
  };

  const handleSaveUpashray = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing
        try {
          await upashraysDB.update(editingId, {
            name: formData.name,
            village: formData.village,
            route: formData.route,
            trusty: formData.trusty,
            mobile: formData.mobile,
            location: formData.location,
            description: formData.description,
            before_img: formData.beforeImg,
            process_img: formData.processImg,
            after_img: formData.afterImg,
            status: formData.status.toLowerCase()
          });
        } catch (dbError) {
          console.log('Database update failed, using local state');
        }
        setUpashrays(upashrays.map(u => u.id === editingId ? { ...formData, id: u.id, reports: u.reports } : u));
      } else {
        // Create new
        try {
          await upashraysDB.create({
            name: formData.name,
            village: formData.village,
            route: formData.route,
            trusty: formData.trusty,
            mobile: formData.mobile,
            location: formData.location,
            description: formData.description,
            before_img: formData.beforeImg,
            process_img: formData.processImg,
            after_img: formData.afterImg,
            status: formData.status.toLowerCase()
          });
        } catch (dbError) {
          console.log('Database create failed, using local state');
        }
        setUpashrays([...upashrays, { ...formData, id: Date.now(), reports: [] }]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving upashray:', error);
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    const code = generateMemberCode(memberFormData.name);
    try {
      if (editingMemberId) {
        // Update existing
        try {
          await membersDB.update(editingMemberId, {
            name: memberFormData.name,
            email: memberFormData.email,
            phone: memberFormData.phone,
            password: memberFormData.password,
            code: code,
            has_access: memberFormData.hasAccess
          });
        } catch (dbError) {
          console.log('Database update failed, using local state');
        }
        setMembers(members.map(m => m.id === editingMemberId ? { ...memberFormData, id: m.id, code } : m));
      } else {
        // Create new
        try {
          await membersDB.create({
            name: memberFormData.name,
            email: memberFormData.email,
            phone: memberFormData.phone,
            password: memberFormData.password,
            code: code,
            has_access: memberFormData.hasAccess
          });
        } catch (dbError) {
          console.log('Database create failed, using local state');
        }
        setMembers([...members, { ...memberFormData, id: Date.now(), code }]);
      }
      resetMemberForm();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleSaveJinalaya = async (e) => {
    e.preventDefault();
    try {
      if (editingJinalayaId) {
        // Update existing
        try {
          await jinalayasDB.update(editingJinalayaId, {
            name: jinalayaFormData.name,
            village: jinalayaFormData.village,
            route: jinalayaFormData.route,
            mulnayak: jinalayaFormData.mulnayak,
            location: jinalayaFormData.location,
            description: jinalayaFormData.description,
            before_img: jinalayaFormData.beforeImg,
            process_img: jinalayaFormData.processImg,
            after_img: jinalayaFormData.afterImg,
            status: jinalayaFormData.status.toLowerCase()
          });
        } catch (dbError) {
          console.log('Database update failed, using local state');
        }
        setJinalayas(jinalayas.map(j => j.id === editingJinalayaId ? { ...jinalayaFormData, id: j.id } : j));
      } else {
        // Create new
        try {
          await jinalayasDB.create({
            name: jinalayaFormData.name,
            village: jinalayaFormData.village,
            route: jinalayaFormData.route,
            mulnayak: jinalayaFormData.mulnayak,
            location: jinalayaFormData.location,
            description: jinalayaFormData.description,
            before_img: jinalayaFormData.beforeImg,
            process_img: jinalayaFormData.processImg,
            after_img: jinalayaFormData.afterImg,
            status: jinalayaFormData.status.toLowerCase()
          });
        } catch (dbError) {
          console.log('Database create failed, using local state');
        }
        setJinalayas([...jinalayas, { ...jinalayaFormData, id: Date.now() }]);
      }
      resetJinalayaForm();
    } catch (error) {
      console.error('Error saving jinalaya:', error);
    }
  };

  const handleSaveCheckingReport = async (e) => {
    e.preventDefault();
    try {
      try {
        await checkingReportsDB.create({
          upashray_id: checkingUpashrayId,
          member_id: currentMemberId,
          report_date: new Date().toISOString().split('T')[0],
          points: checkingReport
        });
      } catch (dbError) {
        console.log('Database create failed, using local state');
      }

      setUpashrays(upashrays.map(u => {
        if (u.id === checkingUpashrayId) {
          return {
            ...u,
            reports: [...(u.reports || []), {
              title: 'Checking Report',
              id: Date.now(),
              date: new Date().toLocaleDateString()
            }]
          };
        }
        return u;
      }));
      setCheckingUpashrayId(null);
      setCheckingReport(CHECKING_POINTS.map((point, index) => ({
        id: index,
        point,
        description: '',
        isChecked: false
      })));
    } catch (error) {
      console.error('Error saving checking report:', error);
    }
  };

  const startEdit = (upashray) => {
    setEditingId(upashray.id);
    setFormData({
      name: upashray.name,
      village: upashray.village || '',
      route: upashray.route || '',
      trusty: upashray.trusty || '',
      mobile: upashray.mobile || '',
      location: upashray.location,
      description: upashray.description,
      beforeImg: upashray.beforeImg,
      processImg: upashray.processImg,
      afterImg: upashray.afterImg,
      status: upashray.status || 'Plan'
    });
    setIsModalOpen(true);
  };

  const startEditMember = (member) => {
    setEditingMemberId(member.id);
    setMemberFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      hasAccess: member.hasAccess
    });
    setIsMemberModalOpen(true);
  };

  const startEditJinalaya = (jinalaya) => {
    setEditingJinalayaId(jinalaya.id);
    setJinalayaFormData({
      name: jinalaya.name,
      village: jinalaya.village || '',
      route: jinalaya.route || '',
      mulnayak: jinalaya.mulnayak || '',
      location: jinalaya.location || '',
      description: jinalaya.description,
      beforeImg: jinalaya.beforeImg,
      processImg: jinalaya.processImg,
      afterImg: jinalaya.afterImg,
      status: jinalaya.status || 'Plan'
    });
    setIsJinalayaModalOpen(true);
  };

  const toggleMemberAccess = async (id) => {
    try {
      const member = members.find(m => m.id === id);
      if (member) {
        const newAccessStatus = !member.hasAccess;
        try {
          await membersDB.update(id, {
            has_access: newAccessStatus
          });
        } catch (dbError) {
          console.log('Database update failed, using local state');
        }
        setMembers(members.map(m => m.id === id ? { ...m, hasAccess: newAccessStatus } : m));
      }
    } catch (error) {
      console.error('Error toggling member access:', error);
    }
  };

  const deleteUpashray = async (id) => {
    try {
      try {
        await upashraysDB.delete(id);
      } catch (dbError) {
        console.log('Database delete failed, using local state');
      }
      setUpashrays(upashrays.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting upashray:', error);
    }
  };

  const deleteMember = async (id) => {
    try {
      try {
        await membersDB.delete(id);
      } catch (dbError) {
        console.log('Database delete failed, using local state');
      }
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const deleteJinalaya = async (id) => {
    try {
      try {
        await jinalayasDB.delete(id);
      } catch (dbError) {
        console.log('Database delete failed, using local state');
      }
      setJinalayas(jinalayas.filter(j => j.id !== id));
    } catch (error) {
      console.error('Error deleting jinalaya:', error);
    }
  };

  if (view === 'login') {
    return (
      <div className="fixed inset-0 z-[200] bg-[#f8f9fa] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 md:p-12 border-l-4 border-[#c5a059] relative shadow-2xl rounded-r-sm">
          <button
            onClick={onBack}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-10">
            <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.5em] uppercase opacity-80 font-bold">
              {initialView === 'admin' ? 'Admin Portal' : initialView === 'member' ? 'Member Portal' : 'Authentication'}
            </span>
            <h2 className="text-3xl md:text-4xl font-headline mt-4 text-gray-900">
              {initialView === 'admin' ? 'Admin Login' : initialView === 'member' ? 'Member Login' : 'Secure Login'}
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-gray-900 focus:border-[#c5a059] outline-none transition-all font-body"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-gray-900 focus:border-[#c5a059] outline-none transition-all font-body"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs font-body tracking-wider font-bold">{error}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-[#c5a059] text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#b08d4a] transition-all duration-300 shadow-xl shadow-[#c5a059]/20"
            >
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="fixed inset-0 w-full h-screen z-[200] bg-[#f8f9fa] flex flex-col overflow-hidden text-[#1a1a1a] admin-portal-view">
        <style>{`
          .admin-portal-view * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .admin-portal-view *::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>
        {/* Admin Header - Light Mode */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:px-16 shrink-0 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8 md:gap-12">
            <span className="text-[#c5a059] font-headline text-lg tracking-widest uppercase font-bold whitespace-nowrap">Admin Portal</span>

            <nav className="flex items-center">
              <button
                onClick={() => setActiveTab('upashrays')}
                className={`px-4 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'upashrays' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Upashrays
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'members' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Members
              </button>
              <button
                onClick={() => setActiveTab('jinalayas')}
                className={`px-4 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'jinalayas' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Jinalayas
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Reports
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-[#c5a059] text-[#c5a059] text-[10px] uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all font-bold whitespace-nowrap ml-4"
          >
            Logout
          </button>
        </header>

        {/* Admin Content - Light Mode */}
        <main className="flex-grow overflow-y-auto overflow-x-hidden p-8 md:p-16 space-y-12">
          {activeTab === 'upashrays' && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 gap-8 md:gap-0">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-headline text-gray-900 mb-2">Upashray Management</h2>
                    <p className="text-gray-500 text-sm font-light">Monitor and update all ongoing renovation projects across the route.</p>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        value={upashraySearch}
                        onChange={(e) => setUpashraySearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full bg-white border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full md:w-auto px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-3 h-[52px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Upashray
                    </button>
                  </div>
                </div>
              </div>

              {/* Upashray List Table */}
              <section className="max-w-5xl mx-auto">
                <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Name</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Village</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Route</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Trusty / Mobile</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {upashrays
                        .filter(u => (u.name || '').toLowerCase().includes((upashraySearch || '').toLowerCase()))
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{u.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.village || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.route || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {u.trusty || '-'}<br />
                              <span className="text-[10px] text-gray-400">{u.mobile || '-'}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${u.status === 'Done' ? 'bg-green-50 text-green-600' :
                                u.status === 'Process' ? 'bg-blue-50 text-blue-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => startEdit(u)}
                                  className="p-2 text-[#c5a059] hover:bg-[#c5a059]/10 rounded-full transition-all title-case text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteUpashray(u.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeTab === 'members' && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 gap-8 md:gap-0">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-headline text-gray-900 mb-2">Member Management</h2>
                    <p className="text-gray-500 text-sm font-light">Manage all members who have access to the Field Member Portal.</p>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full bg-white border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setIsMemberModalOpen(true)}
                      className="w-full md:w-auto px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-3 h-[52px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Member
                    </button>
                  </div>
                </div>
              </div>

              {/* Members List Table */}
              <section className="max-w-5xl mx-auto">
                <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Code</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Name</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone</th>
                        <th className="px-6 py-4 text-center text-[10px] uppercase tracking-widest text-gray-400 font-bold">System Access</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {members
                        .filter(m => (m.name || '').toLowerCase().includes((memberSearch || '').toLowerCase()))
                        .map((m) => (
                          <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block px-3 py-1 bg-gray-100 text-[#c5a059] text-[11px] font-mono font-bold rounded-sm border border-gray-200 min-w-[85px] text-center">
                                {m.code || generateMemberCode(m.name || 'Member')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{m.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.phone || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => toggleMemberAccess(m.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${m.hasAccess ? 'bg-[#c5a059]' : 'bg-gray-200'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${m.hasAccess ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                              <span className={`block text-[8px] uppercase tracking-widest font-bold mt-1 ${m.hasAccess ? 'text-[#c5a059]' : 'text-gray-400'}`}>
                                {m.hasAccess ? 'Access Granted' : 'No Access'}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => startEditMember(m)}
                                  className="p-2 text-[#c5a059] hover:bg-[#c5a059]/10 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteMember(m.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeTab === 'jinalayas' && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 gap-8 md:gap-0">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-headline text-gray-900 mb-2">Jinalaya Management</h2>
                    <p className="text-gray-500 text-sm font-light">Monitor and update all sacred Jinalaya restoration projects.</p>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        value={jinalayaSearch}
                        onChange={(e) => setJinalayaSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full bg-white border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => setIsJinalayaModalOpen(true)}
                      className="w-full md:w-auto px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-3 h-[52px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Jinalaya
                    </button>
                  </div>
                </div>
              </div>

              {/* Jinalaya List Table */}
              <section className="max-w-5xl mx-auto">
                <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Image</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Name</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Location</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Mulnayak</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Status</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {jinalayas
                        .filter(j => (j.name || '').toLowerCase().includes((jinalayaSearch || '').toLowerCase()))
                        .map((j) => (
                          <tr key={j.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-12 h-12 rounded-sm overflow-hidden border border-gray-200 bg-gray-50">
                                {j.afterImg ? (
                                  <img src={j.afterImg} alt={j.name || 'Jinalaya'} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{j.name || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {j.village || '-'}<br />
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider">{j.route || '-'}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{j.mulnayak || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${j.status === 'Done' ? 'bg-green-50 text-green-600' :
                                j.status === 'Process' ? 'bg-blue-50 text-blue-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                {j.status}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => startEditJinalaya(j)}
                                  className="p-2 text-[#c5a059] hover:bg-[#c5a059]/10 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteJinalaya(j.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeTab === 'reports' && (
            <>
              <div className="max-w-5xl mx-auto mb-12">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-headline text-gray-900 mb-2">Member Submissions</h2>
                  <p className="text-gray-500 text-sm font-light">Filter and view checking reports by category, member, or date.</p>
                </div>
                
                {/* Filter Bar - Now placed after the text */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#c5a059]"></div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Upashray Wise</label>
                    <div className="relative">
                      <select 
                        value={reportUpashrayFilter}
                        onChange={(e) => setReportUpashrayFilter(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-xs py-3 px-4 outline-none focus:border-[#c5a059] transition-colors appearance-none cursor-pointer font-bold text-gray-700"
                      >
                        <option value="all">All Upashrays</option>
                        {[...new Set(allReports.map(r => r.upashrayName))].sort().map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Member Wise</label>
                    <div className="relative">
                      <select 
                        value={reportMemberFilter}
                        onChange={(e) => setReportMemberFilter(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-xs py-3 px-4 outline-none focus:border-[#c5a059] transition-colors appearance-none cursor-pointer font-bold text-gray-700"
                      >
                        <option value="all">All Members</option>
                        {[...new Set(allReports.map(r => r.memberName))].sort().map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Date Wise</label>
                    <input 
                      type="date"
                      value={reportDateFilter}
                      onChange={(e) => setReportDateFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs py-3 px-4 outline-none focus:border-[#c5a059] transition-colors font-bold text-gray-700 h-[42px]"
                    />
                  </div>
                </div>
              </div>

              <section className="max-w-5xl mx-auto">
                <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Date</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Reporter</th>
                        <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-gray-400 font-bold">Upashray</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allReports
                        .filter(report => {
                          const matchesUpashray = reportUpashrayFilter === 'all' || report.upashrayName === reportUpashrayFilter;
                          const matchesMember = reportMemberFilter === 'all' || report.memberName === reportMemberFilter;
                          
                          // Handle date filter (converting report.date "DD/MM/YYYY" to "YYYY-MM-DD" for comparison if needed)
                          // But since reportDateFilter is YYYY-MM-DD from input, we compare raw report_date
                          const matchesDate = !reportDateFilter || report.report_date === reportDateFilter;
                          
                          return matchesUpashray && matchesMember && matchesDate;
                        })
                        .length > 0 ? (
                        allReports
                          .filter(report => {
                            const matchesUpashray = reportUpashrayFilter === 'all' || report.upashrayName === reportUpashrayFilter;
                            const matchesMember = reportMemberFilter === 'all' || report.memberName === reportMemberFilter;
                            const matchesDate = !reportDateFilter || report.report_date === reportDateFilter;
                            return matchesUpashray && matchesMember && matchesDate;
                          })
                          .map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{report.memberName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.upashrayName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button
                                  onClick={() => openReportDetail(report)}
                                  className="px-4 py-2 bg-gray-50 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-100 hover:bg-[#c5a059] hover:text-white transition-all"
                                >
                                  View Full Report
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">No reports match your filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* Modal Overlay for Add/Edit Form */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[500] overflow-y-auto p-4">
              <div className="fixed inset-0 bg-black/80" onClick={resetForm}></div>
              <div className="relative bg-white w-full max-w-5xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-headline text-gray-900">{editingId ? 'Edit Upashray' : 'Add New Upashray'}</h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSaveUpashray} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Upashray Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Village Name</label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Route</label>
                      <input
                        type="text"
                        value={formData.route}
                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="e.g., Surat to Girnar"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Trusty Name (Optional)</label>
                        <input
                          type="text"
                          value={formData.trusty}
                          onChange={(e) => setFormData({ ...formData, trusty: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Mobile Number (Optional)</label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Google Map Link</label>
                      <input
                        type="url"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors appearance-none"
                      >
                        <option value="Plan">Plan</option>
                        <option value="Process">Process</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm h-[135px] focus:border-[#c5a059] outline-none transition-colors resize-none"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-8">
                    <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Update Pictures (Before / In-Process / After)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Before</span>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'beforeImg')}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">In-Process</span>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'processImg')}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">After</span>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'afterImg')}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                    >
                      {editingId ? 'Save Changes' : 'Confirm & Save Upashray'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-10 py-5 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Overlay for Add/Edit Member Form */}
          {isMemberModalOpen && (
            <div className="fixed top-0 left-0 w-full h-screen z-[100] overflow-y-auto p-4">
              <div className="fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-sm" onClick={resetMemberForm}></div>
              <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-headline text-gray-900">{editingMemberId ? 'Edit Member' : 'Add New Member'}</h3>
                  <button onClick={resetMemberForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSaveMember} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Full Name</label>
                      <input
                        type="text"
                        value={memberFormData.name}
                        onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="Enter member's full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Auto-Generated Code</label>
                      <div className="w-full bg-gray-100 border border-gray-200 p-4 text-gray-500 text-sm font-mono font-bold select-none cursor-not-allowed">
                        {generateMemberCode(memberFormData.name) || '---'}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">Format: Name(First 2) + GYG022</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Email Address</label>
                      <input
                        type="email"
                        value={memberFormData.email}
                        onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Password</label>
                      <input
                        type="text"
                        value={memberFormData.password}
                        onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="Enter custom password"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Phone Number</label>
                      <input
                        type="tel"
                        value={memberFormData.phone}
                        onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="e.g., +91 98765 43210"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-3 font-bold">Member System Access</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMemberFormData({ ...memberFormData, hasAccess: !memberFormData.hasAccess })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${memberFormData.hasAccess ? 'bg-[#c5a059]' : 'bg-gray-200'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${memberFormData.hasAccess ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${memberFormData.hasAccess ? 'text-[#c5a059]' : 'text-gray-400'}`}>
                          {memberFormData.hasAccess ? 'Access Enabled' : 'Access Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                    >
                      {editingMemberId ? 'Save Changes' : 'Confirm & Save Member'}
                    </button>
                    <button
                      type="button"
                      onClick={resetMemberForm}
                      className="px-10 py-5 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Overlay for Add/Edit Jinalaya Form */}
          {isJinalayaModalOpen && (
            <div className="fixed top-0 left-0 w-full h-screen z-[100] overflow-y-auto p-4">
              <div className="fixed top-0 left-0 w-full h-screen bg-black/60 backdrop-blur-sm" onClick={resetJinalayaForm}></div>
              <div className="relative bg-white w-full max-w-4xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-headline text-gray-900">{editingJinalayaId ? 'Edit Jinalaya' : 'Add New Jinalaya'}</h3>
                  <button onClick={resetJinalayaForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSaveJinalaya} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Jinalaya Name</label>
                      <input
                        type="text"
                        value={jinalayaFormData.name}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Village Name</label>
                      <input
                        type="text"
                        value={jinalayaFormData.village}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, village: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Route</label>
                      <input
                        type="text"
                        value={jinalayaFormData.route}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, route: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="e.g., Main Taleti or Vihar Route"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Google Map Link</label>
                      <input
                        type="url"
                        value={jinalayaFormData.location}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, location: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Mulnayak</label>
                      <input
                        type="text"
                        value={jinalayaFormData.mulnayak}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, mulnayak: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                        placeholder="e.g., Shri Neminath Bhagwan"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Status</label>
                      <select
                        value={jinalayaFormData.status}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, status: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors appearance-none"
                      >
                        <option value="Plan">Plan</option>
                        <option value="Process">Process</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Description</label>
                      <textarea
                        value={jinalayaFormData.description}
                        onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, description: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm h-[135px] focus:border-[#c5a059] outline-none transition-colors resize-none"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-8">
                    <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Update Pictures (Before / In-Process / After)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Before</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setJinalayaFormData({ ...jinalayaFormData, beforeImg: url });
                            }
                          }}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">In-Process</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setJinalayaFormData({ ...jinalayaFormData, processImg: url });
                            }
                          }}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">After</span>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setJinalayaFormData({ ...jinalayaFormData, afterImg: url });
                            }
                          }}
                          className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6 flex gap-4">
                    <button
                      type="submit"
                      className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                    >
                      {editingJinalayaId ? 'Save Changes' : 'Confirm & Save Jinalaya'}
                    </button>
                    <button
                      type="button"
                      onClick={resetJinalayaForm}
                      className="px-10 py-5 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Report Detail Modal */}
          {isReportModalOpen && selectedReport && (
            <div className="fixed inset-0 z-[500] overflow-y-auto p-4 flex items-start justify-center py-12">
              <div className="fixed inset-0 bg-black/80" onClick={() => setIsReportModalOpen(false)}></div>
              
              <div className="relative bg-white w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden animate-fade-in print:shadow-none print:w-full print:max-w-none print:p-0">
                {/* Modal Header - Hidden in Print */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 print:hidden">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Report
                    </button>
                  </div>
                  <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Report Content - This is the "PDF type" styled area */}
                <div id="printable-report" className="p-12 md:p-16 bg-white text-gray-900 print:p-8">
                  {/* Report Branding */}
                  <div className="flex flex-col items-center text-center mb-12 pb-12 border-b-2 border-gray-100">
                    <div className="w-48 h-48 mb-6 flex items-center justify-center">
                      <img src="/images/logo2.png" alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-headline tracking-widest text-gray-900 mb-2 uppercase">Girnar Tirth Yatra Group</h1>
                    <p className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em]">Official Checking Report</p>
                  </div>

                  {/* Report Metadata */}
                  <div className="grid grid-cols-2 gap-12 mb-16">
                    <div className="space-y-4">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Upashray Name</span>
                        <span className="text-xl font-bold text-gray-900">{selectedReport.upashrayName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Location</span>
                        <span className="text-sm text-gray-600">
                          {selectedReport.village || 'N/A'}
                          {selectedReport.route && <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{selectedReport.route}</span>}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 text-right">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Submitted By</span>
                        <span className="text-xl font-bold text-gray-900">{selectedReport.memberName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Submission Date</span>
                        <span className="text-sm text-gray-600">{selectedReport.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Table */}
                  <div className="mb-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 text-[#c5a059]">Checklist Details</h3>
                    <div className="space-y-0 border border-gray-200 rounded-sm">
                      {Array.isArray(selectedReport.points) ? selectedReport.points.map((item, index) => (
                        <div key={index} className={`flex items-start p-6 ${index !== selectedReport.points.length - 1 ? 'border-b border-gray-100' : ''} ${item.isChecked ? 'bg-gray-50/50' : ''}`}>
                          <div className="flex-shrink-0 mt-1 mr-6">
                            {item.isChecked ? (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-gray-100"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-800 mb-2 leading-relaxed font-body">{item.point}</p>
                            {item.description && (
                              <div className="mt-3 p-4 bg-white border-l-2 border-[#c5a059] rounded-sm italic text-gray-600 text-sm font-body">
                                "{item.description}"
                              </div>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-gray-400 italic">No checklist data available.</div>
                      )}
                    </div>
                  </div>

                  {/* Footer Branding */}
                  <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium italic">
                      This is a computer-generated report of the Girnar Tirth Yatra Group Portal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (view === 'member') {
    return (
      <div className="fixed inset-0 w-full h-screen z-[200] bg-[#f8f9fa] flex flex-col overflow-hidden text-[#1a1a1a] member-portal-view">
        <style>{`
          .member-portal-view * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .member-portal-view *::-webkit-scrollbar {
            display: none !important;
          }
        `}</style>

        {/* Member Header - Light Mode */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:px-16 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-[#c5a059] font-headline text-lg tracking-widest uppercase font-bold">Member Portal</span>
            <span className="h-4 w-[1px] bg-gray-300"></span>
            <span className="text-gray-500 text-xs uppercase tracking-widest font-body">Upashray Reports</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-[#c5a059] text-[#c5a059] text-[10px] uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all font-bold"
          >
            Logout
          </button>
        </header>

        <main className="flex-grow overflow-y-auto overflow-x-hidden p-8 md:p-16 space-y-12">
          <section className="max-w-5xl mx-auto">
            {/* Checking Report Modal Overlay */}
            {checkingUpashrayId && (
              <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80" onClick={() => setCheckingUpashrayId(null)}></div>
                <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-headline text-gray-900 mb-2">Upashray Yearly Checking Report</h3>
                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-sm border border-gray-100">
                        <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Upashray</strong> {upashrays.find(u => u.id === checkingUpashrayId)?.name}</span>
                        <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Village</strong> {upashrays.find(u => u.id === checkingUpashrayId)?.village}</span>
                        <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Route</strong> {upashrays.find(u => u.id === checkingUpashrayId)?.route}</span>
                        <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Trusty</strong> {upashrays.find(u => u.id === checkingUpashrayId)?.trusty || '-'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCheckingUpashrayId(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveCheckingReport}>
                    <div className="border border-gray-100 rounded-sm mb-8 bg-white shadow-inner overflow-hidden">
                      {/* Desktop Table View */}
                      <table className="hidden md:table w-full border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-left border-r border-gray-100 w-[60%]">Points / વિગત</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-left border-r border-gray-100 w-[30%]">Description / વિગત</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center w-[10%]">Verified / ચેક</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {checkingReport.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4 border-r border-gray-100 align-top">
                                <div className="flex items-start">
                                  <span className="text-[#c5a059] mr-2 font-bold text-xs">{index + 1}.</span>
                                  <span className="text-[11px] text-gray-800 leading-relaxed font-body">{item.point}</span>
                                </div>
                              </td>
                              <td className="p-4 border-r border-gray-100 align-middle">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const newReport = [...checkingReport];
                                    newReport[index].description = e.target.value;
                                    setCheckingReport(newReport);
                                  }}
                                  placeholder="Enter details..."
                                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2 text-xs focus:border-[#c5a059] outline-none transition-all rounded-sm shadow-sm"
                                />
                              </td>
                              <td className="p-4 text-center align-middle">
                                <input
                                  type="checkbox"
                                  checked={item.isChecked}
                                  onChange={(e) => {
                                    const newReport = [...checkingReport];
                                    newReport[index].isChecked = e.target.checked;
                                    setCheckingReport(newReport);
                                  }}
                                  className="w-5 h-5 accent-[#c5a059] cursor-pointer rounded-sm"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile Stacked View */}
                      <div className="md:hidden divide-y divide-gray-100">
                        {checkingReport.map((item, index) => (
                          <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                            {/* Point Text */}
                            <div className="text-sm text-gray-800 leading-relaxed font-body mb-4">
                              <span className="text-[#c5a059] mr-3 font-bold text-lg">{index + 1}.</span>
                              {item.point}
                            </div>

                            <div className="space-y-4">
                              {/* Description Input */}
                              <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Description / વિગત</label>
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const newReport = [...checkingReport];
                                    newReport[index].description = e.target.value;
                                    setCheckingReport(newReport);
                                  }}
                                  placeholder="Enter details here..."
                                  className="w-full bg-gray-50 border border-gray-200 px-6 py-4 text-sm focus:border-[#c5a059] outline-none transition-all rounded-sm shadow-sm"
                                />
                              </div>

                              {/* Checkbox */}
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-sm">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Verified / ચેક</label>
                                <input
                                  type="checkbox"
                                  checked={item.isChecked}
                                  onChange={(e) => {
                                    const newReport = [...checkingReport];
                                    newReport[index].isChecked = e.target.checked;
                                    setCheckingReport(newReport);
                                  }}
                                  className="w-8 h-8 accent-[#c5a059] cursor-pointer rounded-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4 sm:gap-6 mt-8">
                      <button
                        type="button"
                        onClick={() => setCheckingUpashrayId(null)}
                        className="w-full sm:w-auto px-10 py-4 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-12 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                      >
                        Save Report
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold w-32">Image</th>
                    <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Upashray Details</th>
                    <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Latest Reports</th>
                    <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upashrays.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-6">
                        <div className="w-20 h-20 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={u.afterImg} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-gray-900 text-sm font-bold tracking-wider mb-1 uppercase">{u.name}</div>
                        <div className={`text-[9px] inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${u.status === 'Done' ? 'bg-green-100 text-green-600' :
                          u.status === 'Process' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                          {u.status || 'Plan'}
                        </div>
                      </td>
                      <td className="p-6">
                        {u.reports && u.reports.length > 0 ? (
                          <div className="space-y-2">
                            {u.reports.slice(-2).map(r => (
                              <div key={r.id} className="text-[10px] border-l-2 border-[#c5a059] pl-2 py-0.5">
                                <span className="font-bold text-gray-700 block">{r.title}</span>
                                <span className="text-gray-400">{r.date}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-[10px] uppercase tracking-widest">No reports yet</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => setCheckingUpashrayId(u.id)}
                          className="px-6 py-3 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#b08d4a] transition-all rounded-sm shadow-md"
                        >
                          Add Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return null;
};