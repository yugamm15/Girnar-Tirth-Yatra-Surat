export const isBlobImageUrl = (value) => typeof value === 'string' && value.startsWith('blob:');

const DEFAULT_WEBP_QUALITY = 0.82;
const DEFAULT_MAX_DIMENSION = 1600;

const sanitizeFileName = (name = 'image') => String(name)
  .trim()
  .replace(/\.[^.]+$/, '')
  .replace(/[^a-z0-9-_]+/gi, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase() || 'image';

const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Unable to read the selected image file.'));
  };

  image.src = objectUrl;
});

export const convertImageFileToWebP = async (file, options = {}) => {
  if (!file) {
    throw new Error('Image file is required.');
  }

  const quality = options.quality ?? DEFAULT_WEBP_QUALITY;
  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const image = await loadImageFromFile(file);

  const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available in this browser.');
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to convert image to WebP.'));
        return;
      }

      resolve(blob);
    }, 'image/webp', quality);
  });
};

export const sanitizeImageFileName = sanitizeFileName;

export const getSafeImageUrl = (value, fallback = '') => {
  if (!value || isBlobImageUrl(value)) {
    return fallback;
  }

  return value;
};

export const getPersistableImageUrl = (value) => {
  if (!value || isBlobImageUrl(value)) {
    return null;
  }

  return value;
};