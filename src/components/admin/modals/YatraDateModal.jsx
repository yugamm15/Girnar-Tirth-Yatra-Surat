import React from 'react';

const YatraDateModal = ({ 
  isYatraDateModalOpen, 
  setIsYatraDateModalOpen, 
  editingYatraDateId, 
  yatraDateFormData, 
  setYatraDateFormData, 
  handleYatraFileChange, 
  handleYatraDateSubmit 
}) => {
  if (!isYatraDateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={() => setIsYatraDateModalOpen(false)}></div>
      <div className="relative bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-auto max-h-[90vh] animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
            {editingYatraDateId ? 'Edit Yatra Date' : 'Add New Yatra Date'}
          </h3>
          <button onClick={() => setIsYatraDateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleYatraDateSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Date Text (e.g. 15th May 2024)</label>
            <input
              type="text"
              required
              value={yatraDateFormData.date_text}
              onChange={(e) => setYatraDateFormData({ ...yatraDateFormData, date_text: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
              placeholder="Enter yatra date description"
            />
          </div>
          <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Yatra Image</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 border border-dashed border-gray-300 rounded-sm overflow-hidden flex items-center justify-center relative">
                  {yatraDateFormData.image ? (
                    <img src={yatraDateFormData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleYatraFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold">Click to upload photo</p>
                  {yatraDateFormData.image && (
                    <button 
                      type="button"
                      onClick={() => setYatraDateFormData({ ...yatraDateFormData, image: '' })}
                      className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Short Description</label>
            <textarea
              value={yatraDateFormData.description}
              onChange={(e) => setYatraDateFormData({ ...yatraDateFormData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors h-24 resize-none"
              placeholder="Optional details about this yatra"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700">Open for Registration</h4>
              <p className="text-[10px] text-gray-400">Toggle whether users can sign up for this date.</p>
            </div>
            <button
              type="button"
              onClick={() => setYatraDateFormData({ ...yatraDateFormData, registration_open: !yatraDateFormData.registration_open })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${yatraDateFormData.registration_open ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${yatraDateFormData.registration_open ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Price Per Person (₹)</label>
              <input
                type="number"
                min="0"
                value={yatraDateFormData.price_per_person || 0}
                onChange={(e) => setYatraDateFormData({ ...yatraDateFormData, price_per_person: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-sm py-3 px-4 outline-none focus:border-[#c5a059] transition-colors"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
            >
              {editingYatraDateId ? 'Update Yatra Date' : 'Save Yatra Date'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YatraDateModal;
