// routes/checkingReports.js — CRUD for checking_reports table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/checking-reports (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { upashray_id, jinalaya_id, member_id } = req.query;
    let sql = `SELECT cr.*, m.name AS member_name, u.name AS upashray_name, j.name AS jinalaya_name
               FROM checking_reports cr
               LEFT JOIN members   m ON m.id = cr.member_id
               LEFT JOIN upashrays u ON u.id = cr.upashray_id
               LEFT JOIN jinalayas j ON j.id = cr.jinalaya_id
               WHERE 1=1`;
    const params = [];

    if (upashray_id) { sql += ' AND cr.upashray_id = ?'; params.push(upashray_id); }
    if (jinalaya_id) { sql += ' AND cr.jinalaya_id = ?'; params.push(jinalaya_id); }
    if (member_id)   { sql += ' AND cr.member_id = ?';   params.push(member_id); }
    sql += ' ORDER BY cr.report_date DESC';

    const [rows] = await pool.execute(sql, params);
    rows.forEach(r => { if (typeof r.points === 'string') r.points = JSON.parse(r.points); });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/checking-reports/:id (protected)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM checking_reports WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Report not found.' });
    const row = rows[0];
    if (typeof row.points === 'string') row.points = JSON.parse(row.points);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/checking-reports (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { member_id, upashray_id, jinalaya_id, report_date, points, general_notes } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO checking_reports (member_id, upashray_id, jinalaya_id, report_date, points, general_notes) VALUES (?, ?, ?, ?, ?, ?)',
      [member_id || null, upashray_id || null, jinalaya_id || null,
       report_date || new Date().toISOString().split('T')[0],
       JSON.stringify(points || []), general_notes || null]
    );

    const [newRow] = await pool.execute('SELECT * FROM checking_reports WHERE id = ?', [result.insertId]);
    const row = newRow[0];
    if (typeof row.points === 'string') row.points = JSON.parse(row.points);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/checking-reports/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM checking_reports WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Report not found.' });
    res.json({ message: 'Report deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
