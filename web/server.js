const express = require('express');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); // ✅ Tambahkan Helmet.js untuk keamanan header

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware: Keamanan tambahan
app.use(helmet());

// Middleware: JSON body parser
app.use(express.json());

// Middleware: Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fsk-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Rate limiter untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Terlalu banyak percobaan. Coba lagi nanti." }
});

// Melayani file statis
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint login
app.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.OWNER_FSK;

  if (password === correctPassword) {
    req.session.isAuthenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Password salah" });
  }
});

// ✅ Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Proteksi dashboard
function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) return next();
  res.redirect('/');
}

// Halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Halaman dashboard
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'dashboard.html'));
});

// ✅ Fallback 404
app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan.');
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
