const express = require('express');
const path = require('path');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware: JSON body parser
app.use(express.json());

// Middleware: Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fsk-secret-key', // Gantilah di env production
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 jam
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Middleware: Rate limiter untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maks 5 kali percobaan
  message: { success: false, message: "Terlalu banyak percobaan. Coba lagi nanti." }
});

// Middleware: Melayani file statis
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

// Middleware proteksi halaman dashboard
function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/');
}

// Route halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route halaman dashboard (dilindungi)
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'dashboard.html'));
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
