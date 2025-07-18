function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    var data = JSON.parse(e.postData.contents);

    var kodeReservasi = "RSV-" + new Date().getTime();

    sheet.appendRow([
      data.nama,         // Nama
      data.tanggal,      // Tanggal
      data.waktu,        // Waktu
      data.email,        // Email
      data.telepon,      // Telepon
      data.jumlah,       // Jumlah Orang
      kodeReservasi,     // Kode Reservasi
      ""                 // Status (biarkan kosong dulu)
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", reservationCode: kodeReservasi })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
