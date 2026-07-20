// routes/upashrays.js — Full CRUD for upashrays table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/upashrays ─── Get all (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let sql    = 'SELECT * FROM upashrays WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR village LIKE ? OR route LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /upashrays:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/upashrays/slug/:slug ─── Get by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM upashrays WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Upashray not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /upashrays/slug/:slug:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/upashrays/:id ─── Get by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM upashrays WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Upashray not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /upashrays/:id:', err);
    res.status(500).json({ error: err.message });
  }
});


// ─── POST /api/upashrays ─── Create (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, village, route, trusty, mobile, location, description,
            before_img, process_img, after_img, status, slug } = req.body;

    if (!name || !village) {
      return res.status(400).json({ error: 'name and village are required.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO upashrays (name, village, route, trusty, mobile, location, description,
        before_img, process_img, after_img, status, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, village, route || null, trusty || null, mobile || null, location || null,
       description || null, before_img || null, process_img || null, after_img || null,
       status || 'plan', slug || null]
    );

    const [newRow] = await pool.execute('SELECT * FROM upashrays WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('POST /upashrays:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/upashrays/:id ─── Update (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const fields = [];
    const params = [];

    const allowedFields = [
      'name', 'village', 'route', 'trusty', 'mobile', 'location', 'description',
      'before_img', 'process_img', 'after_img', 'status', 'slug'
    ];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(req.body[key] === '' ? null : req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(req.params.id);

    const [result] = await pool.execute(
      `UPDATE upashrays SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Upashray not found.' });

    const [updated] = await pool.execute('SELECT * FROM upashrays WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /upashrays/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/upashrays/:id ─── Delete (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM upashrays WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Upashray not found.' });
    res.json({ message: 'Upashray deleted successfully.' });
  } catch (err) {
    console.error('DELETE /upashrays/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
