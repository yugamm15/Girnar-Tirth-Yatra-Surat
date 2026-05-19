
import React from 'react';

const TopLineLoader = ({ active = false, label = '' }) => {
  if (!active) return null;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[1200] h-1 overflow-hidden bg-[#c5a059]/20" role="status" aria-live="polite">
        <div className="line-loader-indeterminate h-full" />
      </div>
      {label ? (
        <div className="fixed right-3 top-3 z-[1201] rounded-sm border border-[#c5a059]/25 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f6d2f] shadow-sm">
          {label}
        </div>
      ) : null}
    </>
  );
};

export default TopLineLoader;
