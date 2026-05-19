import React, { useState } from 'react';
import SecureImage from './SecureImage.jsx';

const GalleryModal = ({ isOpen, onClose, images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images?.[currentIndex];

  const handleNext = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') onClose();
  };

  // Always call hooks in the same order — attach keydown listener via useEffect
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images]);

  // Reset index when opening a new gallery or when image list changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [isOpen, images]);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close gallery"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Image */}

        {/* Main Image */}
        <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
          <SecureImage
            src={currentImage.file_url || currentImage}
            alt={`${title} - Image ${currentIndex + 1}`}
            containerClassName="w-full h-full"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-3 text-white hover:bg-white/10 rounded-full transition-colors z-20"
            aria-label="Previous image"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-3 text-white hover:bg-white/10 rounded-full transition-colors z-20"
            aria-label="Next image"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom area: title, thumbnails and counter */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 px-4">
          <div className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded">
            {title}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded border-2 transition-all ${
                    index === currentIndex ? 'border-[#c5a059]' : 'border-white/30 hover:border-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <SecureImage
                    src={img.file_url || img}
                    alt={`Thumbnail ${index + 1}`}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
