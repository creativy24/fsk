// script.js
const form = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');

// Saat form disubmit
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const inputPassword = passwordInput.value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: inputPassword })
    });

    if (response.ok) {
      window.location.href = "dashboard.html";
    } else {
      const data = await response.json();
      errorMsg.textContent = data.message || "Password salah";
      passwordInput.value = "";
      passwordInput.focus();
    }
  } catch (error) {
    errorMsg.textContent = "Terjadi kesalahan koneksi.";
  }
});

// Dark mode otomatis
const hour = new Date().getHours();
if (hour >= 18 || hour <= 5) {
  document.body.classList.add('dark');
}

// Tampilkan tanggal sekarang
const tanggalSekarangEl = document.getElementById('tanggal-sekarang');
const jumlahHariEl = document.getElementById('jumlah-hari');

const today = new Date();
const tanggalSekarangStr = today.toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric"
});
if (tanggalSekarangEl) {
  tanggalSekarangEl.textContent = tanggalSekarangStr;
}

// Hitung umur dari 21 April 2024
const startDate = new Date(2024, 3, 21); // April
let tahun = today.getFullYear() - startDate.getFullYear();
let bulan = today.getMonth() - startDate.getMonth();
let hari = today.getDate() - startDate.getDate();

if (hari < 0) {
  bulan -= 1;
  const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  hari += lastMonth.getDate();
}
if (bulan < 0) {
  tahun -= 1;
  bulan += 12;
}

if (jumlahHariEl) {
  jumlahHariEl.textContent = `Sudah berjalan selama ${tahun > 0 ? tahun + " tahun, " : ""}${bulan > 0 ? bulan + " bulan, " : ""}${hari} hari`;
}
