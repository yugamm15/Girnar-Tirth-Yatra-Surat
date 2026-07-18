// routes/yatraDates.js — Full CRUD for yatra_dates table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/yatra-dates ───
router.get('/', async (req, res) => {
  try {
    const { open } = req.query;
    let sql = 'SELECT * FROM yatra_dates WHERE 1=1';
    const params = [];

    if (open === 'true') {
      sql += ' AND registration_open = 1';
    }
    sql += ' ORDER BY trip_date DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/yatra-dates/:id ───
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM yatra_dates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Yatra date not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/yatra-dates ─── (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { trip_date, description, image, registration_open, price_per_person, max_capacity } = req.body;

    if (!trip_date) return res.status(400).json({ error: 'trip_date is required.' });

    const [result] = await pool.execute(
      `INSERT INTO yatra_dates (trip_date, description, image, registration_open, price_per_person, max_capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trip_date, description || null, image || null,
       registration_open ? 1 : 0,
       price_per_person || 900.00,
       max_capacity || null]
    );

    const [newRow] = await pool.execute('SELECT * FROM yatra_dates WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('POST /yatra-dates:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/yatra-dates/:id ─── (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { trip_date, description, image, registration_open, price_per_person, max_capacity } = req.body;

    const [result] = await pool.execute(
      `UPDATE yatra_dates SET trip_date = ?, description = ?, image = ?,
        registration_open = ?, price_per_person = ?, max_capacity = ?
       WHERE id = ?`,
      [trip_date, description || null, image || null,
       registration_open ? 1 : 0,
       price_per_person || 900.00,
       max_capacity || null,
       req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Yatra date not found.' });

    const [updated] = await pool.execute('SELECT * FROM yatra_dates WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/yatra-dates/:id ─── (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM yatra_dates WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Yatra date not found.' });
    res.json({ message: 'Yatra date deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
