// routes/members.js — Full CRUD for members table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ─── GET /api/members ─── Get all (with optional search)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search, has_access } = req.query;
    let sql = 'SELECT id, name, email, phone, code, has_access, created_at, updated_at FROM members WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR code LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (has_access !== undefined) {
      sql += ' AND has_access = ?';
      params.push(has_access === 'true' ? 1 : 0);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /members:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/members/:id ─── Get by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, code, has_access, created_at, updated_at FROM members WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Member not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /members/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/members ─── Create (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, code, has_access, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO members (name, email, phone, code, has_access, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone || null, code || null, has_access ? 1 : 0, password || null]
    );

    const [newRow] = await pool.execute(
      'SELECT id, name, email, phone, code, has_access, created_at FROM members WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(newRow[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or code already exists.' });
    }
    console.error('POST /members:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/members/:id ─── Update (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const fields = [];
    const params = [];

    const allowedFields = [
      'name', 'email', 'phone', 'code', 'has_access', 'password'
    ];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        // Skip updating password if it is empty string or null (meaning keep existing password)
        if (key === 'password' && (req.body[key] === '' || req.body[key] === null)) {
          continue;
        }

        fields.push(`${key} = ?`);
        // Map boolean has_access to 1/0, and map empty strings to null except code/phone which can be null
        if (key === 'has_access') {
          params.push(req.body[key] ? 1 : 0);
        } else {
          params.push(req.body[key] === '' ? null : req.body[key]);
        }
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(req.params.id);

    const [result] = await pool.execute(
      `UPDATE members SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Member not found.' });

    const [updated] = await pool.execute(
      'SELECT id, name, email, phone, code, has_access, created_at, updated_at FROM members WHERE id = ?',
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (err) {
    console.error('PUT /members/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/members/:id ─── Delete (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Member not found.' });
    res.json({ message: 'Member deleted successfully.' });
  } catch (err) {
    console.error('DELETE /members/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
