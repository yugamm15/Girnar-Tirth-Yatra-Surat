import React from 'react';

const JinalayasTab = ({ 
  jinalayas, 
  jinalayaSearch, 
  setJinalayaSearch, 
  setIsJinalayaModalOpen, 
  startEditJinalaya, 
  deleteJinalaya 
}) => {
  return (
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
  );
};

export default JinalayasTab;
