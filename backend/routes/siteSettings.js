// routes/siteSettings.js — CRUD for site_settings table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/site-settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings ORDER BY setting_key ASC');
    rows.forEach(r => {
      if (typeof r.setting_value === 'string') r.setting_value = JSON.parse(r.setting_value);
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/site-settings/:key
router.get('/:key', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings WHERE setting_key = ?', [req.params.key]);
    if (rows.length === 0) return res.status(404).json({ error: 'Setting not found.' });
    const row = rows[0];
    if (typeof row.setting_value === 'string') row.setting_value = JSON.parse(row.setting_value);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/site-settings/:key — Upsert (protected)
router.put('/:key', verifyToken, async (req, res) => {
  try {
    const { setting_value } = req.body;
    if (setting_value === undefined) return res.status(400).json({ error: 'setting_value is required.' });

    await pool.execute(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [req.params.key, JSON.stringify(setting_value)]
    );

    const [rows] = await pool.execute('SELECT * FROM site_settings WHERE setting_key = ?', [req.params.key]);
    const row = rows[0];
    if (typeof row.setting_value === 'string') row.setting_value = JSON.parse(row.setting_value);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/site-settings/:key (protected)
router.delete('/:key', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM site_settings WHERE setting_key = ?', [req.params.key]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Setting not found.' });
    res.json({ message: 'Setting deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
