// routes/jinalayas.js — Full CRUD for jinalayas table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/jinalayas ───
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    let sql = 'SELECT * FROM jinalayas WHERE 1=1';
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
    console.error('GET /jinalayas:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/jinalayas/:id ───
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jinalayas WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Jinalaya not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/jinalayas ─── (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, village, route, mulnayak, location, description,
            before_img, process_img, after_img, status } = req.body;

    if (!name) return res.status(400).json({ error: 'name is required.' });

    const [result] = await pool.execute(
      `INSERT INTO jinalayas (name, village, route, mulnayak, location, description,
        before_img, process_img, after_img, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, village || null, route || null, mulnayak || null, location || null,
       description || null, before_img || null, process_img || null, after_img || null,
       status || 'plan']
    );

    const [newRow] = await pool.execute('SELECT * FROM jinalayas WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('POST /jinalayas:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const fields = [];
    const params = [];

    const allowedFields = [
      'name', 'village', 'route', 'mulnayak', 'location', 'description',
      'before_img', 'process_img', 'after_img', 'status'
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
      `UPDATE jinalayas SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Jinalaya not found.' });

    const [updated] = await pool.execute('SELECT * FROM jinalayas WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /jinalayas/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/jinalayas/:id ─── (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM jinalayas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Jinalaya not found.' });
    res.json({ message: 'Jinalaya deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
