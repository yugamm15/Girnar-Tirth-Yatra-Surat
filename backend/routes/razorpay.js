// routes/razorpay.js — Razorpay Payment Order Creation & Signature Verification
// Used for monthly bus yatra bookings and sponsorships

const express = require('express');
const router  = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');
require('dotenv').config();

// ─────────────────────────────────────────────────────────────
// POST /api/create-order — Initialize Razorpay order
// ─────────────────────────────────────────────────────────────
router.post('/create-order', async (req, res) => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error('Razorpay config error: missing keys in backend .env file');
    return res.status(500).json({ error: 'Razorpay API credentials not configured on the server.' });
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise (₹1).' });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const orderOptions = {
      amount: Math.round(parsedAmount),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description && error.error.description.toLowerCase().includes('auth'))) {
      return res.status(401).json({ error: 'Authentication failure with Razorpay API. Please check server keys.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to create order.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/verify-payment — Verify payment signature after success
// ─────────────────────────────────────────────────────────────
router.post('/verify-payment', async (req, res) => {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_secret) {
    return res.status(500).json({ success: false, error: 'Server configuration error: missing Razorpay secret.' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment verification fields.' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(payload)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Payment signature verification failed.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error during verification.' });
  }
});

module.exports = router;
