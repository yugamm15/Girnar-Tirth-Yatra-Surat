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

/**
 * Parse a trip date from the stored yatra record.
 * Falls back to date_text if trip_date is not available yet.
 * @param {object} yatra - Yatra record
 * @returns {Date|null}
 */
export const parseYatraTripDate = (yatra) => {
  if (!yatra) return null;

  const rawValue = yatra.trip_date || yatra.date_raw || yatra.date_text || (typeof yatra.date === 'string' ? yatra.date : '');
  if (!rawValue) return null;

  const normalized = String(rawValue).replace(/(\d+)(st|nd|rd|th)/gi, '$1');
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Check whether a trip is in the future relative to today.
 * @param {object} yatra - Yatra record
 * @returns {boolean}
 */
export const isFutureYatraTrip = (yatra) => {
  const tripDate = parseYatraTripDate(yatra);
  if (!tripDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return tripDate.getTime() >= today.getTime();
};
