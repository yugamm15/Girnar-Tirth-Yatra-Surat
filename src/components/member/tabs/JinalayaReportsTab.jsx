import React, { useMemo, useState } from 'react';

const JinalayaReportsTab = ({ jinalayas, setCheckingJinalayaId }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jinalayas;
    return jinalayas.filter(j => (j.name || '').toLowerCase().includes(q) || (j.village || '').toLowerCase().includes(q));
  }, [jinalayas, query]);

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Jinalay or village..."
          className="w-full md:w-1/2 bg-gray-50 border border-gray-200 px-4 py-2 text-sm rounded-sm outline-none"
        />
        <button
          onClick={() => { /* noop: filtering is live */ }}
          className="px-4 py-2 bg-[#c5a059] text-white text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold w-32">Image</th>
              <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Jinalay Details</th>
              <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Latest Reports</th>
              <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((j) => (
              <tr key={j.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-6">
                  <div className="w-20 h-20 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={j.afterImg} alt={j.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-gray-900 text-sm font-bold tracking-wider mb-1 uppercase">{j.name}</div>
                  <div className="text-[9px] text-gray-600">{j.village}</div>
                </td>
                <td className="p-6">
                  {j.reports && j.reports.length > 0 ? (
                    <div className="text-[10px] border-l-2 border-[#c5a059] pl-2 py-0.5">
                      <span className="font-bold text-gray-700 block">{j.reports[0].title}</span>
                      <span className="text-gray-400">{j.reports[0].date}</span>
                    </div>
                  ) : (
                    <span className="text-gray-300 text-[10px] uppercase tracking-widest">No reports yet</span>
                  )}
                </td>
                <td className="p-6 text-right">
                  <button
                    onClick={() => setCheckingJinalayaId(j.id)}
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
    </div>
  );
};

export default JinalayaReportsTab;
