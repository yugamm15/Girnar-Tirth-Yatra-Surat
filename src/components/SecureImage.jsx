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

  return (
    <div className={`secure-image-container relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Secure Overlay to block right-click and dragging */}
      <div 
        className="secure-image-overlay absolute inset-0 z-20 cursor-default" 
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      ></div>

      {/* Placeholder/Spinner while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse pointer-events-none z-10">
          <div className="w-8 h-8 border-2 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`select-none pointer-events-none transition-opacity duration-700 ease-in-out ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          ...style 
        }}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default SecureImage;
