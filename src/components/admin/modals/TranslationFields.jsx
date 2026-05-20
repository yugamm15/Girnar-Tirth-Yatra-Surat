import React from 'react';

export const TranslationFields = ({ 
  label, 
  enValue, 
  guValue, 
  hiValue, 
  onEnChange, 
  onGuChange, 
  onHiChange,
  isTextArea = false 
}) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="space-y-4 p-4 bg-gray-50/50 border border-gray-100 rounded-sm">
      <div className="flex justify-between items-center">
        <label className="text-[10px] uppercase tracking-widest font-bold text-[#c5a059]">{label}</label>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <span className="text-[9px] text-gray-400 font-bold uppercase mb-1 block">English</span>
          <InputComponent
            type="text"
            value={enValue || ''}
            onChange={(e) => onEnChange(e.target.value)}
            className="w-full bg-white border border-gray-200 p-3 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
            required
            rows={isTextArea ? 3 : undefined}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-1 block">Gujarati</span>
            <InputComponent
              type="text"
              value={guValue || ''}
              onChange={(e) => onGuChange(e.target.value)}
              className="w-full bg-white border border-gray-200 p-3 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
              rows={isTextArea ? 3 : undefined}
            />
          </div>
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase mb-1 block">Hindi</span>
            <InputComponent
              type="text"
              value={hiValue || ''}
              onChange={(e) => onHiChange(e.target.value)}
              className="w-full bg-white border border-gray-200 p-3 text-gray-900 text-sm focus:border-[#c5a059] outline-none transition-colors"
              rows={isTextArea ? 3 : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
