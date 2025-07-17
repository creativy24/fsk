const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

// Middleware untuk parsing JSON dari request body
app.use(express.json());

// Serve file statis dari direktori saat ini
app.use(express.static(__dirname));

// Endpoint login
app.post('/login', (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.OWNER_FSK;

  if (password === correctPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Password salah" });
  }
});

// Untuk semua route lain, kembalikan index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
