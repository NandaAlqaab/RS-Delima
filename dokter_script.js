// dokter_script.js (VERSI MINGGUAN)

// --- DUMMY DATA YANG LEBIH LENGKAP UNTUK BEBERAPA MINGGU ---
// Struktur data diubah untuk menampung banyak jadwal
const allSchedules = [
    // Jadwal minggu lalu
    { 
        idJadwal: 10, tanggal: '2025-06-18', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15, 
        pasien: [
            { idPasien: 101, noAntrian: "A01", nama: "Budi Cahyono", status: "Selesai", riwayat: "Riwayat Budi" },
            { idPasien: 102, noAntrian: "A02", nama: "Dian Paramita", status: "Selesai", riwayat: "Riwayat Dian" }
        ]
    },
    // Jadwal minggu ini (saat ini adalah 22 Juni 2025)
    { 
        idJadwal: 1, tanggal: '2025-06-23', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15, 
        pasien: [
            { idPasien: 201, noAntrian: "B01", nama: "Ahmad Subarjo", jam: "09:00", status: "Menunggu", riwayat: "2024-12-15: Flu biasa. Terapi: Paracetamol." },
            { idPasien: 202, noAntrian: "B02", nama: "Siti Nurbaya", jam: "09:10", status: "Menunggu", riwayat: "Tidak ada riwayat kunjungan." }
        ]
    },
    { 
        idJadwal: 2, tanggal: '2025-06-25', jam: '13:00 - 15:00', poli: 'Poli Umum', kuota: 10,
        pasien: [
            { idPasien: 203, noAntrian: "C01", nama: "Joko Widodo", jam: "13:00", status: "Selesai", riwayat: "2025-01-20: Cek kolesterol. Terapi: Atorvastatin." },
            { idPasien: 204, noAntrian: "C02", nama: "Ratna Sari", jam: "13:10", status: "Menunggu", riwayat: "2024-11-05: Alergi kulit. Terapi: Cetirizine." }
        ]
    },
    // Jadwal minggu depan
    { 
        idJadwal: 4, tanggal: '2025-06-30', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15,
        pasien: [
             { idPasien: 301, noAntrian: "F01", nama: "Indra Lesmana", jam: "09:00", status: "Menunggu", riwayat: "Riwayat Indra" }
        ]
    }
];

// Inisialisasi Modal dan State (Status) Halaman
const rekamMedisModal = new bootstrap.Modal(document.getElementById('rekamMedisModal'));
// Menggunakan tanggal hari ini (22 Juni 2025) sebagai acuan
let currentWeekStart = getStartOfWeek(new Date()); 

// --- EVENT LISTENERS ---
window.onload = () => {
    renderWeeklyView(); // Memuat tampilan mingguan saat halaman dibuka
    document.getElementById('prevWeekBtn').addEventListener('click', () => changeWeek(-7));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(7));
    document.getElementById('backToWeeklyViewBtn').addEventListener('click', showWeeklyView);
};

// --- FUNGSI UTAMA ---

// Menampilkan kartu-kartu jadwal untuk satu minggu
function renderWeeklyView() {
    const container = document.getElementById('weeklyScheduleContainer');
    const weekStart = currentWeekStart;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    document.getElementById('weekRangeDisplay').innerText = 
        `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    const schedulesThisWeek = allSchedules.filter(s => {
        const scheduleDate = new Date(s.tanggal);
        return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });

    if (schedulesThisWeek.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info text-center">Tidak ada jadwal praktek untuk minggu ini.</div></div>`;
        return;
    }

    container.innerHTML = schedulesThisWeek.map(s => `
        <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm schedule-card" onclick="showDailyPatientList(${s.idJadwal})">
                <div class="card-body">
                    <h5 class="card-title">${getWeekday(s.tanggal)}, ${formatDate(new Date(s.tanggal))}</h5>
                    <p class="card-text text-muted mb-2">${s.poli} | ${s.jam}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-users"></i>
                            <span class="fw-bold fs-5">${s.pasien.length}</span> / ${s.kuota} Pasien
                        </div>
                        <span class="text-primary">Lihat Detail <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Menampilkan daftar pasien untuk jadwal yang dipilih
function showDailyPatientList(idJadwal) {
    const schedule = allSchedules.find(s => s.idJadwal === idJadwal);
    if (!schedule) return;
    
    document.getElementById('patientListContainer').dataset.currentJadwalId = idJadwal;
    document.getElementById('dailyListHeader').innerText = `Daftar Pasien - ${getWeekday(schedule.tanggal)}, ${formatDate(new Date(schedule.tanggal))}`;
    
    const container = document.getElementById('patientListContainer');
    if (schedule.pasien.length === 0) {
        container.innerHTML = `<div class="alert alert-secondary text-center">Belum ada pasien terdaftar untuk jadwal ini.</div>`;
    } else {
        const tableRows = schedule.pasien.map(p => `
            <tr>
                <td><strong>${p.noAntrian}</strong></td>
                <td>${p.nama}</td>
                <td>${p.jam}</td>
                <td><span class="status status-${p.status.toLowerCase()}">${p.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="openRekamMedisModal(${p.idPasien})">
                        <i class="fas fa-stethoscope"></i> Periksa
                    </button>
                </td>
            </tr>`).join('');

        container.innerHTML = `
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr><th>Antrian</th><th>Nama Pasien</th><th>Estimasi Jam</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>`;
    }

    // Ganti tampilan dari mingguan ke harian
    document.getElementById('weeklyScheduleView').style.display = 'none';
    document.getElementById('dailyPatientListView').style.display = 'block';
}

// Kembali ke tampilan jadwal mingguan
function showWeeklyView() {
    document.getElementById('dailyPatientListView').style.display = 'none';
    document.getElementById('weeklyScheduleView').style.display = 'block';
}

// Fungsi untuk membuka modal, sekarang mencari pasien dari data yang lebih kompleks
function openRekamMedisModal(idPasien) {
    const idJadwal = document.getElementById('patientListContainer').dataset.currentJadwalId;
    const schedule = allSchedules.find(s => s.idJadwal == idJadwal);
    const pasien = schedule.pasien.find(p => p.idPasien === idPasien);
    if (!pasien) return;
    
    document.getElementById('namaPasienModal').innerText = pasien.nama;
    document.getElementById('riwayatPasienModal').innerText = pasien.riwayat;
    document.getElementById('pasienIdInput').value = pasien.idPasien;
    document.getElementById('formRekamMedis').reset();
    rekamMedisModal.show();
}

// Fungsi menyimpan rekam medis, sekarang mengupdate data yang lebih kompleks
function simpanRekamMedis() {
    const idPasien = document.getElementById('pasienIdInput').value;
    const idJadwal = document.getElementById('patientListContainer').dataset.currentJadwalId;

    const schedule = allSchedules.find(s => s.idJadwal == idJadwal);
    const pasien = schedule.pasien.find(p => p.idPasien == idPasien);

    if (pasien) {
        pasien.status = "Selesai";
    }
    
    rekamMedisModal.hide();
    showDailyPatientList(parseInt(idJadwal)); // Muat ulang tabel harian
    renderWeeklyView(); // Muat ulang kartu mingguan untuk update jumlah pasien
}


// --- FUNGSI BANTUAN (HELPERS) UNTUK TANGGAL ---
function changeWeek(days) {
    currentWeekStart.setDate(currentWeekStart.getDate() + days);
    renderWeeklyView();
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Minggu) - 6 (Sabtu)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Mulai dari Senin
    return new Date(d.setDate(diff));
}

function formatDate(date) {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getWeekday(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
}