import { supabase } from './supabaseClient';

// ============== UPASHRAYS ==============

export const upashraysDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('upashrays')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('upashrays')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('upashrays')
      .select('*')
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
  async getAll() {
    const { data, error } = await supabase
      .from('yatra_dates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(yatraDate) {
    const { data, error } = await supabase
      .from('yatra_dates')
      .insert([{ 
        date_text: yatraDate.date_text,
        description: yatraDate.description,
        image: yatraDate.image,
        registration_open: yatraDate.registration_open,
        created_at: new Date().toISOString() 
      }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('yatra_dates')
      .update({
        date_text: updates.date_text,
        description: updates.description,
        image: updates.image,
        registration_open: updates.registration_open
      })
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

// ============== UPASHRAY MEDIA ==============

export const upashrayMediaDB = {
  async getAll() {
    const { data, error } = await supabase
      .from('upashray_media')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUpashrayId(upashrayId) {
    const { data, error } = await supabase
      .from('upashray_media')
      .select('*')
      .eq('upashray_id', upashrayId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUpashrayIdAndType(upashrayId, mediaType) {
    const { data, error } = await supabase
      .from('upashray_media')
      .select('*')
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
      .insert([{ ...registration, created_at: new Date().toISOString() }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async createMultiple(registrations) {
    const prepared = registrations.map(reg => ({
      ...reg,
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

  async getByUpashrayId(upashrayId) {
    const { data, error } = await supabase
      .from('checking_reports')
      .select('*')
      .eq('upashray_id', upashrayId)
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
