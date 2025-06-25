// dashboard_script.js

// --- DUMMY DATA ---
// Kita butuh semua data ini untuk menghasilkan statistik
const allDoctors = [ { idDokter: 1, nama: "Dr. Budi Santoso" }, { idDokter: 2, nama: "Dr. Citra Lestari" }, { idDokter: 3, nama: "Drg. Anisa Fitri" }, { idDokter: 4, nama: "Dr. Dian, Sp.A" }];
const allPoliklinik = [ { idPoli: 1, nama: "Poli Umum" }, { idPoli: 2, nama: "Poli Gigi" }, { idPoli: 3, nama: "Poli Anak" }, { idPoli: 4, nama: "Poli THT" }];
const allSchedules = [ { idJadwal: 1, idDokter: 2, tanggal: '2025-06-23', jam: '09:00 - 11:00', poli: 'Poli Umum', pasien: [{},{}] }, { idJadwal: 2, idDokter: 2, tanggal: '2025-06-25', jam: '09:00 - 11:00', poli: 'Poli Umum', pasien: [{},{},{}] }, { idJadwal: 4, idDokter: 2, tanggal: '2025-06-30', jam: '09:00 - 11:00', poli: 'Poli Umum', pasien: [{}] }, { idJadwal: 10, idDokter: 1, tanggal: '2025-06-24', jam: '13:00 - 15:00', poli: 'Poli Umum', pasien: [{},{},{},{}] }, { idJadwal: 11, idDokter: 1, tanggal: '2025-06-26', jam: '13:00 - 15:00', poli: 'Poli Umum', pasien: [] }, { idJadwal: 20, idDokter: 3, tanggal: '2025-06-23', jam: '10:00 - 12:00', poli: 'Poli Gigi', pasien: [{},{},{},{},{}] }, { idJadwal: 21, idDokter: 3, tanggal: '2025-06-30', jam: '10:00 - 12:00', poli: 'Poli Gigi', pasien: [] } ];
const totalPasien = 50; // Angka dummy untuk total pasien terdaftar

// --- EVENT LISTENERS ---
window.onload = () => {
    loadStats();
    renderTodaySchedule();
    renderVisitChart();
};

// --- FUNGSI-FUNGSI ---

function loadStats() {
    document.getElementById('jumlahDokter').innerText = allDoctors.length;
    document.getElementById('jumlahPoli').innerText = allPoliklinik.length;
    document.getElementById('pasienTerdaftar').innerText = totalPasien;

    // Hitung kunjungan hari ini (simulasi: tanggal 23 Juni 2025)
    const todayStr = '2025-06-23';
    const todayVisits = allSchedules
        .filter(s => s.tanggal === todayStr)
        .reduce((sum, s) => sum + s.pasien.length, 0);
    document.getElementById('kunjunganHariIni').innerText = todayVisits;
}

function renderTodaySchedule() {
    const todayStr = '2025-06-23';
    const container = document.getElementById('todayScheduleContainer');
    const todaySchedules = allSchedules.filter(s => s.tanggal === todayStr);

    if (todaySchedules.length === 0) {
        container.innerHTML = '<div class="text-center text-muted">Tidak ada jadwal dokter hari ini.</div>';
        return;
    }

    container.innerHTML = `
        <ul class="list-group list-group-flush">
            ${todaySchedules.map(s => {
                const doc = allDoctors.find(d => d.idDokter === s.idDokter);
                return `<li class="list-group-item">
                            <strong>${doc.nama}</strong><br>
                            <small class="text-muted">${s.poli} | ${s.jam}</small>
                        </li>`;
            }).join('')}
        </ul>`;
}

function renderVisitChart() {
    const ctx = document.getElementById('visitChart').getContext('2d');
    const labels = [];
    const dataPoints = [];

    // Simulasi data untuk 7 hari terakhir
    for (let i = 6; i >= 0; i--) {
        const date = new Date('2025-06-23');
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }));
        
        const visitsOnDate = allSchedules
            .filter(s => s.tanggal === dateStr)
            .reduce((sum, s) => sum + s.pasien.length, 0);
        // Tambahkan sedikit random agar grafik tidak datar
        dataPoints.push(visitsOnDate + Math.floor(Math.random() * 3));
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Kunjungan',
                data: dataPoints,
                backgroundColor: 'rgba(23, 162, 184, 0.6)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

// dashboard_admin_script.js

document.addEventListener('DOMContentLoaded', function() {
    // Data untuk grafik (diambil dari screenshot Anda)
    const visitLabels = ['Sen, 17', 'Sel, 18', 'Rab, 19', 'Kam, 20', 'Jum, 21', 'Sab, 22', 'Min, 23'];
    const visitData = [1, 2, 0, 1, 1, 1, 8];

    const ctx = document.getElementById('visitChart').getContext('2d');
    const visitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: visitLabels,
            datasets: [{
                label: 'Jumlah Kunjungan',
                data: visitData,
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(78, 115, 223, 0.4)',
                hoverBorderColor: 'rgba(78, 115, 223, 1)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Memastikan angka pada sumbu Y adalah bilangan bulat
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Sembunyikan legenda
                }
            }
        }
    });

    // Anda bisa menambahkan logika lain di sini, misalnya mengambil data dari localStorage
    // untuk mengisi kartu statistik secara dinamis.
});