import React from 'react';

const JinalayaModal = ({ 
  isJinalayaModalOpen, 
  resetJinalayaForm, 
  editingJinalayaId, 
  jinalayaFormData, 
  setJinalayaFormData, 
  handleSaveJinalaya 
}) => {
  if (!isJinalayaModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto p-4">
      <div className="fixed inset-0 bg-black/80" onClick={resetJinalayaForm}></div>
      <div className="relative bg-white w-full max-w-4xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-headline text-gray-900">{editingJinalayaId ? 'Edit Jinalaya' : 'Add New Jinalaya'}</h3>
          <button onClick={resetJinalayaForm} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSaveJinalaya} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Jinalaya Name</label>
              <input
                type="text"
                value={jinalayaFormData.name}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Village Name</label>
              <input
                type="text"
                value={jinalayaFormData.village}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, village: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Route</label>
              <input
                type="text"
                value={jinalayaFormData.route}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, route: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Google Map Link or Coordinates</label>
              <input
                type="text"
                value={jinalayaFormData.location}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, location: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder="Paste link or Lat, Long"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Mulnayak</label>
              <input
                type="text"
                value={jinalayaFormData.mulnayak}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, mulnayak: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Status</label>
              <select
                value={jinalayaFormData.status}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, status: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors appearance-none"
              >
                <option value="plan">Plan</option>
                <option value="process">Process</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Description</label>
              <textarea
                value={jinalayaFormData.description}
                onChange={(e) => setJinalayaFormData({ ...jinalayaFormData, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm h-[135px] focus:border-[#c5a059] outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-2 border-t border-gray-100 pt-8">
            <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Update Pictures (Before / In-Process / After)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Before</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setJinalayaFormData({ ...jinalayaFormData, beforeFile: file });
                    }
                  }}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">In-Process</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setJinalayaFormData({ ...jinalayaFormData, processFile: file });
                    }
                  }}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">After</span>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setJinalayaFormData({ ...jinalayaFormData, afterFile: file });
                    }
                  }}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
            >
              {editingJinalayaId ? 'Save Changes' : 'Confirm & Save Jinalaya'}
            </button>
            <button
              type="button"
              onClick={resetJinalayaForm}
              className="px-10 py-5 border border-gray-300 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JinalayaModal;
