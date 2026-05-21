import React from 'react';

const UpashrayModal = ({ 
  isModalOpen, 
  resetForm, 
  editingId, 
  formData, 
  setFormData, 
  handleSaveUpashray, 
  handleMultipleFilesChange, 
  removeMediaFile, 
  deleteExistingMedia 
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto p-4">
      <div className="fixed inset-0 bg-black/80" onClick={resetForm}></div>
      <div className="relative bg-white w-full max-w-5xl shadow-2xl rounded-sm p-8 md:p-12 animate-fade-in border-t-4 border-[#c5a059] mx-auto my-12">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-headline text-gray-900">{editingId ? 'Edit Upashray' : 'Add New Upashray'}</h3>
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSaveUpashray} className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Upashray Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">URL Slug (auto-generated from name)</label>
              <input
                type="text"
                value={formData.slug || (formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : '')}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder="e.g., vagad, ranpur"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Village Name</label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Route</label>
              <input
                type="text"
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Trusty Name (Optional)</label>
                <input
                  type="text"
                  value={formData.trusty}
                  onChange={(e) => setFormData({ ...formData, trusty: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Google Map Link or Coordinates</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
                placeholder="Paste link or Lat, Long"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 text-sm h-[135px] focus:border-[#c5a059] outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-2 border-t border-gray-100 pt-8">
            <label className="block text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Upload Pictures (Before / In-Process / After) - Multiple Files Supported</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before Images */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Before</span>
                
                {/* Existing Media */}
                {formData.existingBeforeMedia && formData.existingBeforeMedia.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded space-y-2">
                    <p className="text-[9px] font-bold text-blue-700">Existing Images:</p>
                    {formData.existingBeforeMedia.map((media) => (
                      <div key={media.id} className="flex justify-between items-center bg-white p-2 rounded text-[9px]">
                        <a href={media.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                          View Image
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteExistingMedia(media.id, 'Before')}
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFilesChange(e, 'beforeFiles')}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
                {formData.beforeFiles && formData.beforeFiles.length > 0 && (
                  <div className="text-[9px] text-gray-600 space-y-1">
                    {formData.beforeFiles.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="truncate">{f.name || 'Image'}</span>
                        <button
                          type="button"
                          onClick={() => removeMediaFile('beforeFiles', idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Process Images */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">In-Process</span>
                
                {/* Existing Media */}
                {formData.existingProcessMedia && formData.existingProcessMedia.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded space-y-2">
                    <p className="text-[9px] font-bold text-blue-700">Existing Images:</p>
                    {formData.existingProcessMedia.map((media) => (
                      <div key={media.id} className="flex justify-between items-center bg-white p-2 rounded text-[9px]">
                        <a href={media.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                          View Image
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteExistingMedia(media.id, 'Process')}
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFilesChange(e, 'processFiles')}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
                {formData.processFiles && formData.processFiles.length > 0 && (
                  <div className="text-[9px] text-gray-600 space-y-1">
                    {formData.processFiles.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="truncate">{f.name || 'Image'}</span>
                        <button
                          type="button"
                          onClick={() => removeMediaFile('processFiles', idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* After Images */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">After</span>
                
                {/* Existing Media */}
                {formData.existingAfterMedia && formData.existingAfterMedia.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded space-y-2">
                    <p className="text-[9px] font-bold text-blue-700">Existing Images:</p>
                    {formData.existingAfterMedia.map((media) => (
                      <div key={media.id} className="flex justify-between items-center bg-white p-2 rounded text-[9px]">
                        <a href={media.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                          View Image
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteExistingMedia(media.id, 'After')}
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFilesChange(e, 'afterFiles')}
                  className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#c5a059]/10 file:text-[#c5a059] hover:file:bg-[#c5a059]/20"
                />
                {formData.afterFiles && formData.afterFiles.length > 0 && (
                  <div className="text-[9px] text-gray-600 space-y-1">
                    {formData.afterFiles.map((f, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="truncate">{f.name || 'Image'}</span>
                        <button
                          type="button"
                          onClick={() => removeMediaFile('afterFiles', idx)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-grow py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/20 hover:bg-[#b08d4a] transition-all"
            >
              {editingId ? 'Save Changes' : 'Confirm & Save Upashray'}
            </button>
            <button
              type="button"
              onClick={resetForm}
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

export default UpashrayModal;
