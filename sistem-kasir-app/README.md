# Sistem Kasir Pro 🚀

Sistem Kasir Pro adalah aplikasi manajemen toko berbasis web modern yang dibangun dengan React dan Vite. Aplikasi ini memiliki desain antarmuka *glassmorphism* premium dan menyediakan berbagai fitur *Point of Sales* lengkap.

## Fitur Utama Terintegrasi
1. **Dashboard Overview**: Ringkasan penjualan lengkap, pergerakan arus kas mingguan via grafik *real-time*, dan daftar 5 transaksi checkout terbaru.
2. **Transaksi & Scan Barcode**: Sistem kasir (POS) cerdas yang dibekali dengan pemindai *barcode* langsung memanfaatkan kamera bawaan (laptop/hp). Anda dapat melakukan checkout dengan 3 mode pembayaran: **Tunai** (beserta kalkulasi otomatis kembalian uang), **QRIS**, dan **Kartu (EDC)**.
3. **Audit Barang**: Tabel inventaris interaktif untuk menambahkan *item* produk baru, mengubah harga jual, memperbarui status stok barang gudang, serta penugasan identitas kode barcode.
4. **Keuangan**: Rekapitulasi pergerakan arus kas secara spesifik yang mendata mutasi masuk/keluar (seperti modal tambahan atau pengeluaran)  selain memantau histori metode pembayaran tagihan kasir pelanggan.
5. **Pengaturan Profil Toko**: Sesuaikan Nama Toko, Nama Staf Kasir, dan Posisi/Jabatan langsung dari header aplikasi.

## Tata Cara Menjalankan Aplikasi Secara Lokal (Development)

Untuk dapat menjalankan atau memodifikasi aplikasi Sistem Kasir ini pada komputer, ikuti tahapan instruksi berikut:

### Persiapan Prasyarat
Pastikan komputer Anda telah terinstal peranti lunak **Node.js** (unduh di https://nodejs.org). Sangat direkomendasikan memakai versi LTS terbaru (V18+). Peranti `npm` (Node Package Manager) sudah otomatis terinstal saat memasang Node.js.

### Tahap Eksekusi

1. **Buka Terminal / Command Prompt**
   Arahkan sistem *path* folder Anda secara langsung menuju ke direktori projek `sistem-kasir-app`:
   
   ```bash
   cd "d:\SMESTER 6\PROJEK\sistem-kasir-app"
   ```

2. **Unduh Paket Dependensi (*Package Installation*)**
   Aplikasi membutuhkan berbagai ekstensi luar (*libraries*) seperti *Lucide React* (untuk ikon visual) dan *Recharts* (grafik panggung). Lakukan sinkronisasinya hingga 100% menggunakan perintah di bawah:
   
   ```bash
   npm install
   ```

3. **Jalankan *Development Server***
   Setelah semua instalasi paket *library* rampung dan sukses, nyalakan *server lokal* aplikasi dengan memberikan instruksi:

   ```bash
   npm run dev
   ```

4. **Akses ke Peramban Situs (Browser)**
   Berdasarkan proses menyala, pada layar terminal akan tertulis secara spesifik di mana *localhost* aplikasi Anda berada (pada umumnya ada di `http://localhost:5173/` atau `http://localhost:5174/`). 
   Silakan ketikkan *URL* tersebut di peramban web semisal Google Chrome untuk meluncurkan sistem kasir! 🚀

---
**Catatan Penyimpanan Data**: 
Seluruh data *mock* (dummy) produk katalog, transaksi, dan histori uang masuk akan diakomodasi ke dalam penyimpanan bawaan situs (`LocalStorage`). Artinya seluruh inputan data akan diingat meski tab dikeluarkan, kecuali Anda menghapus data situs web, cache peramban *browser* bersih, atau pindah sistem PC.
