// routes/paymentIntents.js — Full CRUD for payment_intents table

const express = require('express');
const router  = express.Router();
const { pool }        = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// GET /api/payment-intents (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, module_key } = req.query;
    let sql = 'SELECT * FROM payment_intents WHERE 1=1';
    const params = [];

    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (module_key) { sql += ' AND module_key = ?'; params.push(module_key); }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    // Parse JSON fields
    rows.forEach(row => {
      if (typeof row.items === 'string')    row.items    = JSON.parse(row.items);
      if (typeof row.metadata === 'string') row.metadata = JSON.parse(row.metadata);
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment-intents (public — used when making a payment)
router.post('/', async (req, res) => {
  try {
    const { module_key, reference_type, reference_id, payer_name, phone, email,
            city, amount, currency, status, gateway_order_id, items, metadata } = req.body;

    if (!module_key || !payer_name || !amount) {
      return res.status(400).json({ error: 'module_key, payer_name, amount are required.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO payment_intents
        (module_key, reference_type, reference_id, payer_name, phone, email, city,
         amount, currency, status, gateway_order_id, items, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [module_key, reference_type || null, reference_id || null,
       payer_name, phone || null, email || null, city || null,
       amount, currency || 'INR', status || 'pending',
       gateway_order_id || null,
       JSON.stringify(items || []),
       JSON.stringify(metadata || {})]
    );

    const [newRow] = await pool.execute('SELECT * FROM payment_intents WHERE id = ?', [result.insertId]);
    const row = newRow[0];
    if (typeof row.items === 'string')    row.items    = JSON.parse(row.items);
    if (typeof row.metadata === 'string') row.metadata = JSON.parse(row.metadata);
    res.status(201).json(row);
  } catch (err) {
    console.error('POST /payment-intents:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/payment-intents/:id (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { status, gateway_payment_id, admin_notes, refund_status,
            refund_transaction_id, refund_notes } = req.body;

    const [result] = await pool.execute(
      `UPDATE payment_intents SET status = ?, gateway_payment_id = ?, admin_notes = ?,
        refund_status = ?, refund_transaction_id = ?, refund_notes = ?
       WHERE id = ?`,
      [status, gateway_payment_id || null, admin_notes || null,
       refund_status || 'not_requested', refund_transaction_id || null,
       refund_notes || null, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Payment intent not found.' });

    const [updated] = await pool.execute('SELECT * FROM payment_intents WHERE id = ?', [req.params.id]);
    const row = updated[0];
    if (typeof row.items === 'string')    row.items    = JSON.parse(row.items);
    if (typeof row.metadata === 'string') row.metadata = JSON.parse(row.metadata);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/payment-intents/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM payment_intents WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Payment intent not found.' });
    res.json({ message: 'Payment intent deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
