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

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Lookup admin from DB
    let [rows] = await pool.execute(
      'SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1',
      [normalizedEmail]
    );

    let user = null;
    let role = null;

    if (rows.length > 0) {
      const admin = rows[0];
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (isMatch) {
        user = { id: admin.id, email: admin.email, role: admin.role, display_name: admin.display_name };
        role = admin.role || 'admin';
      }
    }

    // 2. If not admin, lookup member from DB
    if (!user) {
      [rows] = await pool.execute(
        'SELECT * FROM members WHERE email = ? LIMIT 1',
        [normalizedEmail]
      );

      if (rows.length > 0) {
        const member = rows[0];
        
        // Support both plain text and bcrypt password storage for members
        let isMatch = false;
        if (member.password && member.password.startsWith('$2')) {
          isMatch = await bcrypt.compare(password, member.password);
        } else {
          isMatch = (member.password === password);
        }

        if (isMatch) {
          if (member.has_access) {
            user = { id: member.id, email: member.email, role: 'member', display_name: member.name };
            role = 'member';
          } else {
            return res.status(403).json({ error: 'Your account does not have access. Please contact Admin.' });
          }
        }
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign JWT token (valid for 7 days)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user
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
