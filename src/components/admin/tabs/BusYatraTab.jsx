import React, { useState } from 'react';

const BusYatraTab = ({
  yatraSearch,
  setYatraSearch,
  setEditingYatraDateId,
  setYatraDateFormData,
  setIsYatraDateModalOpen,
  yatraDates,
  busRegistrations,
  toggleRegistrationStatus,
  deleteYatraDate,
  registrationYatraFilter,
  setRegistrationYatraFilter,
  exportRegistrationsToCSV,
  deleteRegistration,
  addOfflineRegistration
}) => {
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [remarksText, setRemarksText] = useState('');
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineFormData, setOfflineFormData] = useState({
    yatra_id: registrationYatraFilter === 'all' ? '' : registrationYatraFilter,
    first_name: '',
    last_name: '',
    phone: '',
    alt_phone: '',
    birthdate: '',
    gender: '',
    remarks: '',
  });

  const openOfflineModal = () => {
    setOfflineFormData({
      yatra_id: registrationYatraFilter === 'all' ? (yatraDates[0]?.id || '') : registrationYatraFilter,
      first_name: '',
      last_name: '',
      phone: '',
      alt_phone: '',
      birthdate: '',
      gender: '',
      remarks: '',
    });
    setOfflineModalOpen(true);
  };

  const submitOfflineRegistration = async (event) => {
    event.preventDefault();
    try {
      await addOfflineRegistration(offlineFormData);
      setOfflineModalOpen(false);
    } catch (error) {
      alert(error.message || 'Failed to add offline registration');
    }
  };

  const getSourceLabel = (registration) => (registration.registration_source === 'offline' ? 'Offline' : 'Online');

  return (
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
                setYatraDateFormData({
                  date_text: '',
                  description: '',
                  image: '',
                  registration_open: true,
                  price_per_person: 900,
                  max_capacity: '',
                });
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

        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-[#c5a059]">Yatra Dates</h3>
          <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
            <table className="w-full min-w-[950px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatra Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Image</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Description</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Booked</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Capacity</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Registration</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yatraDates.filter((date) => (date.date_text || '').toLowerCase().includes((yatraSearch || '').toLowerCase())).length > 0 ? (
                  yatraDates
                    .filter((date) => (date.date_text || '').toLowerCase().includes((yatraSearch || '').toLowerCase()))
                    .map((date) => {
                      const registrationCount = busRegistrations.filter((r) => String(r.yatra_id) === String(date.id)).length;
                      const maxCapacity = Number(date.max_capacity || 0);
                      const seatsLeft = maxCapacity > 0 ? Math.max(maxCapacity - registrationCount, 0) : null;
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
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px]">
                            <div className="mb-2 truncate">{date.description || '-'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-[#c5a059] text-[10px] font-bold rounded-full">{registrationCount} Registered</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {maxCapacity > 0 ? (
                              <span className={seatsLeft === 0 ? 'font-bold text-red-600' : 'font-semibold text-gray-700'}>
                                {registrationCount}/{maxCapacity}
                              </span>
                            ) : (
                              <span className="text-gray-400">Unlimited</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleRegistrationStatus(date.id, date.registration_open)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${date.registration_open ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${date.registration_open ? 'translate-x-6' : 'translate-x-1'}`} />
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
                                  registration_open: date.registration_open,
                                  price_per_person: date.price_per_person || 900,
                                  max_capacity: date.max_capacity || '',
                                });
                                setIsYatraDateModalOpen(true);
                              }}
                              className="p-2 text-gray-400 hover:text-[#c5a059] transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => deleteYatraDate(date.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
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
                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 italic">No yatra dates matching your search.</td>
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
                  {yatraDates.map((date) => (
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
              <button
                onClick={openOfflineModal}
                className="px-6 py-4 bg-[#c5a059] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg shadow-[#c5a059]/10 hover:bg-[#b08d4a] transition-all flex items-center justify-center gap-2 h-[52px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Offline Yatrik
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto">
        <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatra Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Yatrik Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Source</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Gender</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Remarks</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-gray-400 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {busRegistrations.filter((reg) => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter)).length > 0 ? (
                busRegistrations
                  .filter((reg) => registrationYatraFilter === 'all' || String(reg.yatra_id) === String(registrationYatraFilter))
                  .map((reg) => {
                    const yatraDate = yatraDates.find((d) => String(d.id) === String(reg.yatra_id))?.date_text || 'Unknown';
                    return (
                      <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold text-[#c5a059] uppercase tracking-wider">{yatraDate}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{reg.first_name} {reg.last_name}</div>
                          <div className="text-[10px] text-gray-400">DOB: {reg.birthdate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest">
                          <span className={`px-3 py-1 rounded-full ${getSourceLabel(reg) === 'Offline' ? 'bg-[#fcf3e3] text-[#b08d4a]' : 'bg-gray-100 text-gray-500'}`}>
                            {getSourceLabel(reg)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reg.gender}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 italic max-w-[200px]">
                          {reg.remarks ? (
                            <button onClick={() => { setRemarksModalOpen(true); setRemarksText(reg.remarks); }} className="text-left w-full text-sm text-gray-700 hover:underline">
                              {reg.remarks.length > 60 ? reg.remarks.slice(0, 60) + '…' : reg.remarks}
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => deleteRegistration(reg.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
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
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic uppercase tracking-widest text-[10px]">No registrations found for this date.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {offlineModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setOfflineModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-sm overflow-auto max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Add Offline Yatrik</h3>
              <button onClick={() => setOfflineModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submitOfflineRegistration} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Yatra Date</label>
                <select
                  required
                  value={offlineFormData.yatra_id}
                  onChange={(e) => setOfflineFormData({ ...offlineFormData, yatra_id: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                >
                  <option value="">Select Yatra Date</option>
                  {yatraDates.map((date) => (
                    <option key={date.id} value={date.id}>{date.date_text}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={offlineFormData.first_name}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, first_name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={offlineFormData.last_name}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, last_name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={offlineFormData.phone}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Alternative Phone</label>
                  <input
                    type="tel"
                    value={offlineFormData.alt_phone}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, alt_phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Birthdate</label>
                  <input
                    type="date"
                    required
                    value={offlineFormData.birthdate}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, birthdate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Gender</label>
                  <select
                    required
                    value={offlineFormData.gender}
                    onChange={(e) => setOfflineFormData({ ...offlineFormData, gender: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Remarks</label>
                <textarea
                  value={offlineFormData.remarks}
                  onChange={(e) => setOfflineFormData({ ...offlineFormData, remarks: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors h-24 resize-none"
                  placeholder="Optional notes for the offline payment"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
                >
                  Save Offline Yatrik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {remarksModalOpen && (
        <div className="fixed inset-0 z-[500] overflow-y-auto p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60" onClick={() => setRemarksModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-auto max-h-[80vh] p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Remarks</h3>
              <button onClick={() => setRemarksModalOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line">{remarksText}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusYatraTab;