export const isBlobImageUrl = (value) => typeof value === 'string' && value.startsWith('blob:');

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