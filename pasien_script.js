// script.js

// --- DUMMY DATA (Simulasi Database) ---
const poliklinik = [
    { id: 1, nama: "Poli Umum" },
    { id: 2, nama: "Poli Gigi" },
    { id: 3, nama: "Poli Anak" }
];

const jadwalDokter = [
    { idJadwal: 101, idDokter: 1, namaDokter: "Dr. Budi Santoso", idPoli: 1, tanggal: "2025-06-23", jam: "09:00 - 11:00", kuota: 20, sisa: 5 },
    { idJadwal: 102, idDokter: 2, namaDokter: "Dr. Citra Lestari", idPoli: 1, tanggal: "2025-06-23", jam: "13:00 - 15:00", kuota: 20, sisa: 2 },
    { idJadwal: 201, idDokter: 3, namaDokter: "Drg. Anisa Fitri", idPoli: 2, tanggal: "2025-06-23", jam: "10:00 - 12:00", kuota: 20, sisa: 0 },
    { idJadwal: 301, idDokter: 4, namaDokter: "Dr. Dian, Sp.A", idPoli: 3, tanggal: "2025-06-24", jam: "09:00 - 12:00", kuota: 20, sisa: 10 },
];

const riwayatPasien = [
    { id: 1, dokter: "Dr. Budi Santoso", poli: "Poli Umum", tanggal: "2025-05-10", status: "Selesai" },
    { id: 2, dokter: "Drg. Anisa Fitri", poli: "Poli Gigi", tanggal: "2025-04-22", status: "Selesai" },
    { id: 3, dokter: "Dr. Dian, Sp.A", poli: "Poli Anak", tanggal: "2025-06-24", status: "Dijadwalkan" },
];

const dynamicContent = document.getElementById('dynamicContent');
let konfirmasiModal;
if (document.getElementById('konfirmasiModal')) {
    konfirmasiModal = new bootstrap.Modal(document.getElementById('konfirmasiModal'));
}
let jadwalTerpilih = null;


// --- FUNGSI UNTUK MENAMPILKAN KONTEN ---

// 1. Menampilkan Form Buat Perjanjian
function showBuatPerjanjian() {
    let poliOptions = poliklinik.map(p => `<option value="${p.id}">${p.nama}</option>`).join('');

    dynamicContent.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header">
                <h5 class="mb-0">Langkah 1: Cari Jadwal Dokter</h5>
            </div>
            <div class="card-body">
                <form id="cariJadwalForm">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-5">
                            <label for="pilihPoli" class="form-label">Pilih Poliklinik</label>
                            <select id="pilihPoli" class="form-select">${poliOptions}</select>
                        </div>
                        <div class="col-md-5">
                            <label for="pilihTanggal" class="form-label">Pilih Tanggal</label>
                            <input type="date" id="pilihTanggal" class="form-control" value="2025-06-23">
                        </div>
                        <div class="col-md-2">
                             <button type="submit" class="btn btn-primary w-100">Cari Jadwal</button>
                        </div>
                    </div>
                </form>
                <div id="hasilJadwal" class="mt-4"></div>
            </div>
        </div>
    `;

    document.getElementById('cariJadwalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const idPoli = document.getElementById('pilihPoli').value;
        const tanggal = document.getElementById('pilihTanggal').value;
        cariJadwal(idPoli, tanggal);
    });
}

// 2. Mencari dan Menampilkan Jadwal yang Tersedia (sesuai Activity Diagram)
function cariJadwal(idPoli, tanggal) {
    const hasil = jadwalDokter.filter(j => j.idPoli == idPoli && j.tanggal == tanggal);
    const hasilJadwalDiv = document.getElementById('hasilJadwal');

    if (hasil.length === 0) {
        hasilJadwalDiv.innerHTML = `<div class="alert alert-warning">Tidak ada jadwal yang tersedia untuk poliklinik dan tanggal yang dipilih.</div>`;
        return;
    }

    let tableRows = hasil.map(j => `
        <tr>
            <td>${j.namaDokter}</td>
            <td>${j.jam}</td>
            <td><span class="badge bg-secondary">${j.sisa} / ${j.kuota}</span></td>
            <td>
                ${j.sisa > 0 
                    ? `<button class="btn btn-sm btn-success" onclick="pilihJadwal(${j.idJadwal})">Pilih</button>`
                    : `<button class="btn btn-sm btn-danger" disabled>Kuota Penuh</button>`
                }
            </td>
        </tr>
    `).join('');

    hasilJadwalDiv.innerHTML = `
        <h5 class="mb-3">Langkah 2: Pilih Jadwal Tersedia</h5>
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Nama Dokter</th>
                        <th>Jam Praktek</th>
                        <th>Sisa Kuota</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;
}

// 3. Pasien Memilih Jadwal -> Tampilkan Konfirmasi (sesuai Sequence Diagram)
function pilihJadwal(idJadwal) {
    // Controller -> Cek Kuota (simulasi)
    jadwalTerpilih = jadwalDokter.find(j => j.idJadwal === idJadwal);

    if (jadwalTerpilih && jadwalTerpilih.sisa > 0) {
        // Tampilkan halaman konfirmasi (dalam bentuk modal)
        document.getElementById('modalDokter').innerText = jadwalTerpilih.namaDokter;
        document.getElementById('modalPoli').innerText = poliklinik.find(p => p.id === jadwalTerpilih.idPoli).nama;
        document.getElementById('modalTanggal').innerText = jadwalTerpilih.tanggal;
        document.getElementById('modalJam').innerText = jadwalTerpilih.jam;
        konfirmasiModal.show();
    } else {
        alert("Maaf, kuota untuk jadwal ini baru saja habis.");
        // Refresh tampilan jadwal
        document.getElementById('cariJadwalForm').dispatchEvent(new Event('submit'));
    }
}

// 4. Pasien Konfirmasi -> Simpan Data & Tampilkan Bukti (sesuai Activity Diagram)
function submitPerjanjian() {
    // Controller -> Create Perjanjian & Update Kuota (simulasi)
    jadwalTerpilih.sisa--;
    
    // Hasilkan nomor antrian (simulasi)
    const nomorAntrian = `A${Math.floor(Math.random() * 100) + 1}`;
    
    konfirmasiModal.hide();
    
    dynamicContent.innerHTML = `
        <div class="card shadow-sm text-center">
             <div class="card-header bg-success text-white">
                <h5 class="mb-0">Perjanjian Berhasil Dibuat!</h5>
            </div>
            <div class="card-body p-4">
                <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                <p>Berikut adalah detail bukti perjanjian Anda:</p>
                <ul class="list-group list-group-flush mx-auto" style="max-width: 400px;">
                    <li class="list-group-item"><strong>Nomor Antrian:</strong> <span class="fs-4 fw-bold">${nomorAntrian}</span></li>
                    <li class="list-group-item"><strong>Dokter:</strong> ${jadwalTerpilih.namaDokter}</li>
                    <li class="list-group-item"><strong>Poliklinik:</strong> ${poliklinik.find(p => p.id === jadwalTerpilih.idPoli).nama}</li>
                    <li class="list-group-item"><strong>Tanggal:</strong> ${jadwalTerpilih.tanggal}</li>
                    <li class="list-group-item"><strong>Estimasi Jam:</strong> ${jadwalTerpilih.jam}</li>
                </ul>
                <p class="mt-3 text-muted">Harap datang 15 menit lebih awal. Terima kasih.</p>
                <button class="btn btn-primary mt-2" onclick="showBuatPerjanjian()">Buat Perjanjian Lain</button>
            </div>
        </div>
    `;
}

// 5. Menampilkan Riwayat Perjanjian
function showRiwayat() {
    let tableRows = riwayatPasien.map(r => `
        <tr>
            <td>${r.tanggal}</td>
            <td>${r.poli}</td>
            <td>${r.dokter}</td>
            <td><span class="status status-${r.status.toLowerCase()}">${r.status}</span></td>
            <td>
                 ${r.status === 'Dijadwalkan' ? '<button class="btn btn-sm btn-outline-danger">Batalkan</button>' : '-'}
            </td>
        </tr>
    `).join('');

    dynamicContent.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header">
                <h5 class="mb-0">Riwayat Janji Temu</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Poliklinik</th>
                                <th>Dokter</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}





