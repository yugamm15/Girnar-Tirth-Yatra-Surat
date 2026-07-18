// routes/sponsorshipSchemes.js — Full CRUD for sponsorship_schemes table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/sponsorship-schemes
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let sql = 'SELECT * FROM sponsorship_schemes WHERE 1=1';
    const params = [];

    if (active === 'true') {
      sql += ' AND is_active = 1';
    }
    sql += ' ORDER BY sort_order ASC, created_at DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sponsorship-schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM sponsorship_schemes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Scheme not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sponsorship-schemes (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, amount, sort_order, is_active } = req.body;

    if (!title) return res.status(400).json({ error: 'title is required.' });

    const [result] = await pool.execute(
      'INSERT INTO sponsorship_schemes (title, description, amount, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, amount || 0, sort_order || 0, is_active !== false ? 1 : 0]
    );

    const [newRow] = await pool.execute('SELECT * FROM sponsorship_schemes WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sponsorship-schemes/:id (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, amount, sort_order, is_active } = req.body;

    const [result] = await pool.execute(
      'UPDATE sponsorship_schemes SET title = ?, description = ?, amount = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [title, description || null, amount || 0, sort_order || 0, is_active ? 1 : 0, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Scheme not found.' });

    const [updated] = await pool.execute('SELECT * FROM sponsorship_schemes WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sponsorship-schemes/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM sponsorship_schemes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Scheme not found.' });
    res.json({ message: 'Scheme deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
