// ============================================================
//  Nutrisme — Google Apps Script
//  Salin seluruh kode ini ke Google Apps Script
//  Tools > Script editor (dari Google Sheets)
// ============================================================

// ID spreadsheet kamu — ambil dari URL spreadsheet
// Contoh URL: https://docs.google.com/spreadsheets/d/XXXXX/edit
// Bagian XXXXX itulah yang kamu tempel di bawah
var SPREADSHEET_ID = "1qy4hSkdrHZZXTSdwcZJNLyu-ffRtQiXA58PmHHaNqhc";

// Email yang akan menerima notifikasi setiap ada pesanan masuk
var EMAIL_NOTIFIKASI = "nutrismeindonesia@gmail.com";

// Nama sheet (tab) di dalam spreadsheet
var NAMA_SHEET = "Pesanan";

// ─────────────────────────────────────────────────────────────
//  Fungsi utama — dipanggil otomatis setiap form di-submit
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    // 1. Ambil data yang dikirim dari website
    var data = JSON.parse(e.postData.contents);

    // 2. Buka spreadsheet dan sheet yang dituju
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(NAMA_SHEET);

    // 3. Kalau sheet belum ada, buat baru dan tambahkan header
    if (!sheet) {
      sheet = spreadsheet.insertSheet(NAMA_SHEET);
      sheet.appendRow(["No", "Waktu", "Nama Lengkap", "Alamat", "No. Handphone"]);

      // Format baris header agar terlihat rapi
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setBackground("#0d5b48");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1); // Header tetap terlihat saat scroll ke bawah
    }

    // 4. Hitung nomor urut pesanan
    var nomorUrut = sheet.getLastRow(); // Baris 1 = header, jadi baris 2 = pesanan ke-1

    // 5. Masukkan data ke baris baru
    sheet.appendRow([
      nomorUrut,           // Nomor urut
      data.waktu,          // Waktu pesanan
      data.nama,           // Nama lengkap
      data.alamat,         // Alamat
      "+62" + data.telepon // Nomor HP dengan kode negara
    ]);

    // 6. Rapikan lebar kolom secara otomatis
    sheet.autoResizeColumns(1, 5);

    // 7. Kirim notifikasi email
    kirimNotifikasiEmail(data, nomorUrut);

    // 8. Kirim respons sukses ke website
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Jika ada error, catat di log dan kirim respons gagal
    Logger.log("Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", pesan: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────
//  Fungsi kirim notifikasi email
// ─────────────────────────────────────────────────────────────
function kirimNotifikasiEmail(data, nomorUrut) {
  var subjek = "🛒 Pesanan Baru #" + nomorUrut + " — " + data.nama;

  var isi =
    "Halo Tim Nutrisme,\n\n" +
    "Ada pesanan baru masuk! Berikut detailnya:\n\n" +
    "──────────────────────────\n" +
    "No. Pesanan  : #" + nomorUrut + "\n" +
    "Waktu        : " + data.waktu + "\n" +
    "Nama         : " + data.nama + "\n" +
    "Alamat       : " + data.alamat + "\n" +
    "No. HP       : +62" + data.telepon + "\n" +
    "──────────────────────────\n\n" +
    "Silakan tindak lanjuti segera.\n\n" +
    "— Sistem Nutrisme";

  MailApp.sendEmail(EMAIL_NOTIFIKASI, subjek, isi);
}

// ─────────────────────────────────────────────────────────────
//  Fungsi tes — jalankan ini dulu untuk cek apakah script bekerja
//  Klik tombol Run di Apps Script untuk menjalankan fungsi ini
// ─────────────────────────────────────────────────────────────
function tesKoneksi() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log("Berhasil terhubung ke spreadsheet: " + spreadsheet.getName());
  Logger.log("Script siap digunakan!");
}
