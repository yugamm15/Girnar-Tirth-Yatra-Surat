import React from 'react';

const CheckingReportModal = ({ 
  checkingUpashrayId, 
  setCheckingUpashrayId, 
  upashrays, 
  handleSaveCheckingReport, 
  checkingReport, 
  setCheckingReport, 
  removePointImage, 
  handlePointImageUpload, 
  generalNotes, 
  setGeneralNotes 
}) => {
  if (!checkingUpashrayId) return null;

  const currentUpashray = upashrays.find(u => u.id === checkingUpashrayId);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={() => setCheckingUpashrayId(null)}></div>
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-3xl font-headline text-gray-900 mb-2">Upashray Yearly Checking Report</h3>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-sm border border-gray-100">
              <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Upashray</strong> {currentUpashray?.name}</span>
              <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Village</strong> {currentUpashray?.village}</span>
              <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Route</strong> {currentUpashray?.route}</span>
              <span><strong className="uppercase text-[10px] tracking-widest text-gray-400 block mb-1">Trusty</strong> {currentUpashray?.trusty || '-'}</span>
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
  );
};

export default CheckingReportModal;
