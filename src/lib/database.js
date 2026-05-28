import { supabase } from './supabaseClient';
import { formatDateToISO } from '../utils/dateUtils.js';
import { convertImageFileToWebP, sanitizeImageFileName } from '../utils/imageUtils.js';

const DATABASE_CACHE_PREFIX = 'girnar_db_cache_v1';

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

export const uploadWebPImage = async ({ bucketName, folderName, recordId, file, mediaType, quality = 0.82 }) => {
  if (!file) {
    throw new Error('Image file is required.');
  }

  try {
    console.log('[uploadWebPImage] start', { bucketName, folderName, recordId, mediaType, fileName: file.name });
    const webpBlob = await convertImageFileToWebP(file, { quality });
    console.log('[uploadWebPImage] converted to webp', { size: webpBlob.size, type: webpBlob.type });

    const safeFileName = sanitizeImageFileName(file.name || 'image');
    const storagePath = `${folderName}/${recordId}/${mediaType}-${Date.now()}-${safeFileName}.webp`;

    const result = await supabase.storage
      .from(bucketName)
      .upload(storagePath, webpBlob, {
        contentType: 'image/webp',
        upsert: false,
      });

    // Log full result for debugging (will include error if any)
    console.log('[uploadWebPImage] upload result', result);

    if (result?.error) {
      console.error('[uploadWebPImage] upload error', result.error);
      throw result.error;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    const publicUrl = data?.publicUrl || '';
    console.log('[uploadWebPImage] publicUrl', publicUrl);
    return publicUrl;
  } catch (err) {
    // Surface helpful debugging information
    console.error('[uploadWebPImage] unexpected error', err);
    throw err;
  }
};

// ============== UPASHRAYS ==============

export const upashraysDB = {
  async getAll(columns = '*') {
    const { data, error } = await supabase
      .from('upashrays')
      .select(columns)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id, columns = '*') {
    const { data, error } = await supabase
      .from('upashrays')
      .select(columns)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getBySlug(slug, columns = '*') {
    const { data, error } = await supabase
      .from('upashrays')
      .select(columns)
      .eq('slug', slug)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(upashray) {
    const { data, error } = await supabase
      .from('upashrays')
      .insert([{ ...upashray, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, upashray) {
    const { data, error } = await supabase
      .from('upashrays')
      .update({ ...upashray, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('upashrays')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async search(query) {
    const { data, error } = await supabase
      .from('upashrays')
      .select('*')
      .or(`name.ilike.%${query}%,village.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

// ============== MEMBERS ==============

export const membersDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByEmail(email) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .ilike('email', email)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(member) {
    const { data, error } = await supabase
      .from('members')
      .insert([{ ...member, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, member) {
    const { data, error } = await supabase
      .from('members')
      .update({ ...member, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async search(query) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

// ============== JINALAYAS ==============

export const jinalayasDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('jinalayas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('jinalayas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(jinalaya) {
    const { data, error } = await supabase
      .from('jinalayas')
      .insert([{ ...jinalaya, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, jinalaya) {
    const { data, error } = await supabase
      .from('jinalayas')
      .update({ ...jinalaya, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('jinalayas')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async search(query) {
    const { data, error } = await supabase
      .from('jinalayas')
      .select('*')
      .or(`name.ilike.%${query}%,village.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

// ============== YATRA DATES ==============

export const yatraDatesDB = {
  async getAll(columns = '*') {
    const { data, error } = await supabase
      .from('yatra_dates')
      .select(columns)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id, columns = '*') {
    const { data, error } = await supabase
      .from('yatra_dates')
      .select(columns)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(yatraDate) {
    const { data, error } = await supabase
      .from('yatra_dates')
      .insert([{ 
        trip_date: normalizeTripDate(yatraDate.trip_date || yatraDate.date_text),
        description: yatraDate.description,
        image: yatraDate.image,
        registration_open: yatraDate.registration_open,
        price_per_person: yatraDate.price_per_person || 900,
        max_capacity: yatraDate.max_capacity === '' || yatraDate.max_capacity === undefined ? null : Number(yatraDate.max_capacity),
        created_at: new Date().toISOString() 
      }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, updates) {
    const normalizedUpdates = { ...updates };
    if (normalizedUpdates.date_text && !normalizedUpdates.trip_date) {
      normalizedUpdates.trip_date = normalizeTripDate(normalizedUpdates.date_text);
    }
    delete normalizedUpdates.date_text;
    if (normalizedUpdates.max_capacity !== undefined) {
      normalizedUpdates.max_capacity = normalizedUpdates.max_capacity === '' || normalizedUpdates.max_capacity === null
        ? null
        : Number(normalizedUpdates.max_capacity);
    }

    const { data, error } = await supabase
      .from('yatra_dates')
      .update({ ...normalizedUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('yatra_dates')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== SPONSORSHIP SCHEMES ==============

export const sponsorshipSchemesDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('sponsorship_schemes')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('sponsorship_schemes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(scheme) {
    const payload = {
      title: scheme.title,
      description: scheme.description || '',
      amount: Number(scheme.amount || 0),
      sort_order: Number(scheme.sort_order || 0),
      is_active: scheme.is_active === undefined ? true : Boolean(scheme.is_active),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('sponsorship_schemes')
      .insert([payload])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, scheme) {
    const payload = {
      title: scheme.title,
      description: scheme.description || '',
      amount: Number(scheme.amount || 0),
      sort_order: Number(scheme.sort_order || 0),
      is_active: scheme.is_active === undefined ? true : Boolean(scheme.is_active),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('sponsorship_schemes')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('sponsorship_schemes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== PAYMENT INTENTS ==============

export const paymentIntentsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_intents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(intent) {
    const payload = {
      module_key: intent.module_key,
      reference_type: intent.reference_type || null,
      reference_id: intent.reference_id === undefined || intent.reference_id === null ? null : String(intent.reference_id),
      payer_name: intent.payer_name || '',
      phone: intent.phone || '',
      email: intent.email || '',
      city: intent.city || '',
      amount: Number(intent.amount || 0),
      currency: intent.currency || 'INR',
      status: intent.status || 'pending',
      gateway_order_id: intent.gateway_order_id || null,
      gateway_payment_id: intent.gateway_payment_id || null,
      refund_status: intent.refund_status || 'not_requested',
      refund_transaction_id: intent.refund_transaction_id || null,
      refund_contact: intent.refund_contact || null,
      refund_notes: intent.refund_notes || null,
      refund_requested_at: intent.refund_requested_at || null,
      refund_processed_at: intent.refund_processed_at || null,
      admin_notes: intent.admin_notes || null,
      items: intent.items || [],
      metadata: intent.metadata || {},
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('payment_intents')
      .insert([payload])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('payment_intents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('payment_intents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== UPASHRAY MEDIA ==============

export const upashrayMediaDB = {
  async getAll(columns = '*') {
    const { data, error } = await supabase
      .from('upashray_media')
      .select(columns)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUpashrayId(upashrayId, columns = '*') {
    const { data, error } = await supabase
      .from('upashray_media')
      .select(columns)
      .eq('upashray_id', upashrayId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUpashrayIdAndType(upashrayId, mediaType, columns = '*') {
    const { data, error } = await supabase
      .from('upashray_media')
      .select(columns)
      .eq('upashray_id', upashrayId)
      .eq('media_type', mediaType)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(mediaItem) {
    const { data, error } = await supabase
      .from('upashray_media')
      .insert([{ ...mediaItem, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async upload(upashrayId, file, mediaType) {
    const normalizedType = String(mediaType || '').trim().toLowerCase();
    if (!upashrayId) throw new Error('Upashray ID is required.');
    if (!normalizedType) throw new Error('Media type is required.');

    const fileUrl = await uploadWebPImage({
      bucketName: 'upashray-media',
      folderName: 'upashrays',
      recordId: upashrayId,
      file,
      mediaType: normalizedType,
    });

    const { data, error } = await supabase
      .from('upashray_media')
      .insert([{
        upashray_id: upashrayId,
        media_type: normalizedType,
        file_url: fileUrl,
        alt_text: `${normalizedType} image`,
        sort_order: 0,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async update(id, mediaItem) {
    const { data, error } = await supabase
      .from('upashray_media')
      .update({ ...mediaItem, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('upashray_media')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== SITE SETTINGS ==============

export const siteSettingsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByKey(settingKey) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', settingKey)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async upsert(settingKey, settingValue) {
    const payload = {
      setting_key: settingKey,
      setting_value: settingValue,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('site_settings')
      .upsert([payload], { onConflict: 'setting_key' })
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(settingKey) {
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('setting_key', settingKey);
    if (error) throw error;
  }
};

// ============== ADMIN PROFILES ==============

export const adminProfilesDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async upsert(profile) {
    const payload = {
      ...profile,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('admin_profiles')
      .upsert([payload], { onConflict: 'user_id' })
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(userId) {
    const { error } = await supabase
      .from('admin_profiles')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  }
};

// ============== AUDIT LOGS ==============

export const auditLogsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByEntity(entityType, entityId) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false });

    if (entityId) {
      query = query.eq('entity_id', String(entityId));
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async create(logEntry) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([{ ...logEntry, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  }
};

// ============== YATRIK REGISTRATIONS ==============

export const yatrikRegistrationsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('yatrik_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByYatraId(yatraId) {
    const { data, error } = await supabase
      .from('yatrik_registrations')
      .select('*')
      .eq('yatra_id', yatraId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(registration) {
    const { data, error } = await supabase
      .from('yatrik_registrations')
      .insert([{ ...registration, registration_source: registration.registration_source || 'online', created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async createMultiple(registrations) {
    const prepared = registrations.map(reg => ({
      ...reg,
      registration_source: reg.registration_source || 'online',
      created_at: new Date().toISOString()
    }));
    const { data, error } = await supabase
      .from('yatrik_registrations')
      .insert(prepared)
      .select();
    if (error) throw error;
    return data || [];
  },

  async delete(id) {
    const { error } = await supabase
      .from('yatrik_registrations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== CHECKING REPORTS ==============

export const checkingReportsDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('checking_reports')
      .select('*')
      .order('report_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('checking_reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByUpashrayId(upashrayId) {
    const { data, error } = await supabase
      .from('checking_reports')
      .select('*')
      .eq('upashray_id', upashrayId)
      .order('report_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByJinalayaId(jinalayaId) {
    const { data, error } = await supabase
      .from('checking_reports')
      .select('*')
      .eq('jinalaya_id', jinalayaId)
      .order('report_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(report) {
    const { data, error } = await supabase
      .from('checking_reports')
      .insert([{ ...report, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('checking_reports')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// ============== CONTACT MESSAGES ==============

export const contactMessagesDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(message) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ ...message, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
