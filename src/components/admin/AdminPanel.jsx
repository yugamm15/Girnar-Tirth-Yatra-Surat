import React, { useEffect } from 'react';
import UpashraysTab from './tabs/UpashraysTab';
import BusYatraTab from './tabs/BusYatraTab';
import MembersTab from './tabs/MembersTab';
import JinalayasTab from './tabs/JinalayasTab';
import ReportsTab from './tabs/ReportsTab';
import UpashrayModal from './modals/UpashrayModal';
import MemberModal from './modals/MemberModal';
import JinalayaModal from './modals/JinalayaModal';
import YatraDateModal from './modals/YatraDateModal';
import ReportDetailModal from './modals/ReportDetailModal';

const AdminPanel = ({ 
  activeTab, 
  setActiveTab, 
  loadedData,
  loadMembers,
  loadJinalayas,
  loadReports,
  loadBusYatra,
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  handleLogout,
  // Upashray props
  upashrays, upashraySearch, setUpashraySearch, setIsModalOpen, startEdit, deleteUpashray,
  isModalOpen, resetForm, editingId, formData, setFormData, handleSaveUpashray, handleMultipleFilesChange, removeMediaFile, deleteExistingMedia,
  // Bus Yatra props
  yatraSearch, setYatraSearch, setEditingYatraDateId, setYatraDateFormData, setIsYatraDateModalOpen, yatraDates, busRegistrations, toggleRegistrationStatus, deleteYatraDate, registrationYatraFilter, setRegistrationYatraFilter, exportRegistrationsToCSV, deleteRegistration,
  isYatraDateModalOpen, editingYatraDateId, yatraDateFormData, handleYatraFileChange, handleYatraDateSubmit,
  // Member props
  members, memberSearch, setMemberSearch, setIsMemberModalOpen, toggleMemberAccess, startEditMember, deleteMember,
  isMemberModalOpen, resetMemberForm, editingMemberId, memberFormData, setMemberFormData, handleSaveMember,
  // Jinalaya props
  jinalayas, jinalayaSearch, setJinalayaSearch, setIsJinalayaModalOpen, startEditJinalaya, deleteJinalaya,
  isJinalayaModalOpen, resetJinalayaForm, editingJinalayaId, jinalayaFormData, setJinalayaFormData, handleSaveJinalaya,
  // Report props
  allReports, reportUpashrayFilter, setReportUpashrayFilter, reportMemberFilter, setReportMemberFilter, reportDateFilter, setReportDateFilter, setSelectedReport, deleteReport,
  isReportModalOpen, 
  setIsReportModalOpen,
  selectedReport, 
  openReportAndPrint
}) => {
  useEffect(() => {
    if (activeTab === 'members' && !loadedData.members) loadMembers();
    if (activeTab === 'jinalayas' && !loadedData.jinalayas) loadJinalayas();
    if (activeTab === 'reports' && !loadedData.reports) loadReports();
    if (activeTab === 'bus-yatra' && !loadedData.busYatra) loadBusYatra();
  }, [activeTab, loadedData]);

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
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'upashrays' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Manage Upashrays
            </button>
            <button
              onClick={() => setActiveTab('jinalayas')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'jinalayas' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Manage Jinalayas
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'members' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Manage Members
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'reports' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Member Reports
            </button>
            <button
              onClick={() => setActiveTab('bus-yatra')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 whitespace-nowrap h-20 flex items-center ${activeTab === 'bus-yatra' ? 'border-[#c5a059] text-[#c5a059]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Bus Yatra
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 md:px-8 py-2 md:py-3 border-2 border-[#c5a059] text-[#c5a059] text-[10px] uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all font-bold shadow-lg shadow-[#c5a059]/10"
        >
          Logout
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl md:hidden animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4">
              <button
                onClick={() => { setActiveTab('upashrays'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === 'upashrays' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
              >
                Manage Upashrays
              </button>
              <button
                onClick={() => { setActiveTab('jinalayas'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === 'jinalayas' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
              >
                Manage Jinalayas
              </button>
              <button
                onClick={() => { setActiveTab('members'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === 'members' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
              >
                Manage Members
              </button>
              <button
                onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === 'reports' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
              >
                Member Reports
              </button>
              <button
                onClick={() => { setActiveTab('bus-yatra'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-4 mb-2 ${activeTab === 'bus-yatra' ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]' : 'border-transparent text-gray-500'}`}
              >
                Bus Yatra
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-grow overflow-y-auto overflow-x-hidden p-8 md:p-16 space-y-12">
        {activeTab === 'upashrays' && (
          <UpashraysTab 
            upashrays={upashrays}
            upashraySearch={upashraySearch}
            setUpashraySearch={setUpashraySearch}
            setIsModalOpen={setIsModalOpen}
            startEdit={startEdit}
            deleteUpashray={deleteUpashray}
          />
        )}
        {activeTab === 'bus-yatra' && (
          <BusYatraTab 
            yatraSearch={yatraSearch}
            setYatraSearch={setYatraSearch}
            setEditingYatraDateId={setEditingYatraDateId}
            setYatraDateFormData={setYatraDateFormData}
            setIsYatraDateModalOpen={setIsYatraDateModalOpen}
            yatraDates={yatraDates}
            busRegistrations={busRegistrations}
            toggleRegistrationStatus={toggleRegistrationStatus}
            deleteYatraDate={deleteYatraDate}
            registrationYatraFilter={registrationYatraFilter}
            setRegistrationYatraFilter={setRegistrationYatraFilter}
            exportRegistrationsToCSV={exportRegistrationsToCSV}
            deleteRegistration={deleteRegistration}
          />
        )}
        {activeTab === 'members' && (
          <MembersTab 
            members={members}
            memberSearch={memberSearch}
            setMemberSearch={setMemberSearch}
            setIsMemberModalOpen={setIsMemberModalOpen}
            toggleMemberAccess={toggleMemberAccess}
            startEditMember={startEditMember}
            deleteMember={deleteMember}
          />
        )}
        {activeTab === 'jinalayas' && (
          <JinalayasTab 
            jinalayas={jinalayas}
            jinalayaSearch={jinalayaSearch}
            setJinalayaSearch={setJinalayaSearch}
            setIsJinalayaModalOpen={setIsJinalayaModalOpen}
            startEditJinalaya={startEditJinalaya}
            deleteJinalaya={deleteJinalaya}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsTab 
            allReports={allReports}
            reportUpashrayFilter={reportUpashrayFilter}
            setReportUpashrayFilter={setReportUpashrayFilter}
            reportMemberFilter={reportMemberFilter}
            setReportMemberFilter={setReportMemberFilter}
            reportDateFilter={reportDateFilter}
            setReportDateFilter={setReportDateFilter}
            setSelectedReport={setSelectedReport}
            setIsReportModalOpen={setIsReportModalOpen}
            deleteReport={deleteReport}
            openReportAndPrint={openReportAndPrint}
          />
        )}
      </main>

      <UpashrayModal 
        isModalOpen={isModalOpen}
        resetForm={resetForm}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        handleSaveUpashray={handleSaveUpashray}
        handleMultipleFilesChange={handleMultipleFilesChange}
        removeMediaFile={removeMediaFile}
        deleteExistingMedia={deleteExistingMedia}
      />

      <MemberModal 
        isMemberModalOpen={isMemberModalOpen}
        resetMemberForm={resetMemberForm}
        editingMemberId={editingMemberId}
        memberFormData={memberFormData}
        setMemberFormData={setMemberFormData}
        handleSaveMember={handleSaveMember}
      />

      <JinalayaModal 
        isJinalayaModalOpen={isJinalayaModalOpen}
        resetJinalayaForm={resetJinalayaForm}
        editingJinalayaId={editingJinalayaId}
        jinalayaFormData={jinalayaFormData}
        setJinalayaFormData={setJinalayaFormData}
        handleSaveJinalaya={handleSaveJinalaya}
      />

      <YatraDateModal 
        isYatraDateModalOpen={isYatraDateModalOpen}
        setIsYatraDateModalOpen={setIsYatraDateModalOpen}
        editingYatraDateId={editingYatraDateId}
        yatraDateFormData={yatraDateFormData}
        setYatraDateFormData={setYatraDateFormData}
        handleYatraFileChange={handleYatraFileChange}
        handleYatraDateSubmit={handleYatraDateSubmit}
      />

      <ReportDetailModal 
        isReportModalOpen={isReportModalOpen}
        selectedReport={selectedReport}
        setIsReportModalOpen={setIsReportModalOpen}
      />
    </div>
  );
};

export default AdminPanel;
