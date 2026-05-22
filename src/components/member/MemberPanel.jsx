import React, { useEffect } from 'react';
import UpashrayReportsTab from './tabs/UpashrayReportsTab';
import JinalayaReportsTab from './tabs/JinalayaReportsTab';
import MyReportsTab from './tabs/MyReportsTab';
import CheckingReportModal from './modals/CheckingReportModal';
import ReportDetailModal from '../admin/modals/ReportDetailModal';

const MemberPanel = ({ 
  memberActiveTab, 
  setMemberActiveTab, 
  loadedData,
  loadReports,
  loadUpashrayReports,
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  handleLogout,
  upashrays,
  jinalayas,
  setCheckingUpashrayId,
  checkingUpashrayId,
  setCheckingJinalayaId,
  checkingJinalayaId,
  handleSaveCheckingReport,
  checkingReport,
  setCheckingReport,
  removePointImage,
  handlePointImageUpload,
  generalNotes,
  setGeneralNotes,
  allReports,
  currentMemberId,
  setSelectedReport,
  setIsReportModalOpen,
  isReportModalOpen,
  selectedReport
}) => {
  useEffect(() => {
    if (memberActiveTab === 'upashray-reports') {
      loadUpashrayReports();
    }
    if (memberActiveTab === 'my-reports' && !loadedData.reports) {
      loadReports();
    }
  }, [memberActiveTab, loadedData]);

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
              onClick={() => setMemberActiveTab('jinalaya-reports')}
              className={`px-4 h-full text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 flex items-center ${memberActiveTab === 'jinalaya-reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Jinalaya Reports
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
                  onClick={() => { setMemberActiveTab('jinalaya-reports'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${memberActiveTab === 'jinalaya-reports' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
                >
                  Jinalaya Reports
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
            <UpashrayReportsTab 
              upashrays={upashrays}
              setCheckingUpashrayId={setCheckingUpashrayId}
            />
          ) : memberActiveTab === 'jinalaya-reports' ? (
            <JinalayaReportsTab
              jinalayas={jinalayas}
              setCheckingJinalayaId={setCheckingJinalayaId}
            />
          ) : (
            <MyReportsTab 
              allReports={allReports}
              currentMemberId={currentMemberId}
              setSelectedReport={setSelectedReport}
              setIsReportModalOpen={setIsReportModalOpen}
            />
          )}
        </section>
      </main>

      <CheckingReportModal 
        checkingUpashrayId={checkingUpashrayId}
        setCheckingUpashrayId={setCheckingUpashrayId}
        checkingJinalayaId={checkingJinalayaId}
        setCheckingJinalayaId={setCheckingJinalayaId}
        upashrays={upashrays}
        jinalayas={jinalayas}
        handleSaveCheckingReport={handleSaveCheckingReport}
        checkingReport={checkingReport}
        setCheckingReport={setCheckingReport}
        removePointImage={removePointImage}
        handlePointImageUpload={handlePointImageUpload}
        generalNotes={generalNotes}
        setGeneralNotes={setGeneralNotes}
      />

      <ReportDetailModal 
        isReportModalOpen={isReportModalOpen}
        selectedReport={selectedReport}
        setIsReportModalOpen={setIsReportModalOpen}
      />
    </div>
  );
};

export default MemberPanel;
