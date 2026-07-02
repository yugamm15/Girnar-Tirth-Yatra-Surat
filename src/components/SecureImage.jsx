import React, { useState } from 'react';

/**
 * SecureImage component that:
 * 1. Prevents right-click (context menu).
 * 2. Prevents image dragging.
 * 3. Shows a loading placeholder.
 * 4. Ensures original quality is maintained while being secure.
 */
const SecureImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  style = {},
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`secure-image-container relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Secure Overlay to block right-click and dragging */}
      <div 
        className="secure-image-overlay absolute inset-0 z-20 cursor-default" 
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      ></div>

      {/* Placeholder/Spinner while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse pointer-events-none z-10">
          <div className="w-8 h-8 border-2 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Fallback when image is missing or failing to load */}
      {hasError && (
        <div className="absolute inset-0 bg-[#fdfcf8] flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-12 h-12 rounded-full bg-[#c5a059]/15 text-[#8f6d2f] flex items-center justify-center mb-2 shadow-inner">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[11px] font-headline tracking-widest uppercase text-[#8f6d2f] font-bold">Photo Coming Soon</span>
        </div>
      )}
      
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`select-none pointer-events-none transition-opacity duration-700 ease-in-out ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            ...style,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            imageRendering: 'high-quality'
          }}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setHasError(true);
          }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
};

export default SecureImage;
