import React from 'react';

const UpashrayReportsTab = ({ upashrays, setCheckingUpashrayId }) => {
  return (
    <div className="bg-white overflow-x-auto shadow-md rounded-sm border border-gray-100">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold w-32">Image</th>
            <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Upashray Details</th>
            <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold">Latest Reports</th>
            <th className="p-6 text-gray-400 text-[10px] uppercase tracking-widest font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {upashrays.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
              <td className="p-6">
                <div className="w-20 h-20 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={u.afterImg} alt={u.name} className="w-full h-full object-cover" />
                </div>
              </td>
              <td className="p-6">
                <div className="text-gray-900 text-sm font-bold tracking-wider mb-1 uppercase">{u.name}</div>
                <div className={`text-[9px] inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${u.status === 'Done' ? 'bg-green-100 text-green-600' :
                  u.status === 'Process' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                  {u.status || 'Plan'}
                </div>
              </td>
              <td className="p-6">
                {u.reports && u.reports.length > 0 ? (
                  <div className="text-[10px] border-l-2 border-[#c5a059] pl-2 py-0.5">
                    <span className="font-bold text-gray-700 block">{u.reports[0].title}</span>
                    <span className="text-gray-400">{u.reports[0].date}</span>
                  </div>
                ) : (
                  <span className="text-gray-300 text-[10px] uppercase tracking-widest">No reports yet</span>
                )}
              </td>
              <td className="p-6 text-right">
                <button
                  onClick={() => setCheckingUpashrayId(u.id)}
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
  );
};

export default UpashrayReportsTab;
