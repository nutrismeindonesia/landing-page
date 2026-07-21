NUTRISME V23 - KONFIGURASI NAMA SPREADSHEET
Build: 2026-07-21-23

KONFIGURASI FINAL
- Spreadsheet ID: 1W84u1NlUBYCGrv80bsk9bp0-kt6uX8EcEz6uPju-_0M
- Nama file Spreadsheet: Nutrisme
- Nama tab/sheet: order
- Kolom: No, Tanggal, Jam, Nama Lengkap, Username Instagram
- Checkbox Privacy Policy tetap wajib, tetapi tidak dibuat sebagai kolom.

LANGKAH PEMASANGAN
1. Buka Spreadsheet target, lalu Extensions > Apps Script.
2. Ganti Code.gs dengan isi apps-script.gs v23 dan Save.
3. Jalankan setupNutrisme sekali. Fungsi ini akan mengubah nama file menjadi Nutrisme dan membuat/merename tab menjadi order.
4. Jalankan testHeroLeadNutrisme dan pastikan baris tes masuk ke tab order.
5. Deploy > Manage deployments > Edit > New version > Deploy.
6. Execute as: Me. Who has access: Anyone.
7. Pastikan URL /exec pada meta nutrisme-apps-script-url di index.html sama dengan URL deployment aktif.
8. Upload index.html, script.js, style.css, backend-test.html, build.txt, CNAME, .nojekyll, dan folder assets ke root GitHub Pages.
9. Tunggu GitHub Pages selesai, lalu buka /build.txt dan pastikan build 2026-07-21-23.
10. Buka /backend-test.html. Respons sehat harus menunjukkan spreadsheet Nutrisme, sheet order, dan version 2026-07-21-23.
