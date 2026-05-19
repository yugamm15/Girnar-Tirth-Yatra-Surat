import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { checkingReportsDB, upashraysDB, membersDB } from '../lib/database';

const PrintReportView = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const reportData = await checkingReportsDB.getById(id);
        if (!reportData) throw new Error('Report not found');

        const [upashray, member] = await Promise.all([
          reportData.upashray_id ? upashraysDB.getById(reportData.upashray_id).catch(() => null) : Promise.resolve(null),
          reportData.member_id ? membersDB.getById(reportData.member_id).catch(() => null) : Promise.resolve(null)
        ]);

        setReport({
          ...reportData,
          upashrayName: upashray ? upashray.name : 'Unknown Upashray',
          village: upashray ? upashray.village : 'Unknown Location',
          route: upashray ? upashray.route : '',
          memberName: member ? member.name : 'Unknown Member',
          date: reportData.report_date ? new Date(reportData.report_date).toLocaleDateString() : 'N/A'
        });
        
        if (upashray) {
          window.document.title = `Report - ${upashray.name} - ${new Date(reportData.report_date).toLocaleDateString()}`;
        }
      } catch (err) {
        console.error('Error fetching report for printing:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportData();
    }
  }, [id]);

  useEffect(() => {
    if (!loading && report && !error) {
      // Small delay to ensure images and styles are loaded
      const timer = setTimeout(() => {
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, report, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparing Report for Print...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-headline text-red-500 mb-4">Error Loading Report</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested report could not be found.'}</p>
          <button 
            onClick={() => window.close()}
            className="px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body p-8 md:p-16 print:p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-none md:shadow-xl md:border md:border-gray-100 print:shadow-none print:border-none print:max-w-none">
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
                <span className="text-xl font-bold text-gray-900">{report.upashrayName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Location</span>
                <span className="text-sm text-gray-600">
                  {report.village || 'N/A'}
                  {report.route && <span className="block text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{report.route}</span>}
                </span>
              </div>
            </div>
            <div className="space-y-4 text-right">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Submitted By</span>
                <span className="text-xl font-bold text-gray-900">{report.memberName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Submission Date</span>
                <span className="text-sm text-gray-600">{report.date}</span>
              </div>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="mb-12">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 text-[#c5a059]">Checklist Details</h3>
            <div className="space-y-0 border border-gray-200 rounded-sm">
              {Array.isArray(report.points) ? report.points.map((item, index) => (
                <div key={index} className={`flex items-start p-6 ${index !== report.points.length - 1 ? 'border-b border-gray-100' : ''} ${item.isChecked ? 'bg-gray-50/50' : ''}`}>
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

          {report.general_notes && (
            <div className="mb-12">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b border-gray-100 text-[#c5a059]">General Remarks</h3>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm text-gray-700 italic leading-relaxed text-sm">
                "{report.general_notes}"
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

      {/* Floating Action Button (Hidden in Print) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-[#c5a059] text-white p-4 rounded-full shadow-2xl hover:bg-[#b08d4a] transition-all"
          title="Print Again"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PrintReportView;
