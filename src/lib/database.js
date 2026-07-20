// ============================================================
// database.js — Frontend API client for MySQL backend
// All data operations use fetch() to Node.js backend (localhost:3001)
// ============================================================


import { formatDateToISO } from '../utils/dateUtils.js';
import { convertImageFileToWebP, sanitizeImageFileName } from '../utils/imageUtils.js';

export let API_BASE = 'https://girnar-tirth-yatra-surat.onrender.com/api';


// If running locally, connect to the local development server instead
if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  API_BASE = 'http://localhost:3001/api';
}

// Fallback to environment variable if explicitly defined
if (import.meta.env.VITE_API_BASE) {
  API_BASE = import.meta.env.VITE_API_BASE;
}

if (API_BASE && !API_BASE.endsWith('/api') && !API_BASE.endsWith('/api/')) {
  API_BASE = API_BASE.replace(/\/$/, '') + '/api';
}
const DATABASE_CACHE_PREFIX = 'girnar_db_cache_v1';
// ─── In-memory token cache (primary) + localStorage (persistence) ───
// Using a module-level variable ensures the token is ALWAYS available
// in the same session, even if localStorage has timing issues.
let _tokenCache = null;
// Initialize from localStorage on module load
try {
  _tokenCache = localStorage.getItem('girnar_admin_token') || null;
} catch (_) {}

const getToken = () => {
  // Always prefer in-memory cache; fall back to localStorage
  if (_tokenCache) return _tokenCache;
  try {
    _tokenCache = localStorage.getItem('girnar_admin_token') || null;
    return _tokenCache;
  } catch (_) {
    return null;
  }
};

// ─── Helper: Build headers (with optional auth) ───
const buildHeaders = (auth = false, json = true) => {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[database.js] buildHeaders: auth=true but NO token available!');
    }
  }
  return headers;
};

// ─── Helper: Perform fetch and throw on HTTP errors ───
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      errMsg = body.error || errMsg;
    } catch (_) { /* ignore parse errors */ }
    throw new Error(errMsg);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
};

// ─── Cache helpers ───
const readCache = (key) => {
  try {
    const raw = localStorage.getItem(`${DATABASE_CACHE_PREFIX}:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(`${DATABASE_CACHE_PREFIX}:${key}`, JSON.stringify({
      savedAt: Date.now(),
      data
    }));
  } catch {
    // Ignore cache failures in private mode or on quota limits.
  }
};

const normalizeTripDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return formatDateToISO(value);
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw.replace(/(\d+)(st|nd|rd|th)/gi, '$1'));
  return Number.isNaN(parsed.getTime()) ? null : formatDateToISO(parsed);
};

export const dbCache = {
  read: readCache,
  write: writeCache,
  remove(key) {
    try {
      localStorage.removeItem(`${DATABASE_CACHE_PREFIX}:${key}`);
    } catch {
      // Ignore cache removal failures in non-browser or restricted contexts.
    }
  },
};

// ─── Auth helpers (stored in both memory and localStorage) ───
export const authDB = {
  saveSession({ token, user }) {
    // Save to in-memory cache first (immediate, synchronous)
    _tokenCache = token;
    // Also persist to localStorage for page-reload survival
    try {
      localStorage.setItem('girnar_admin_token', token);
      localStorage.setItem('girnar_admin_user', JSON.stringify(user));
    } catch (_) {}
  },
  clearSession() {
    _tokenCache = null;
    try {
      localStorage.removeItem('girnar_admin_token');
      localStorage.removeItem('girnar_admin_user');
    } catch (_) {}
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('girnar_admin_user') || 'null');
    } catch { return null; }
  },
  isLoggedIn() {
    return !!getToken();
  },
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify({ email, password }),
    });
    // Save session immediately so all subsequent calls have the token
    this.saveSession(data);
    console.log('[authDB] Login successful, token cached in memory + localStorage');
    return data;
  },
  async logout() {
    await apiFetch('/auth/logout', {
      method: 'POST',
      headers: buildHeaders(true, true),
    }).catch(() => {});
    this.clearSession();
  },
  async verify() {
    return apiFetch('/auth/verify', {
      headers: buildHeaders(true, false),
    });
  },
};

// ─── Image upload via backend ───
export const uploadWebPImage = async ({ bucketName, folderName, recordId, file, mediaType, quality = 0.82 }) => {
  if (!file) throw new Error('Image file is required.');

  console.log('[uploadWebPImage] start', { bucketName, folderName, recordId, mediaType, fileName: file.name });
  const webpBlob = await convertImageFileToWebP(file, { quality });
  console.log('[uploadWebPImage] converted to webp', { size: webpBlob.size, type: webpBlob.type });

  const safeFileName = sanitizeImageFileName(file.name || 'image');
  const formData = new FormData();
  formData.append('file', webpBlob, `${mediaType}-${Date.now()}-${safeFileName}.webp`);
  formData.append('upashray_id', recordId);
  formData.append('media_type', mediaType);
  formData.append('alt_text', `${mediaType} image`);
  formData.append('sort_order', '0');

  const token = getToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}/upashray-media`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Upload failed: HTTP ${res.status}`);
  }

  const record = await res.json();
  // Return the full URL so existing code that uses the publicUrl string still works
  const fileUrl = record.file_url.startsWith('http')
    ? record.file_url
    : `http://localhost:3001${record.file_url}`;
  console.log('[uploadWebPImage] publicUrl', fileUrl);
  return fileUrl;
};

// ============== UPASHRAYS ==============

export const upashraysDB = {
  async getAll(columns = '*') {
    return apiFetch('/upashrays', { headers: buildHeaders(false, false) });
  },

  async getById(id, columns = '*') {
    return apiFetch(`/upashrays/${id}`, { headers: buildHeaders(false, false) });
  },

  async getBySlug(slug, columns = '*') {
    try {
      return await apiFetch(`/upashrays/slug/${slug}`, { headers: buildHeaders(false, false) });
    } catch (err) {
      if (err.message.includes('404')) return null;
      throw err;
    }
  },

  async create(upashray) {
    return apiFetch('/upashrays', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(upashray),
    });
  },

  async update(id, upashray) {
    return apiFetch(`/upashrays/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(upashray),
    });
  },

  async delete(id) {
    await apiFetch(`/upashrays/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  },

  async search(query) {
    return apiFetch(`/upashrays?search=${encodeURIComponent(query)}`, {
      headers: buildHeaders(false, false),
    });
  }
};

// ============== MEMBERS ==============

export const membersDB = {
  async getAll() {
    return apiFetch('/members', { headers: buildHeaders(true, false) });
  },

  async getById(id) {
    return apiFetch(`/members/${id}`, { headers: buildHeaders(true, false) });
  },

  async getByEmail(email) {
    const all = await this.getAll();
    return (all || []).find(m => m.email?.toLowerCase() === email?.toLowerCase()) || null;
  },

  async create(member) {
    return apiFetch('/members', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(member),
    });
  },

  async update(id, member) {
    return apiFetch(`/members/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(member),
    });
  },

  async delete(id) {
    await apiFetch(`/members/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  },

  async search(query) {
    return apiFetch(`/members?search=${encodeURIComponent(query)}`, {
      headers: buildHeaders(true, false),
    });
  }
};

// ============== JINALAYAS ==============

export const jinalayasDB = {
  async getAll() {
    return apiFetch('/jinalayas', { headers: buildHeaders(false, false) });
  },

  async getById(id) {
    return apiFetch(`/jinalayas/${id}`, { headers: buildHeaders(false, false) });
  },

  async create(jinalaya) {
    return apiFetch('/jinalayas', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(jinalaya),
    });
  },

  async update(id, jinalaya) {
    return apiFetch(`/jinalayas/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(jinalaya),
    });
  },

  async delete(id) {
    await apiFetch(`/jinalayas/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  },

  async search(query) {
    return apiFetch(`/jinalayas?search=${encodeURIComponent(query)}`, {
      headers: buildHeaders(false, false),
    });
  }
};

// ============== YATRA DATES ==============

export const yatraDatesDB = {
  async getAll(columns = '*') {
    return apiFetch('/yatra-dates', { headers: buildHeaders(false, false) });
  },

  async getById(id, columns = '*') {
    return apiFetch(`/yatra-dates/${id}`, { headers: buildHeaders(false, false) });
  },

  async create(yatraDate) {
    const payload = {
      trip_date: normalizeTripDate(yatraDate.trip_date || yatraDate.date_text),
      description: yatraDate.description,
      image: yatraDate.image,
      registration_open: yatraDate.registration_open,
      price_per_person: yatraDate.price_per_person || 900,
      max_capacity: yatraDate.max_capacity === '' || yatraDate.max_capacity === undefined
        ? null
        : Number(yatraDate.max_capacity),
    };
    return apiFetch('/yatra-dates', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(payload),
    });
  },

  async update(id, updates) {
    const normalizedUpdates = { ...updates };
    if (normalizedUpdates.date_text && !normalizedUpdates.trip_date) {
      normalizedUpdates.trip_date = normalizeTripDate(normalizedUpdates.date_text);
    }
    delete normalizedUpdates.date_text;
    if (normalizedUpdates.max_capacity !== undefined) {
      normalizedUpdates.max_capacity =
        normalizedUpdates.max_capacity === '' || normalizedUpdates.max_capacity === null
          ? null
          : Number(normalizedUpdates.max_capacity);
    }
    return apiFetch(`/yatra-dates/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(normalizedUpdates),
    });
  },

  async delete(id) {
    await apiFetch(`/yatra-dates/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== SPONSORSHIP SCHEMES ==============

export const sponsorshipSchemesDB = {
  async getAll() {
    return apiFetch('/sponsorship-schemes', { headers: buildHeaders(false, false) });
  },

  async getById(id) {
    return apiFetch(`/sponsorship-schemes/${id}`, { headers: buildHeaders(false, false) });
  },

  async create(scheme) {
    const payload = {
      title: scheme.title,
      description: scheme.description || '',
      amount: Number(scheme.amount || 0),
      sort_order: Number(scheme.sort_order || 0),
      is_active: scheme.is_active === undefined ? true : Boolean(scheme.is_active),
    };
    return apiFetch('/sponsorship-schemes', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(payload),
    });
  },

  async update(id, scheme) {
    const payload = {
      title: scheme.title,
      description: scheme.description || '',
      amount: Number(scheme.amount || 0),
      sort_order: Number(scheme.sort_order || 0),
      is_active: scheme.is_active === undefined ? true : Boolean(scheme.is_active),
    };
    return apiFetch(`/sponsorship-schemes/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(payload),
    });
  },

  async delete(id) {
    await apiFetch(`/sponsorship-schemes/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== PAYMENT INTENTS ==============

export const paymentIntentsDB = {
  async getAll() {
    return apiFetch('/payment-intents', { headers: buildHeaders(true, false) });
  },

  async create(intent) {
    const payload = {
      module_key: intent.module_key,
      reference_type: intent.reference_type || null,
      reference_id: intent.reference_id === undefined || intent.reference_id === null
        ? null
        : String(intent.reference_id),
      payer_name: intent.payer_name || '',
      phone: intent.phone || '',
      email: intent.email || '',
      city: intent.city || '',
      amount: Number(intent.amount || 0),
      currency: intent.currency || 'INR',
      status: intent.status || 'pending',
      gateway_order_id: intent.gateway_order_id || null,
      items: intent.items || [],
      metadata: intent.metadata || {},
    };
    return apiFetch('/payment-intents', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify(payload),
    });
  },

  async update(id, updates) {
    return apiFetch(`/payment-intents/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(updates),
    });
  },

  async delete(id) {
    await apiFetch(`/payment-intents/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== UPASHRAY MEDIA ==============

export const upashrayMediaDB = {
  async getAll(columns = '*') {
    return apiFetch('/upashray-media', { headers: buildHeaders(false, false) });
  },

  async getByUpashrayId(upashrayId, columns = '*') {
    return apiFetch(`/upashray-media/upashray/${upashrayId}`, {
      headers: buildHeaders(false, false),
    });
  },

  async getByUpashrayIdAndType(upashrayId, mediaType, columns = '*') {
    return apiFetch(`/upashray-media/upashray/${upashrayId}?type=${encodeURIComponent(mediaType)}`, {
      headers: buildHeaders(false, false),
    });
  },

  async create(mediaItem) {
    return apiFetch('/upashray-media', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(mediaItem),
    });
  },

  async upload(upashrayId, file, mediaType) {
    const normalizedType = String(mediaType || '').trim().toLowerCase();
    if (!upashrayId) throw new Error('Upashray ID is required.');
    if (!normalizedType) throw new Error('Media type is required.');

    const webpBlob = await convertImageFileToWebP(file, { quality: 0.82 });
    const safeFileName = sanitizeImageFileName(file.name || 'image');

    const formData = new FormData();
    formData.append('file', webpBlob, `${normalizedType}-${Date.now()}-${safeFileName}.webp`);
    formData.append('upashray_id', upashrayId);
    formData.append('media_type', normalizedType);
    formData.append('alt_text', `${normalizedType} image`);
    formData.append('sort_order', '0');

    const token = getToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const res = await fetch(`${API_BASE}/upashray-media`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Upload failed: HTTP ${res.status}`);
    }

    return res.json();
  },

  async update(id, mediaItem) {
    return apiFetch(`/upashray-media/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify(mediaItem),
    });
  },

  async delete(id) {
    await apiFetch(`/upashray-media/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== SITE SETTINGS ==============

export const siteSettingsDB = {
  async getAll() {
    return apiFetch('/site-settings', { headers: buildHeaders(false, false) });
  },

  async getByKey(settingKey) {
    try {
      return await apiFetch(`/site-settings/${settingKey}`, {
        headers: buildHeaders(false, false),
      });
    } catch (err) {
      if (err.message.includes('404')) return null;
      throw err;
    }
  },

  async upsert(settingKey, settingValue) {
    return apiFetch(`/site-settings/${settingKey}`, {
      method: 'PUT',
      headers: buildHeaders(true, true),
      body: JSON.stringify({ setting_value: settingValue }),
    });
  },

  async delete(settingKey) {
    await apiFetch(`/site-settings/${settingKey}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== ADMIN PROFILES ==============
// Note: Admin users are now managed via admin_users table in MySQL.
// These methods map to the auth system for compatibility.

export const adminProfilesDB = {
  async getAll() {
    // Not exposed via API — return empty array for compatibility
    return [];
  },

  async getByUserId(userId) {
    return null;
  },

  async upsert(profile) {
    return profile;
  },

  async delete(userId) {
    // No-op
  }
};

// ============== AUDIT LOGS ==============
// Audit logs not yet exposed via backend API — stub for compatibility

export const auditLogsDB = {
  async getAll() {
    return [];
  },

  async getByEntity(entityType, entityId) {
    return [];
  },

  async create(logEntry) {
    // Silently skip audit log writes (not yet implemented in backend)
    console.log('[auditLogsDB] audit log (not saved):', logEntry);
    return { ...logEntry, id: Date.now() };
  }
};

// ============== YATRIK REGISTRATIONS ==============

export const yatrikRegistrationsDB = {
  async getAll() {
    return apiFetch('/yatrik-registrations', { headers: buildHeaders(true, false) });
  },

  async getByYatraId(yatraId) {
    return apiFetch(`/yatrik-registrations/yatra/${yatraId}`, {
      headers: buildHeaders(false, false),
    });
  },

  async create(registration) {
    const payload = {
      registrations: [{
        ...registration,
        registration_source: registration.registration_source || 'online',
      }]
    };
    const result = await apiFetch('/yatrik-registrations', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify(payload),
    });
    // Backend returns { inserted: [{id, first_name, last_name}] }
    return result?.inserted?.[0] || result;
  },

  async createMultiple(registrations) {
    const prepared = registrations.map(reg => ({
      ...reg,
      registration_source: reg.registration_source || 'online',
    }));
    const result = await apiFetch('/yatrik-registrations', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify({ registrations: prepared }),
    });
    return result?.inserted || [];
  },

  async delete(id) {
    await apiFetch(`/yatrik-registrations/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== DEMO YATRIK REGISTRATIONS ==============
// Demo registrations go to same table with a different source flag for now

export const demoYatrikRegistrationsDB = {
  async createMultiple(registrations) {
    const prepared = registrations.map(reg => ({
      ...reg,
      registration_source: reg.registration_source || 'online',
    }));
    const result = await apiFetch('/yatrik-registrations', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify({ registrations: prepared }),
    });
    return result?.inserted || [];
  }
};

// ============== CHECKING REPORTS ==============

export const checkingReportsDB = {
  async getAll() {
    return apiFetch('/checking-reports', { headers: buildHeaders(true, false) });
  },

  async getById(id) {
    return apiFetch(`/checking-reports/${id}`, { headers: buildHeaders(true, false) });
  },

  async getByUpashrayId(upashrayId) {
    return apiFetch(`/checking-reports?upashray_id=${upashrayId}`, {
      headers: buildHeaders(true, false),
    });
  },

  async getByJinalayaId(jinalayaId) {
    return apiFetch(`/checking-reports?jinalaya_id=${jinalayaId}`, {
      headers: buildHeaders(true, false),
    });
  },

  async create(report) {
    return apiFetch('/checking-reports', {
      method: 'POST',
      headers: buildHeaders(true, true),
      body: JSON.stringify(report),
    });
  },

  async delete(id) {
    await apiFetch(`/checking-reports/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};

// ============== CONTACT MESSAGES ==============

export const contactMessagesDB = {
  async getAll() {
    return apiFetch('/contact-messages', { headers: buildHeaders(true, false) });
  },

  async create(message) {
    return apiFetch('/contact-messages', {
      method: 'POST',
      headers: buildHeaders(false, true),
      body: JSON.stringify(message),
    });
  },

  async delete(id) {
    await apiFetch(`/contact-messages/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(true, false),
    });
  }
};
