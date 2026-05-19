import React from 'react';

const ReportDetailModal = ({ 
  isReportModalOpen, 
  selectedReport, 
  setIsReportModalOpen
}) => {
  if (!isReportModalOpen || !selectedReport) return null;

  return (
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
  );
};

export default ReportDetailModal;
