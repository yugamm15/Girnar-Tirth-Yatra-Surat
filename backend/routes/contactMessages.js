// routes/contactMessages.js — CRUD for contact_messages table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/contact-messages (protected — admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/contact-messages (public — anyone can submit)
router.post('/', async (req, res) => {
  try {
    const { full_name, phone, email, message } = req.body;

    if (!full_name || !message) {
      return res.status(400).json({ error: 'full_name and message are required.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO contact_messages (full_name, phone, email, message) VALUES (?, ?, ?, ?)',
      [full_name, phone || null, email || null, message]
    );

    const [newRow] = await pool.execute('SELECT * FROM contact_messages WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('POST /contact-messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact-messages/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Contact message deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
