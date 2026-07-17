NUTRISME - VERSI DIPERBAIKI (FRONT-END BUILD 2026-07-17-4)
================================================================

PENTING SEBELUM MULAI
---------------------
Ekstrak ZIP ini terlebih dahulu. Jangan meng-upload ZIP sebagai satu file.
Upload isi folder hasil ekstrak ke repository GitHub Pages Nutrisme. Pastikan
nama file tidak mendapat tambahan seperti "(1)".

Baca juga DEPLOY-CHECKLIST.txt untuk langkah upload dan pengujian singkat.

PERBAIKAN UTAMA BUILD 2026-07-17-4
----------------------------------
Masalah sebelumnya:
Setelah pesanan berhasil dikirim, modal menampilkan pesan "Terima kasih!".
Jika modal kemudian ditutup melalui backdrop/area di luar modal, tombol silang
(X), atau tombol Escape, pembukaan berikutnya masih menampilkan pesan sukses
tersebut. Form hanya di-reset ketika tombol "Pesan Lagi" ditekan.

Perbaikan sekarang:
1. Setiap kali tombol "Pesan Sekarang" membuka modal, script memeriksa apakah
   modal masih berada pada tampilan sukses.
2. Jika iya, modal di-reset ke form pemesanan baru yang kosong sebelum dibuka.
3. Tombol "Pesan Lagi" memakai fungsi reset yang sama agar perilakunya konsisten.
4. Form yang belum pernah berhasil dikirim tetap dipertahankan saat modal ditutup,
   sehingga data yang sedang diketik tidak hilang secara tidak sengaja.
5. Nomor build dan cache-buster front-end diperbarui ke 2026-07-17-4.

FILE YANG DIUBAH PADA BUILD INI
-------------------------------
- index.html
- script.js
- README.txt
- DEPLOY-CHECKLIST.txt (ditambahkan agar petunjuk deployment lengkap)

FILE YANG TIDAK MEMERLUKAN PERUBAHAN UNTUK BUG MODAL
----------------------------------------------------
- style.css
- apps-script.gs
- seluruh file di folder assets/

CATATAN PENTING TENTANG GOOGLE APPS SCRIPT
-----------------------------------------
Perbaikan build 2026-07-17-4 adalah perbaikan front-end. Jika pengiriman form ke
Google Sheets sudah berjalan, Anda TIDAK perlu mengubah atau redeploy Google Apps
Script hanya untuk memperbaiki bug modal ini.

File apps-script.gs tetap disertakan sebagai salinan/backup backend dari paket
sebelumnya. Meng-upload apps-script.gs ke GitHub tidak mengubah Web App Google
Apps Script yang sedang aktif.

STRUKTUR FILE
-------------
- index.html
- style.css
- script.js
- apps-script.gs
- README.txt
- DEPLOY-CHECKLIST.txt
- assets/
  - cook-kit-gradient.webp
  - cook-kit.webp
  - frozen-prep.webp
  - meal-box-green.webp
  - meal-box.webp
  - nutrisme-mark.png
  - nutrisme-stacked.png
  - nutrisme-wordmark.png
  - weekly-prep-gradient.webp

DEPLOY CEPAT UNTUK PERBAIKAN MODAL
---------------------------------
1. Ganti index.html dan script.js di root repository dengan versi dari paket ini.
2. Commit dan push ke branch yang digunakan GitHub Pages.
3. Tunggu proses deployment selesai.
4. Buka https://www.nutrisme.biz.id/ lalu lakukan hard refresh:
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
5. Uji alur pada DEPLOY-CHECKLIST.txt.

UPLOAD LENGKAP (OPSIONAL)
-------------------------
Untuk menghindari perbedaan file, Anda juga dapat mengganti seluruh isi website
dengan index.html, style.css, script.js, dan folder assets/ dari paket ini.

CATATAN TEKNIS
---------------
Akar masalah berada pada state tampilan modal di script.js. Fungsi penutup modal
sebelumnya hanya menyembunyikan modal dan tidak mengembalikan orderSuccess ke
orderFormView. Build ini menambahkan satu fungsi reset terpusat dan menjalankannya
secara defensif saat modal dibuka kembali setelah submit sukses.

Endpoint Apps Script masih dipanggil menggunakan request form URL encoded dengan
mode "no-cors". Browser dapat mendeteksi kegagalan jaringan atau timeout, tetapi
karena sifat no-cors, validasi akhir pengiriman tetap perlu diperiksa melalui
Spreadsheet dan menu Apps Script > Executions.
