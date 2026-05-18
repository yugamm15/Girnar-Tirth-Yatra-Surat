/**
 * Format date to YYYY-MM-DD format
 * @param {Date|string} date - Date object or string
 * @returns {string} Formatted date string
 */
export const formatDateToISO = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale code (default: 'en-IN')
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date, locale = 'en-IN') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get date range (e.g., for filtering)
 * @param {number} days - Number of days back from today
 * @returns {string} ISO date string from X days ago
 */
export const getDateFromDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDateToISO(date);
};
