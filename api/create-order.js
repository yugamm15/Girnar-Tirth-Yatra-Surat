import Razorpay from 'razorpay';

async function getRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return res.status(401).json({ error: 'Razorpay API credentials not configured' });
  }

  try {
    const body = await getRequestBody(req);
    const { amount, currency = 'INR', receipt } = body;

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise' });
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
      return res.status(401).json({ error: 'Authentication failure with Razorpay API' });
    }
    return res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}
