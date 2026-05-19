import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { upashraysDB, membersDB, jinalayasDB, checkingReportsDB, adminProfilesDB, yatrikRegistrationsDB, yatraDatesDB } from '../lib/database.js';

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

  // Form State for Yatra Dates
  const [yatraDateFormData, setYatraDateFormData] = useState({
    date_text: '',
    description: '',
    image: '',
    registration_open: true
  });
  const [isYatraDateModalOpen, setIsYatraDateModalOpen] = useState(false);
  const [editingYatraDateId, setEditingYatraDateId] = useState(null);

  // State for Checking Report
  const [checkingReport, setCheckingReport] = useState(CHECKING_POINTS.map((point, index) => ({
    id: index,
    point,
    description: '',
    isChecked: false,
    images: []
  })));
  const [generalNotes, setGeneralNotes] = useState('');

  // Load data from database
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [upashraysData, membersData, jinalayasData, reportsData, busData, datesData] = await Promise.all([
        upashraysDB.getAll().catch(err => { console.error('Upashrays load error:', err); return []; }),
        membersDB.getAll().catch(err => { console.error('Members load error:', err); return []; }),
        jinalayasDB.getAll().catch(err => { console.error('Jinalayas load error:', err); return []; }),
        checkingReportsDB.getAll().catch(err => { console.error('Reports load error:', err); return []; }),
        yatrikRegistrationsDB.getAll().catch(err => { console.error('Bus Yatra load error:', err); return []; }),
        yatraDatesDB.getAll().catch(err => { console.error('Yatra Dates load error:', err); return []; })
      ]);

      setBusRegistrations(busData || []);
      setYatraDates((datesData || []).map(d => ({
        ...d,
        registration_open: d.registration_open !== false // Default to true unless explicitly false
      })));

      if (Array.isArray(upashraysData)) {
        setUpashrays(upashraysData.map(u => {
          if (!u) return null;
          // Find reports for this upashray
          const uReports = Array.isArray(reportsData)
            ? reportsData
              .filter(r => r && String(r.upashray_id) === String(u.id))
              .map(r => ({
                ...r,
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

  const openReportAndPrint = (report) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report');
      return;
    }

    const pointsHtml = Array.isArray(report.points) 
      ? report.points.map((item, index) => `
        <div class="flex items-start py-5 px-8 ${index !== report.points.length - 1 ? 'border-b border-gray-100' : ''} ${item.isChecked ? 'bg-gray-50/50' : ''}">
          <div class="flex-shrink-0 mt-1.5 mr-6">
            ${item.isChecked ? `
              <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ` : `
              <div class="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                <div class="w-2 h-2 rounded-full bg-gray-100"></div>
              </div>
            `}
          </div>
          <div class="flex-grow">
            <p class="text-[14px] font-medium text-gray-800 leading-relaxed font-body">${item.point}</p>
            ${item.description ? `
              <div class="mt-3 p-4 bg-white border-l-2 border-[#c5a059] italic text-gray-600 text-[13px] font-body shadow-sm">
                "${item.description}"
              </div>
            ` : ''}
            
            ${item.images && item.images.length > 0 ? `
              <div class="flex flex-wrap gap-5 mt-6">
                ${item.images.map(img => `
                  <div class="w-56 h-56 rounded-sm overflow-hidden border-2 border-gray-100 shadow-md bg-gray-50 page-break-inside-avoid">
                    <img src="${img}" class="w-full h-full object-cover" />
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')
      : '<div class="p-12 text-center text-gray-400 italic text-lg">No checklist data available.</div>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report - ${report.upashrayName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,200;0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;0,6..72,800;1,6..72,400&display=swap" rel="stylesheet">
          <style>
            @theme {
              --font-headline: "Newsreader", serif;
              --font-body: "Manrope", sans-serif;
            }
            body { 
              font-family: "Manrope", sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0;
              padding: 0;
              background: white;
            }
            .font-headline { font-family: "Newsreader", serif; }
            @media print {
              @page { 
                size: A4; 
                margin: 15mm; 
              }
              body { margin: 0; padding: 0; }
              .page-break-inside-avoid {
                page-break-inside: avoid;
              }
            }
            .report-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 10mm;
            }
          </style>
        </head>
        <body class="bg-white">
          <div class="report-container">
            <!-- Header Section - Balanced & Centered -->
            <div class="flex flex-col items-center text-center mb-10 pb-10 border-b border-gray-100">
              <div class="w-32 h-32 mb-6 flex items-center justify-center">
                <img src="/images/logo2.png" alt="Logo" class="max-w-full max-h-full object-contain" />
              </div>
              <h1 class="text-3xl font-headline tracking-[0.12em] text-gray-900 uppercase mb-3">Girnar Tirth Yatra Group</h1>
              <p class="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.4em] opacity-80">Official Checking Report</p>
            </div>

            <!-- Metadata Section - Grid Layout -->
            <div class="grid grid-cols-2 gap-x-16 gap-y-10 mb-16 px-4">
              <div class="space-y-6">
                <div>
                  <span class="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Upashray Name</span>
                  <span class="text-2xl font-bold text-gray-900">${report.upashrayName}</span>
                </div>
                <div>
                  <span class="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Location</span>
                  <span class="text-lg text-gray-600">
                    ${report.village || 'N/A'}
                    ${report.route ? `<span class="block text-xs text-gray-400 uppercase tracking-wider mt-1">${report.route}</span>` : ''}
                  </span>
                </div>
              </div>
              <div class="space-y-6 text-right">
                <div>
                  <span class="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Submitted By</span>
                  <span class="text-2xl font-bold text-gray-900">${report.memberName}</span>
                </div>
                <div>
                  <span class="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Submission Date</span>
                  <span class="text-lg font-bold text-gray-900">${report.date}</span>
                </div>
              </div>
            </div>

            <!-- Checklist Section -->
            <div class="mb-12">
              <h3 class="text-sm font-bold uppercase tracking-widest mb-8 pb-3 border-b border-gray-200 text-[#c5a059]">Checklist Details</h3>
              <div class="border border-gray-100 rounded-sm shadow-sm">
                ${pointsHtml}
              </div>
            </div>

            ${report.general_notes ? `
              <!-- General Remarks Section -->
              <div class="mb-12 page-break-inside-avoid">
                <h3 class="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 text-[#c5a059]">General Remarks</h3>
                <div class="p-6 bg-gray-50 border border-gray-100 rounded-sm text-gray-700 italic leading-relaxed text-sm">
                  "${report.general_notes}"
                </div>
              </div>
            ` : ''}

            <!-- Footer Branding -->
            <div class="mt-20 pt-10 border-t border-gray-100 text-center opacity-50">
              <p class="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium italic">
                This is a computer-generated report of the Girnar Tirth Yatra Group Portal.
              </p>
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

  const handlePointImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newReport = [...checkingReport];
      newReport[index].images = [...(newReport[index].images || []), reader.result];
      setCheckingReport(newReport);
    };
    reader.readAsDataURL(file);
  };

  const removePointImage = (pointIndex, imgIndex) => {
    const newReport = [...checkingReport];
    newReport[pointIndex].images = newReport[pointIndex].images.filter((_, i) => i !== imgIndex);
    setCheckingReport(newReport);
  };

  const handleSaveCheckingReport = async (e) => {
    e.preventDefault();
    try {
      const newReportData = {
        id: Date.now(),
        upashray_id: checkingUpashrayId,
        member_id: currentMemberId,
        report_date: new Date().toISOString().split('T')[0],
        points: checkingReport,
        general_notes: generalNotes,
        title: 'Checking Report',
        date: new Date().toLocaleDateString()
      };

      try {
        await checkingReportsDB.create(newReportData);
      } catch (dbError) {
        console.log('Database create failed, using local state');
      }

      setUpashrays(upashrays.map(u => {
        if (String(u.id) === String(checkingUpashrayId)) {
          return {
            ...u,
            reports: [
              newReportData,
              ...(u.reports || [])
            ]
          };
        }
        return u;
      }));
      
      // Also update allReports for admin view if needed (though usually admin and member are separate sessions)
      setAllReports(prev => [
        {
          ...newReportData,
          upashrayName: upashrays.find(u => String(u.id) === String(checkingUpashrayId))?.name || 'Unknown',
          memberName: members.find(m => String(m.id) === String(currentMemberId))?.name || 'Me'
        },
        ...prev
      ]);
      setCheckingUpashrayId(null);
      setGeneralNotes('');
      setCheckingReport(CHECKING_POINTS.map((point, index) => ({
        id: index,
        point,
        description: '',
        isChecked: false,
        images: []
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

  const deleteBusRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      await yatrikRegistrationsDB.delete(id);
      setBusRegistrations(busRegistrations.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Failed to delete registration');
    }
  };

  const handleYatraFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setYatraDateFormData({ ...yatraDateFormData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleYatraDateSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingYatraDateId) {
        const updated = await yatraDatesDB.update(editingYatraDateId, yatraDateFormData);
        const mappedUpdated = {
          ...updated,
          registration_open: updated.registration_open !== false
        };
        setYatraDates(yatraDates.map(d => d.id === editingYatraDateId ? mappedUpdated : d));
      } else {
        const created = await yatraDatesDB.create(yatraDateFormData);
        const mappedCreated = {
          ...created,
          registration_open: created.registration_open !== false
        };
        setYatraDates([mappedCreated, ...yatraDates]);
      }
      setIsYatraDateModalOpen(false);
      setEditingYatraDateId(null);
      setYatraDateFormData({ date_text: '', description: '', image: '', registration_open: true });
    } catch (error) {
      console.error('Error saving yatra date:', error);
      alert('Failed to save yatra date');
    }
  };

  const deleteYatraDate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this yatra date? All associated registrations will be lost.')) return;
    try {
      await yatraDatesDB.delete(id);
      setYatraDates(yatraDates.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting yatra date:', error);
      alert('Failed to delete yatra date');
    }
  };

  const toggleRegistrationStatus = async (id, currentStatus) => {
    try {
      const updated = await yatraDatesDB.update(id, { registration_open: !currentStatus });
      const mappedUpdated = {
        ...updated,
        registration_open: updated.registration_open !== false
      };
      setYatraDates(yatraDates.map(d => d.id === id ? mappedUpdated : d));
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle registration status');
    }
  };

  const exportRegistrationsToCSV = () => {
    const filteredRegs = busRegistrations.filter(reg => 
      registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter)
    );

    if (filteredRegs.length === 0) {
      alert('No registrations to export');
      return;
    }

    const headers = ['Yatra Date', 'First Name', 'Last Name', 'Phone', 'Alt Phone', 'Gender', 'Birthdate', 'Village', 'Remarks'];
    const csvRows = [
      headers.join(','),
      ...filteredRegs.map(reg => {
        const yatraDate = yatraDates.find(d => String(d.id) === String(reg.yatra_id))?.date_text || 'Unknown';
        return [
          `"${yatraDate}"`,
          `"${reg.first_name}"`,
          `"${reg.last_name}"`,
          `"${reg.phone}"`,
          `"${reg.alt_phone || ''}"`,
          `"${reg.gender}"`,
          `"${reg.birthdate}"`,
          `"${reg.village}"`,
          `"${reg.remarks || ''}"`
        ].join(',');
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bus_yatra_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-16 shrink-0 shadow-sm relative z-[250]">
          <div className="flex items-center gap-4 md:gap-12">
            {/* Hamburger Menu - Mobile Only */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-[#c5a059] transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <span className="text-[#c5a059] font-headline text-lg tracking-widest uppercase font-bold whitespace-nowrap">Admin Portal</span>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <button
                onClick={() => setActiveTab('upashrays')}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'upashrays' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Upashrays
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'members' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Members
              </button>
              <button
                onClick={() => setActiveTab('jinalayas')}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'jinalayas' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Manage Jinalayas
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab('bus-yatra')}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'bus-yatra' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                Bus Yatra
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden sm:block px-6 py-2 border border-[#c5a059] text-[#c5a059] text-[10px] uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all font-bold whitespace-nowrap"
            >
              Logout
            </button>
            {/* Small Logout Icon for very small screens */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl md:hidden animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col p-4">
                {[
                  { id: 'upashrays', label: 'Manage Upashrays' },
                  { id: 'members', label: 'Manage Members' },
                  { id: 'jinalayas', label: 'Manage Jinalayas' },
                  { id: 'reports', label: 'Reports' },
                  { id: 'bus-yatra', label: 'Bus Yatra' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === tab.id 
                      ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
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

          {activeTab === 'bus-yatra' && (
            <>
              <div className="max-w-5xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end mb-12 gap-8 md:gap-0">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-headline text-gray-900 mb-2">Bus Yatra Management</h2>
                    <p className="text-gray-500 text-sm font-light">Manage yatra dates and view registrations.</p>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        value={yatraSearch}
                        onChange={(e) => setYatraSearch(e.target.value)}
                        placeholder="Search yatra date..."
                        className="w-full bg-white border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#c5a059] outline-none transition-all h-[52px]"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <button
                      onClick={() => {
                        setEditingYatraDateId(null);
                        setYatraDateFormData({ date_text: '', description: '', image: '', registration_open: true });
                        setIsYatraDateModalOpen(true);
                      }}
                      className="w-full md:w-auto px-8 py-4 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-3 h-[52px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Yatra Date
                    </button>
                  </div>
                </div>

                {/* Yatra Dates Table */}
                <div className="mb-12">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#c5a059]">Yatra Dates</h3>
                  <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatra Date</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Image</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Description</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatriks</th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Registration</th>
                          <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {yatraDates
                          .filter(date => (date.date_text || '').toLowerCase().includes((yatraSearch || '').toLowerCase()))
                          .length > 0 ? (
                          yatraDates
                            .filter(date => (date.date_text || '').toLowerCase().includes((yatraSearch || '').toLowerCase()))
                            .map((date) => {
                            const registrationCount = busRegistrations.filter(r => String(r.yatra_id) === String(date.id)).length;
                            return (
                              <tr key={date.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{date.date_text}</td>
                                <td className="px-6 py-4">
                                  <div className="w-12 h-12 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                                    {date.image ? (
                                      <img src={date.image} alt="Yatra" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{date.description || '-'}</td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-gray-100 text-[#c5a059] text-[10px] font-bold rounded-full">
                                    {registrationCount} Registered
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => toggleRegistrationStatus(date.id, date.registration_open)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${date.registration_open ? 'bg-green-500' : 'bg-gray-300'}`}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${date.registration_open ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                    <span className="sr-only">{date.registration_open ? 'ON' : 'OFF'}</span>
                                  </button>
                                  <span className={`ml-3 text-[10px] font-bold uppercase tracking-wider ${date.registration_open ? 'text-green-600' : 'text-gray-400'}`}>
                                    {date.registration_open ? 'Open' : 'Closed'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingYatraDateId(date.id);
                                      setYatraDateFormData({
                                        date_text: date.date_text,
                                        description: date.description || '',
                                        image: date.image || '',
                                        registration_open: date.registration_open
                                      });
                                      setIsYatraDateModalOpen(true);
                                    }}
                                    className="p-2 text-gray-400 hover:text-[#c5a059] transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteYatraDate(date.id)}
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No yatra dates matching your search.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 gap-6">
                  <div className="w-full md:w-auto">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059] mb-4">Registration Filter</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-64">
                        <select 
                          value={registrationYatraFilter}
                          onChange={(e) => setRegistrationYatraFilter(e.target.value)}
                          className="w-full bg-white border border-gray-200 text-xs py-3 px-4 outline-none focus:border-[#c5a059] transition-colors appearance-none cursor-pointer font-bold text-gray-700 h-[52px] rounded-sm shadow-sm"
                        >
                          <option value="all">All Yatra Dates</option>
                          {yatraDates.map(date => (
                            <option key={date.id} value={date.id}>{date.date_text}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <button
                        onClick={exportRegistrationsToCSV}
                        className="px-6 py-4 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-green-600/10 hover:bg-green-700 transition-all flex items-center justify-center gap-2 h-[52px]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <section className="max-w-5xl mx-auto">
                <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
                  <table className="w-full min-w-[900px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatra Date</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatrik Name</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Contact</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Gender</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Remarks</th>
                        <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {busRegistrations
                        .filter(reg => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter))
                        .length > 0 ? (
                        busRegistrations
                          .filter(reg => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter))
                          .map((reg) => {
                            const yatraDate = yatraDates.find(d => String(d.id) === String(reg.yatra_id))?.date_text || 'Unknown';
                            return (
                              <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-[#c5a059] uppercase tracking-wider">{yatraDate}</td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-bold text-gray-900">{reg.first_name} {reg.last_name}</div>
                                  <div className="text-[10px] text-gray-400">DOB: {reg.birthdate}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600">{reg.phone}</div>
                                  {reg.alt_phone && <div className="text-[10px] text-gray-400">Alt: {reg.alt_phone}</div>}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-sm border border-gray-200">
                                    {reg.gender}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{reg.remarks || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => deleteBusRegistration(reg.id)}
                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No bus yatra registrations found for this date.</td>
                        </tr>
                      )}
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
                              <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                                <button
                                  onClick={() => openReportDetail(report)}
                                  className="px-4 py-2 bg-gray-50 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-100 hover:bg-[#c5a059] hover:text-white transition-all"
                                >
                                  View Full Report
                                </button>
                                <button
                                  onClick={() => openReportAndPrint(report)}
                                  className="px-4 py-2 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-[#c5a059]/10 hover:bg-[#b08d4a] transition-all flex items-center gap-2"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                  </svg>
                                  Print
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
                <div className="flex justify-end items-center p-6 border-b border-gray-100 bg-gray-50 print:hidden">
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
                            
                            {item.images && item.images.length > 0 && (
                              <div className="flex flex-wrap gap-5 mt-6">
                                {item.images.map((img, imgIdx) => (
                                  <div key={imgIdx} className="w-56 h-56 rounded-sm overflow-hidden border-2 border-gray-100 shadow-md bg-gray-50">
                                    <img src={img} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center text-gray-400 italic">No checklist data available.</div>
                      )}
                    </div>
                  </div>

                  {selectedReport.general_notes && (
                    <div className="mb-12">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 text-[#c5a059]">General Remarks</h3>
                      <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm text-gray-700 italic leading-relaxed text-sm">
                        "{selectedReport.general_notes}"
                      </div>
                    </div>
                  )}

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

        {/* Yatra Date Modal */}
        {isYatraDateModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80" onClick={() => setIsYatraDateModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-fade-in">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  {editingYatraDateId ? 'Edit Yatra Date' : 'Add New Yatra Date'}
                </h3>
                <button onClick={() => setIsYatraDateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleYatraDateSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Date Text (e.g. 15th May 2024)</label>
                  <input
                    type="text"
                    required
                    value={yatraDateFormData.date_text}
                    onChange={(e) => setYatraDateFormData({ ...yatraDateFormData, date_text: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                    placeholder="Enter yatra date description"
                  />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Yatra Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 border border-dashed border-gray-300 rounded-sm overflow-hidden flex items-center justify-center relative">
                        {yatraDateFormData.image ? (
                          <img src={yatraDateFormData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleYatraFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold">Click to upload photo</p>
                        {yatraDateFormData.image && (
                          <button 
                            type="button"
                            onClick={() => setYatraDateFormData({ ...yatraDateFormData, image: '' })}
                            className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Short Description</label>
                  <textarea
                    value={yatraDateFormData.description}
                    onChange={(e) => setYatraDateFormData({ ...yatraDateFormData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors h-24 resize-none"
                    placeholder="Optional details about this yatra"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Open for Registration</h4>
                    <p className="text-[10px] text-gray-400">Toggle whether users can sign up for this date.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setYatraDateFormData({ ...yatraDateFormData, registration_open: !yatraDateFormData.registration_open })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${yatraDateFormData.registration_open ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${yatraDateFormData.registration_open ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                  >
                    {editingYatraDateId ? 'Update Yatra Date' : 'Save Yatra Date'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:px-16 shrink-0 shadow-sm relative z-[250]">
          <div className="flex items-center gap-8">
            <span className="text-[#c5a059] font-headline text-lg tracking-widest uppercase font-bold whitespace-nowrap">Member Portal</span>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center h-20">
              <button
                onClick={() => setMemberActiveTab('upashray-reports')}
                className={`px-4 h-full text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 flex items-center ${memberActiveTab === 'upashray-reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Upashray Reports
              </button>
              <button
                onClick={() => setMemberActiveTab('my-reports')}
                className={`px-4 h-full text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 flex items-center ${memberActiveTab === 'my-reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                My Reports
              </button>
            </nav>

            {/* Mobile Nav Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-[#c5a059] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-[#c5a059] text-[#c5a059] text-[10px] uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all font-bold whitespace-nowrap"
          >
            Logout
          </button>

          {/* Mobile Menu Overlay for Members */}
          {isMobileMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl md:hidden animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col p-4">
                <button
                  onClick={() => { setMemberActiveTab('upashray-reports'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${memberActiveTab === 'upashray-reports' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
                >
                  Upashray Reports
                </button>
                <button
                  onClick={() => { setMemberActiveTab('my-reports'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${memberActiveTab === 'my-reports' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
                >
                  My Reports
                </button>
              </nav>
            </div>
          )}
        </header>

        <main className="flex-grow overflow-y-auto overflow-x-hidden p-8 md:p-16 space-y-12">
          <section className="max-w-5xl mx-auto">
            {memberActiveTab === 'upashray-reports' ? (
              <>
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
                                      <div className="flex-grow">
                                        <span className="text-[11px] text-gray-800 leading-relaxed font-body block mb-3">{item.point}</span>
                                        
                                        {/* Images Preview & Upload */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {item.images && item.images.map((img, imgIdx) => (
                                            <div key={imgIdx} className="relative w-12 h-12 group">
                                              <img src={img} className="w-full h-full object-cover rounded-sm border border-gray-200" />
                                              <button 
                                                type="button"
                                                onClick={() => removePointImage(index, imgIdx)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                                              >×</button>
                                            </div>
                                          ))}
                                          <label className="w-12 h-12 border-2 border-dashed border-gray-200 rounded-sm flex items-center justify-center cursor-pointer hover:border-[#c5a059] transition-colors">
                                            <input 
                                              type="file" 
                                              accept="image/*" 
                                              capture="environment"
                                              onChange={(e) => handlePointImageUpload(index, e.target.files[0])}
                                              className="hidden" 
                                            />
                                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                          </label>
                                        </div>
                                      </div>
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
                                  {/* Images Preview & Upload - Mobile */}
                                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3">Pictures / ફોટા</label>
                                    <div className="flex flex-wrap gap-3">
                                      {item.images && item.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative w-16 h-16 group">
                                          <img src={img} className="w-full h-full object-cover rounded-sm border border-gray-200" />
                                          <button 
                                            type="button"
                                            onClick={() => removePointImage(index, imgIdx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md"
                                          >×</button>
                                        </div>
                                      ))}
                                      <label className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-[#c5a059] transition-colors bg-white">
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          capture="environment"
                                          onChange={(e) => handlePointImageUpload(index, e.target.files[0])}
                                          className="hidden" 
                                        />
                                        <svg className="w-6 h-6 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        </svg>
                                        <span className="text-[8px] text-gray-400 uppercase font-bold">Add</span>
                                      </label>
                                    </div>
                                  </div>

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

                        <div className="mt-8">
                          <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">General Remarks / વધારાની વિગત</label>
                          <textarea
                            value={generalNotes}
                            onChange={(e) => setGeneralNotes(e.target.value)}
                            placeholder="Any additional observation or general feedback..."
                            className="w-full bg-white border border-gray-200 p-4 text-sm focus:border-[#c5a059] outline-none transition-all rounded-sm shadow-sm h-32 resize-none"
                          />
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
                              <div className="text-[10px] border-l-2 border-[#c5a059] pl-2 py-0.5">
                                <span className="font-bold text-gray-700 block">{u.reports[0].title}</span>
                                <span className="text-gray-400">{u.reports[0].date}</span>
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
              </>
            ) : (
              <div className="bg-white overflow-hidden shadow-md rounded-sm border border-gray-100">
                <div className="p-6 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">My Submitted Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Date</th>
                        <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Upashray</th>
                        <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Location</th>
                        <th className="px-6 py-4 text-right text-gray-400 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allReports.filter(r => String(r.member_id) === String(currentMemberId))
                        .sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0)).length > 0 ? (
                        allReports.filter(r => String(r.member_id) === String(currentMemberId))
                          .sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0))
                          .map((report, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-bold">{report.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">{report.upashrayName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                {report.village}
                                <span className="block text-[9px] text-gray-400 uppercase tracking-tighter">{report.route}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setIsReportModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-gray-50 text-[#c5a059] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-gray-100 hover:bg-[#c5a059] hover:text-white transition-all"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-20 text-center text-gray-300 italic uppercase tracking-widest text-[10px]">You haven't submitted any reports yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return null;
};