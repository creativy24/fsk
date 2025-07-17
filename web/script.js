const form = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error-msg');

// Ganti ini dengan password yang kamu inginkan
const correctPassword = "rahasia123";

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputPassword = passwordInput.value;

  if (inputPassword === correctPassword) {
    window.location.href = "dashboard.html"; // halaman setelah login berhasil
  } else {
    errorMsg.textContent = "Password salah. Coba lagi.";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// Dark mode otomatis berdasarkan jam
const hour = new Date().getHours();
if (hour >= 18 || hour <= 5) {
  document.body.classList.add('dark');
}

// Tampilkan tanggal saat ini
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

// Hitung selisih dari 21 April 2024
const startDate = new Date(2024, 3, 21); // bulan dimulai dari 0, jadi 3 = April

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

jumlahHariEl.textContent = `Sudah berjalan selama ${tahun > 0 ? tahun + " tahun, " : ""}${bulan > 0 ? bulan + " bulan, " : ""}${hari} hari`;
