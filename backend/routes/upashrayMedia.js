// routes/upashrayMedia.js — CRUD for upashray_media table (with file upload)

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// ─── Multer disk storage ───
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'upashray-media');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

// GET /api/upashray-media
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM upashray_media ORDER BY sort_order ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/upashray-media/upashray/:upashrayId
router.get('/upashray/:upashrayId', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM upashray_media WHERE upashray_id = ?';
    const params = [req.params.upashrayId];

    if (type) { sql += ' AND media_type = ?'; params.push(type); }
    sql += ' ORDER BY sort_order ASC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upashray-media — Upload + create record (protected)
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { upashray_id, media_type, alt_text, sort_order } = req.body;

    if (!upashray_id || !media_type) {
      return res.status(400).json({ error: 'upashray_id and media_type are required.' });
    }

    // File URL — served statically from /uploads
    const file_url = req.file
      ? `/uploads/upashray-media/${req.file.filename}`
      : req.body.file_url; // Allow URL if no file uploaded

    if (!file_url) return res.status(400).json({ error: 'File or file_url is required.' });

    const [result] = await pool.execute(
      'INSERT INTO upashray_media (upashray_id, media_type, file_url, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)',
      [upashray_id, media_type, file_url, alt_text || null, sort_order || 0]
    );

    const [newRow] = await pool.execute('SELECT * FROM upashray_media WHERE id = ?', [result.insertId]);
    res.status(201).json(newRow[0]);
  } catch (err) {
    console.error('POST /upashray-media:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/upashray-media/:id (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { media_type, file_url, alt_text, sort_order } = req.body;

    const [result] = await pool.execute(
      'UPDATE upashray_media SET media_type = ?, file_url = ?, alt_text = ?, sort_order = ? WHERE id = ?',
      [media_type, file_url, alt_text || null, sort_order || 0, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Media not found.' });

    const [updated] = await pool.execute('SELECT * FROM upashray_media WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/upashray-media/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Optionally delete file from disk
    const [rows] = await pool.execute('SELECT file_url FROM upashray_media WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].file_url.startsWith('/uploads')) {
      const filePath = path.join(__dirname, '..', rows[0].file_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const [result] = await pool.execute('DELETE FROM upashray_media WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Media not found.' });
    res.json({ message: 'Media deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
