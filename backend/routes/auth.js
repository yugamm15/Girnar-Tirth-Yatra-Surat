// routes/auth.js — Login / Logout / Verify

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const { pool }       = require('../config/db');
const { verifyToken } = require('../middleware/auth');
require('dotenv').config();

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Lookup admin from DB
    const [rows] = await pool.execute(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const admin = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign JWT token (valid for 7 days)
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: admin.id, email: admin.email, role: admin.role, display_name: admin.display_name }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout — Client just discards the token
// ─────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/verify — Check if token is still valid
// ─────────────────────────────────────────────────────────────
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
