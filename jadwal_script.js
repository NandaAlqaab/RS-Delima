// admin_script.js

// --- DUMMY DATA UNTUK ADMIN ---
const allDoctors = [
    { idDokter: 1, nama: "Dr. Budi Santoso" },
    { idDokter: 2, nama: "Dr. Citra Lestari" },
    { idDokter: 3, nama: "Drg. Anisa Fitri" },
    { idDokter: 4, nama: "Dr. Dian, Sp.A" }
];

// Data jadwal sama seperti sebelumnya, tapi sekarang ada idDokter
const allSchedules = [
    // Jadwal Dr. Citra Lestari (idDokter: 2)
    { idJadwal: 1, idDokter: 2, tanggal: '2025-06-23', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15, pasien: [{id:1},{id:2}] },
    { idJadwal: 2, idDokter: 2, tanggal: '2025-06-25', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15, pasien: [{id:1},{id:2},{id:3}] },
    { idJadwal: 4, idDokter: 2, tanggal: '2025-06-30', jam: '09:00 - 11:00', poli: 'Poli Umum', kuota: 15, pasien: [{id:1}] },
    
    // Jadwal Dr. Budi Santoso (idDokter: 1)
    { idJadwal: 10, idDokter: 1, tanggal: '2025-06-24', jam: '13:00 - 15:00', poli: 'Poli Umum', kuota: 10, pasien: [{id:1},{id:2},{id:3},{id:4}] },
    { idJadwal: 11, idDokter: 1, tanggal: '2025-06-26', jam: '13:00 - 15:00', poli: 'Poli Umum', kuota: 10, pasien: [] },

    // Jadwal Drg. Anisa Fitri (idDokter: 3)
     { idJadwal: 20, idDokter: 3, tanggal: '2025-06-23', jam: '10:00 - 12:00', poli: 'Poli Gigi', kuota: 5, pasien: [{id:1},{id:2},{id:3},{id:4},{id:5}] },
     { idJadwal: 21, idDokter: 3, tanggal: '2025-06-30', jam: '10:00 - 12:00', poli: 'Poli Gigi', kuota: 5, pasien: [] },
];

// --- STATE MANAGEMENT ---
let currentWeekStart = getStartOfWeek(new Date("2025-06-22"));
let selectedDoctorId = null;

// --- EVENT LISTENERS ---
window.onload = () => {
    populateDoctorSelector();
    
    document.getElementById('doctorSelector').addEventListener('change', (event) => {
        selectedDoctorId = event.target.value ? parseInt(event.target.value) : null;
        if (selectedDoctorId) {
            document.getElementById('scheduleViewContainer').style.display = 'block';
            document.getElementById('initialMessage').style.display = 'none';
            renderWeeklyView();
        } else {
            document.getElementById('scheduleViewContainer').style.display = 'none';
            document.getElementById('initialMessage').style.display = 'block';
        }
    });

    document.getElementById('prevWeekBtn').addEventListener('click', () => changeWeek(-7));
    document.getElementById('nextWeekBtn').addEventListener('click', () => changeWeek(7));
};

// --- FUNGSI-FUNGSI ---

function populateDoctorSelector() {
    const selector = document.getElementById('doctorSelector');
    let options = '<option value="">-- Pilih Dokter --</option>';
    allDoctors.forEach(doc => {
        options += `<option value="${doc.idDokter}">${doc.nama}</option>`;
    });
    selector.innerHTML = options;
}

function renderWeeklyView() {
    if (!selectedDoctorId) return;

    const container = document.getElementById('weeklyScheduleContainer');
    const weekStart = currentWeekStart;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    document.getElementById('weekRangeDisplay').innerText = 
        `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    const schedulesThisWeek = allSchedules.filter(s => {
        const scheduleDate = new Date(s.tanggal);
        return s.idDokter === selectedDoctorId && scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });

    if (schedulesThisWeek.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-secondary">Tidak ada jadwal praktek untuk dokter ini pada minggu yang dipilih.</div></div>`;
    } else {
        container.innerHTML = schedulesThisWeek.map(s => `
            <div class="col-md-6 col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${getWeekday(s.tanggal)}, ${formatDate(new Date(s.tanggal))}</h5>
                        <p class="card-text text-muted mb-2">${s.poli} | ${s.jam}</p>
                        <p><i class="fas fa-users"></i> 
                           <span class="fw-bold fs-5">${s.pasien.length}</span> / ${s.kuota} Pasien
                        </p>
                        <hr>
                        <div class="text-end">
                            <button class="btn btn-sm btn-outline-primary" onclick="editJadwal(${s.idJadwal})"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="hapusJadwal(${s.idJadwal})"><i class="fas fa-trash"></i> Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// --- Fungsi Placeholder untuk Tombol Manajemen ---
function tambahJadwalBaru() {
    if(!selectedDoctorId) {
        alert("Silakan pilih dokter terlebih dahulu!");
        return;
    }
    alert(`Membuka form untuk menambah jadwal baru untuk Dokter ID: ${selectedDoctorId}`);
}
function editJadwal(idJadwal) {
    alert(`Fungsi EDIT untuk Jadwal ID: ${idJadwal}`);
}
function hapusJadwal(idJadwal) {
    if(confirm(`Apakah Anda yakin ingin menghapus jadwal ID: ${idJadwal}?`)) {
        alert(`Jadwal ID: ${idJadwal} akan dihapus!`);
        // Di aplikasi nyata, di sini akan ada kode untuk menghapus data dan me-render ulang.
    }
}


// --- Fungsi Helper (sama seperti sebelumnya) ---
function changeWeek(days) {
    currentWeekStart.setDate(currentWeekStart.getDate() + days);
    renderWeeklyView();
}
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}
function formatDate(date) {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function getWeekday(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
}