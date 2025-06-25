// kelola_dokter_script.js

// Data dummy (gunakan 'let' agar bisa dimodifikasi)
let allDoctors = [
    { idDokter: 1, nama: "Dr. Budi Santoso", spesialisasi: "Dokter Umum", idPoli: 1 },
    { idDokter: 2, nama: "Dr. Citra Lestari", spesialisasi: "Dokter Umum", idPoli: 1 },
    { idDokter: 3, nama: "Drg. Anisa Fitri", spesialisasi: "Dokter Gigi", idPoli: 2 },
    { idDokter: 4, nama: "Dr. Dian, Sp.A", spesialisasi: "Spesialis Anak", idPoli: 3 }
];
// Data poliklinik dibutuhkan untuk dropdown di form
const allPoliklinik = [
    { idPoli: 1, nama: "Poli Umum" }, { idPoli: 2, nama: "Poli Gigi" },
    { idPoli: 3, nama: "Poli Anak" }, { idPoli: 4, nama: "Poli THT" }
];

const doctorModal = new bootstrap.Modal(document.getElementById('doctorModal'));

window.onload = () => { renderTable(); };

function renderTable() {
    const container = document.getElementById('doctorTableContainer');
    const tableRows = allDoctors.map(doc => {
        const poli = allPoliklinik.find(p => p.idPoli === doc.idPoli);
        return `
        <tr>
            <td>${doc.idDokter}</td>
            <td>${doc.nama}</td>
            <td>${doc.spesialisasi}</td>
            <td>${poli ? poli.nama : 'N/A'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-primary" onclick="openDoctorModal(${doc.idDokter})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${doc.idDokter})"><i class="fas fa-trash"></i> Hapus</button>
            </td>
        </tr>`
    }).join('');

    container.innerHTML = `
        <table class="table table-hover table-bordered">
            <thead class="table-dark">
                <tr><th>ID</th><th>Nama Dokter</th><th>Spesialisasi</th><th>Poliklinik</th><th class="text-end">Aksi</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>`;
}

function populatePoliSelect() {
    const selector = document.getElementById('poliSelect');
    selector.innerHTML = allPoliklinik.map(p => `<option value="${p.idPoli}">${p.nama}</option>`).join('');
}

function openDoctorModal(idDokter = null) {
    const form = document.getElementById('doctorForm');
    form.reset();
    document.getElementById('doctorIdInput').value = '';
    populatePoliSelect(); // Isi dropdown poliklinik setiap kali modal dibuka

    if (idDokter) { // Mode Edit
        const doc = allDoctors.find(d => d.idDokter === idDokter);
        document.getElementById('doctorModalLabel').innerText = "Edit Dokter";
        document.getElementById('doctorIdInput').value = doc.idDokter;
        document.getElementById('namaDokterInput').value = doc.nama;
        document.getElementById('spesialisasiInput').value = doc.spesialisasi;
        document.getElementById('poliSelect').value = doc.idPoli;
    } else { // Mode Tambah
        document.getElementById('doctorModalLabel').innerText = "Tambah Dokter Baru";
    }
    doctorModal.show();
}

function saveDoctor() {
    const id = document.getElementById('doctorIdInput').value;
    const nama = document.getElementById('namaDokterInput').value.trim();
    const spesialisasi = document.getElementById('spesialisasiInput').value.trim();
    const idPoli = parseInt(document.getElementById('poliSelect').value);

    if (!nama || !spesialisasi) {
        alert("Nama dan Spesialisasi tidak boleh kosong!");
        return;
    }

    if (id) { // Update
        const index = allDoctors.findIndex(d => d.idDokter == id);
        allDoctors[index] = { ...allDoctors[index], nama, spesialisasi, idPoli };
    } else { // Tambah
        const newId = allDoctors.length > 0 ? Math.max(...allDoctors.map(d => d.idDokter)) + 1 : 1;
        allDoctors.push({ idDokter: newId, nama, spesialisasi, idPoli });
    }

    doctorModal.hide();
    renderTable();
}

function deleteDoctor(idDokter) {
    if (confirm(`Apakah Anda yakin ingin menghapus data dokter ini?`)) {
        allDoctors = allDoctors.filter(d => d.idDokter !== idDokter);
        renderTable();
    }
}