import React, { useMemo, useState } from 'react';

const MyReportsTab = ({ allReports, currentMemberId, setSelectedReport, setIsReportModalOpen }) => {
  const [filter, setFilter] = useState('all'); // all | upashray | jinalaya

  const myReports = useMemo(() => (
    allReports
      .filter(r => String(r.member_id) === String(currentMemberId))
      .filter(r => filter === 'all' ? true : (filter === 'upashray' ? r.entityType === 'upashray' : r.entityType === 'jinalaya'))
      .sort((a, b) => new Date(b.report_date || 0) - new Date(a.report_date || 0))
  ), [allReports, currentMemberId, filter]);

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-sm border border-gray-100">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#c5a059]">My Submitted Reports</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-sm ${filter==='all'?'bg-[#c5a059] text-white':'bg-white text-gray-600 border border-gray-200'}`}>All</button>
          <button onClick={() => setFilter('upashray')} className={`px-3 py-1 text-xs rounded-sm ${filter==='upashray'?'bg-[#c5a059] text-white':'bg-white text-gray-600 border border-gray-200'}`}>Upashray</button>
          <button onClick={() => setFilter('jinalaya')} className={`px-3 py-1 text-xs rounded-sm ${filter==='jinalaya'?'bg-[#c5a059] text-white':'bg-white text-gray-600 border border-gray-200'}`}>Jinalaya</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Date</th>
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Entity</th>
              <th className="px-6 py-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Location</th>
              <th className="px-6 py-4 text-right text-gray-400 text-[10px] uppercase tracking-widest font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {myReports.length > 0 ? (
              myReports.map((report, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-bold">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 uppercase">{report.entityName}</td>
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
  );
};

export default MyReportsTab;
