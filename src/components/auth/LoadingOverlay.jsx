import React from 'react';

const LoadingOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300">
      <div className="bg-white p-8 rounded-sm shadow-2xl flex flex-col items-center max-w-xs w-full mx-4 animate-in fade-in zoom-in duration-200">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#c5a059] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/images/logo2.png" alt="Loading" className="w-8 h-8 object-contain opacity-50 animate-pulse" />
          </div>
        </div>
        <h3 className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] mb-2 text-center">{message}</h3>
        <p className="text-gray-400 text-[9px] uppercase tracking-widest text-center italic">Please wait while we sync with the server...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
