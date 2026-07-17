NUTRISME - FRONT-END BUILD 2026-07-17-5
========================================

TUJUAN BUILD
------------
Build ini mengubah tautan "Kebijakan Privasi" pada formulir "Pesan Sekarang".
Saat tautan ditekan, pengunjung sekarang melihat pop-up khusus yang terpisah dari
form pemesanan. Pop-up berisi kebijakan yang lebih lengkap dan dapat digulir.

PERUBAHAN UTAMA
---------------
1. Catatan privasi singkat di bawah checkbox dihapus.
2. Tautan "Kebijakan Privasi" sekarang membuka dialog/pop-up kedua.
3. Isi kebijakan mencakup:
   - data yang dikumpulkan;
   - tujuan penggunaan;
   - persetujuan dan pemrosesan;
   - penggunaan Google Apps Script dan Google Sheets;
   - pihak yang dapat menerima data;
   - penyimpanan dan keamanan;
   - hak pengguna;
   - data anak;
   - perubahan kebijakan; dan
   - kanal kontak terkait privasi.
4. Pop-up dapat ditutup melalui tombol silang, tombol "Tutup Kebijakan Privasi",
   klik backdrop, atau tombol Escape.
5. Fokus keyboard dikunci di dialog yang sedang aktif dan dikembalikan ke tautan
   Kebijakan Privasi setelah dialog ditutup.
6. Checkbox tidak dicentang otomatis hanya karena kebijakan dibuka atau ditutup.
7. Perbaikan modal sukses dari build sebelumnya tetap dipertahankan.
8. Nomor build dan cache-buster diperbarui ke 2026-07-17-5.

FILE YANG DIUBAH
----------------
- index.html
- script.js
- style.css
- README.txt
- DEPLOY-CHECKLIST.txt

FILE YANG TIDAK BERUBAH
-----------------------
- seluruh file di folder assets/
- Google Apps Script / backend

CARA DEPLOY CEPAT
-----------------
1. Ganti index.html, script.js, dan style.css di root repository GitHub Pages.
2. Commit dan push ke branch GitHub Pages yang aktif.
3. Tunggu deployment selesai tanpa error.
4. Buka https://www.nutrisme.biz.id/ dalam mode incognito atau hard refresh:
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
5. Jalankan pengujian pada DEPLOY-CHECKLIST.txt.

CATATAN BACKEND
---------------
Perubahan ini hanya pada front-end. Jika pengiriman formulir ke Google Sheets
sudah berjalan, Google Apps Script tidak perlu diubah atau di-deploy ulang.
Endpoint /exec yang ada pada script.js tetap dipertahankan.

CATATAN KEBIJAKAN PRIVASI
-------------------------
Teks yang disertakan merupakan template operasional berdasarkan data dan alur
form saat ini. Pastikan praktik internal Nutrisme benar-benar sesuai dengan isi
kebijakan, terutama mengenai siapa yang dapat mengakses data, pembagian kepada
mitra pengiriman, periode penyimpanan, penghapusan, dan kanal kontak resmi.
Lakukan peninjauan hukum sebelum mengandalkan teks ini sebagai dokumen kepatuhan
final.
