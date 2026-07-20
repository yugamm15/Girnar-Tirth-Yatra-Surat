// server.js — Main Express Server Entry Point
// Node.js + Express + MySQL2 Backend for Girnar Tirth Yatra

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { testConnection } = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────

// Allow all origins dynamically (supporting credentials/JWT)
app.use(cors({
  origin: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());                         // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────────────────────────
// HEALTH CHECK — GET /api/health
// ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    message:   'Girnar Yatra Backend is running ✅',
  });
});

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────
app.use('/api/auth',                   require('./routes/auth'));
app.use('/api/upashrays',              require('./routes/upashrays'));
app.use('/api/members',                require('./routes/members'));
app.use('/api/jinalayas',              require('./routes/jinalayas'));
app.use('/api/yatra-dates',            require('./routes/yatraDates'));
app.use('/api/sponsorship-schemes',    require('./routes/sponsorshipSchemes'));
app.use('/api/payment-intents',        require('./routes/paymentIntents'));
app.use('/api/yatrik-registrations',   require('./routes/yatrikRegistrations'));
app.use('/api/upashray-media',         require('./routes/upashrayMedia'));
app.use('/api/site-settings',          require('./routes/siteSettings'));
app.use('/api/checking-reports',       require('./routes/checkingReports'));
app.use('/api/contact-messages',       require('./routes/contactMessages'));
app.use('/api',                        require('./routes/razorpay'));


// ─────────────────────────────────────────────────────────────
// 404 — Unknown route
// ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

// ─────────────────────────────────────────────────────────────
// START SERVER — Test DB first, then listen
// ─────────────────────────────────────────────────────────────
async function start() {
  await testConnection(); // Will exit(1) if DB is not reachable
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Press Ctrl+C to stop.\n`);
  });
}

start();
