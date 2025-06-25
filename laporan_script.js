// laporan_script.js

// --- DUMMY DATA LENGKAP UNTUK LAPORAN ---
const allDoctors = [
    { idDokter: 1, nama: "Dr. Budi Santoso" },
    { idDokter: 2, nama: "Dr. Citra Lestari" },
    { idDokter: 3, nama: "Drg. Anisa Fitri" },
    { idDokter: 4, nama: "Dr. Dian, Sp.A" }
];

const allPoliklinik = [
    { idPoli: 1, nama: "Poli Umum" },
    { idPoli: 2, nama: "Poli Gigi" },
    { idPoli: 3, nama: "Poli Anak" }
];

// Data ini mensimulasikan kunjungan yang sudah selesai dan memiliki rekam medis
const completedVisits = [
    { tanggal: '2025-06-16', namaPasien: 'Ananda Putri', poli: 'Poli Anak', dokter: 'Dr. Dian, Sp.A', diagnosis: 'Demam, Batuk Pilek' },
    { tanggal: '2025-06-18', namaPasien: 'Rahmat Hidayat', poli: 'Poli Umum', dokter: 'Dr. Budi Santoso', diagnosis: 'Hipertensi' },
    { tanggal: '2025-06-23', namaPasien: 'Budi Cahyono', poli: 'Poli Umum', dokter: 'Dr. Citra Lestari', diagnosis: 'Sakit Kepala Migrain' },
    { tanggal: '2025-06-23', namaPasien: 'Siti Zubaidah', poli: 'Poli Gigi', dokter: 'Drg. Anisa Fitri', diagnosis: 'Gingivitis' },
    { tanggal: '2025-06-24', namaPasien: 'Joko Susilo', poli: 'Poli Umum', dokter: 'Dr. Budi Santoso', diagnosis: 'Asam Lambung (GERD)' },
    { tanggal: '2025-06-25', namaPasien: 'Dian Paramita', poli: 'Poli Umum', dokter: 'Dr. Citra Lestari', diagnosis: 'Kelelahan Kronis' },
    { tanggal: '2025-06-26', namaPasien: 'Ahmad Kurnia', poli: 'Poli Umum', dokter: 'Dr. Budi Santoso', diagnosis: 'Infeksi Saluran Pernapasan Atas' },
    { tanggal: '2025-06-27', namaPasien: 'Putri Ayu', poli: 'Poli Anak', dokter: 'Dr. Dian, Sp.A', diagnosis: 'Vaksinasi DPT' },
];

// Variabel untuk menyimpan hasil filter terakhir (untuk export)
let lastFilteredResults = [];

// --- EVENT LISTENERS & INITIALIZATION ---
window.onload = () => {
    populateFilters();
    document.getElementById('reportForm').addEventListener('submit', generateReport);
};

// --- FUNGSI-FUNGSI UTAMA ---

function populateFilters() {
    const poliSelector = document.getElementById('poliFilter');
    let poliOptions = '<option value="">Semua Poliklinik</option>';
    allPoliklinik.forEach(p => {
        poliOptions += `<option value="${p.nama}">${p.nama}</option>`;
    });
    poliSelector.innerHTML = poliOptions;

    const doctorSelector = document.getElementById('doctorFilter');
    let doctorOptions = '<option value="">Semua Dokter</option>';
    allDoctors.forEach(d => {
        doctorOptions += `<option value="${d.nama}">${d.nama}</option>`;
    });
    doctorSelector.innerHTML = doctorOptions;
}

function generateReport(event) {
    event.preventDefault(); // Mencegah form submit dan refresh halaman
    
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const selectedPoli = document.getElementById('poliFilter').value;
    const selectedDoctor = document.getElementById('doctorFilter').value;

    // Filter data
    lastFilteredResults = completedVisits.filter(visit => {
        const visitDate = new Date(visit.tanggal);
        const isDateInRange = visitDate >= startDate && visitDate <= endDate;
        const isPoliMatch = !selectedPoli || visit.poli === selectedPoli;
        const isDoctorMatch = !selectedDoctor || visit.dokter === selectedDoctor;
        return isDateInRange && isPoliMatch && isDoctorMatch;
    });

    renderReportTable(lastFilteredResults, startDate, endDate);
}

function renderReportTable(data, startDate, endDate) {
    const container = document.getElementById('reportResultContainer');
    const startStr = startDate.toLocaleDateString('id-ID');
    const endStr = endDate.toLocaleDateString('id-ID');

    if (data.length === 0) {
        container.innerHTML = `<div class="alert alert-warning">Tidak ada data kunjungan yang ditemukan untuk filter yang dipilih.</div>`;
        return;
    }

    const tableRows = data.map(visit => `
        <tr>
            <td>${new Date(visit.tanggal).toLocaleDateString('id-ID')}</td>
            <td>${visit.namaPasien}</td>
            <td>${visit.poli}</td>
            <td>${visit.dokter}</td>
            <td>${visit.diagnosis}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Hasil Laporan (${data.length} Kunjungan)</h5>
                <div class="no-print">
                    <button class="btn btn-sm btn-outline-secondary" onclick="printReport()"><i class="fas fa-print"></i> Cetak Laporan</button>
                    <button class="btn btn-sm btn-outline-success" onclick="exportToCSV()"><i class="fas fa-file-csv"></i> Export ke CSV</button>
                </div>
            </div>
            <div class="card-body">
                <p><strong>Periode Laporan:</strong> ${startStr} - ${endStr}</p>
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Tanggal</th>
                                <th>Nama Pasien</th>
                                <th>Poliklinik</th>
                                <th>Dokter</th>
                                <th>Diagnosis</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function printReport() {
    window.print();
}

function exportToCSV() {
    if (lastFilteredResults.length === 0) {
        alert("Tidak ada data untuk di-export.");
        return;
    }

    const headers = ['Tanggal', 'Nama Pasien', 'Poliklinik', 'Dokter', 'Diagnosis'];
    const csvRows = [headers.join(',')]; // Header CSV

    lastFilteredResults.forEach(row => {
        const values = [
            row.tanggal,
            `"${row.namaPasien.replace(/"/g, '""')}"`, // Handle koma di nama
            `"${row.poli}"`,
            `"${row.dokter}"`,
            `"${row.diagnosis.replace(/"/g, '""')}"` // Handle koma di diagnosis
        ];
        csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'laporan_kunjungan.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}