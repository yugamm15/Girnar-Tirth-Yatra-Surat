// routes/yatrikRegistrations.js — CRUD for yatrik_registrations table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/yatrik-registrations (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { yatra_id } = req.query;
    let sql = `SELECT yr.*, yd.trip_date FROM yatrik_registrations yr
               LEFT JOIN yatra_dates yd ON yd.id = yr.yatra_id WHERE 1=1`;
    const params = [];

    if (yatra_id) { sql += ' AND yr.yatra_id = ?'; params.push(yatra_id); }
    sql += ' ORDER BY yr.created_at DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/yatrik-registrations/yatra/:yatraId
router.get('/yatra/:yatraId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM yatrik_registrations WHERE yatra_id = ? ORDER BY created_at DESC',
      [req.params.yatraId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/yatrik-registrations (public — yatris register themselves)
router.post('/', async (req, res) => {
  try {
    const { registrations } = req.body; // Array of registrations

    if (!Array.isArray(registrations) || registrations.length === 0) {
      return res.status(400).json({ error: 'registrations array is required.' });
    }

    const inserted = [];
    for (const r of registrations) {
      const { first_name, last_name, phone, alt_phone, birthdate,
              gender, remarks, yatra_id, registration_source } = r;

      if (!first_name || !last_name || !phone || !birthdate) {
        return res.status(400).json({ error: 'first_name, last_name, phone, birthdate are required per registration.' });
      }

      const [result] = await pool.execute(
        `INSERT INTO yatrik_registrations
          (first_name, last_name, phone, alt_phone, birthdate, gender, remarks, yatra_id, registration_source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, phone, alt_phone || null, birthdate,
         gender || null, remarks || null, yatra_id || null,
         registration_source || 'online']
      );
      inserted.push({ id: result.insertId, first_name, last_name });
    }

    res.status(201).json({ message: `${inserted.length} registration(s) created.`, inserted });
  } catch (err) {
    console.error('POST /yatrik-registrations:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/yatrik-registrations/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM yatrik_registrations WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Registration not found.' });
    res.json({ message: 'Registration deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
