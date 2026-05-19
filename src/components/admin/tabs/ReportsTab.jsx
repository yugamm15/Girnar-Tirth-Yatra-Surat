import React from 'react';

const ReportsTab = ({ 
  allReports, 
  reportUpashrayFilter, 
  setReportUpashrayFilter, 
  reportMemberFilter, 
  setReportMemberFilter, 
  reportDateFilter, 
  setReportDateFilter, 
  setSelectedReport, 
  setIsReportModalOpen, 
  deleteReport,
  openReportAndPrint 
}) => {
  const filteredReports = allReports.filter(report => {
    const matchesUpashray = reportUpashrayFilter === 'all' || report.upashrayName === reportUpashrayFilter;
    const matchesMember = reportMemberFilter === 'all' || report.memberName === reportMemberFilter;
    const matchesDate = !reportDateFilter || report.report_date === reportDateFilter;
    return matchesUpashray && matchesMember && matchesDate;
  });

  return (
    <>
      <div className="max-w-5xl mx-auto mb-12">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-4xl font-headline text-gray-900 mb-2">Member Submissions</h2>
          <p className="text-gray-500 text-sm font-light">Filter and view checking reports by category, member, or date.</p>
        </div>
        
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{report.memberName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.upashrayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setIsReportModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-[#c5a059] transition-colors"
                          title="View Report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openReportAndPrint(report)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Print Report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete Report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic uppercase tracking-widest text-[10px]">No reports found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ReportsTab;
