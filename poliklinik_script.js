// poliklinik_script.js

// Gunakan 'let' karena data akan dimodifikasi (tambah, hapus, edit)
let allPoliklinik = [
    { idPoli: 1, nama: "Poli Umum" },
    { idPoli: 2, nama: "Poli Gigi" },
    { idPoli: 3, nama: "Poli Anak" },
    { idPoli: 4, nama: "Poli THT" }
];

const poliModal = new bootstrap.Modal(document.getElementById('poliModal'));

window.onload = () => {
    renderTable();
};

function renderTable() {
    const container = document.getElementById('poliklinikTableContainer');
    const tableRows = allPoliklinik.map(poli => `
        <tr>
            <td>${poli.idPoli}</td>
            <td>${poli.nama}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-primary" onclick="openPoliModal(${poli.idPoli})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePoliklinik(${poli.idPoli})"><i class="fas fa-trash"></i> Hapus</button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table class="table table-hover table-bordered">
            <thead class="table-dark">
                <tr><th>ID</th><th>Nama Poliklinik</th><th class="text-end">Aksi</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}

function openPoliModal(idPoli = null) {
    const form = document.getElementById('poliForm');
    form.reset();
    document.getElementById('poliIdInput').value = '';

    if (idPoli) { // Mode Edit
        const poli = allPoliklinik.find(p => p.idPoli === idPoli);
        document.getElementById('poliModalLabel').innerText = "Edit Poliklinik";
        document.getElementById('poliIdInput').value = poli.idPoli;
        document.getElementById('namaPoliInput').value = poli.nama;
    } else { // Mode Tambah Baru
        document.getElementById('poliModalLabel').innerText = "Tambah Poliklinik Baru";
    }
    poliModal.show();
}

function savePoliklinik() {
    const id = document.getElementById('poliIdInput').value;
    const nama = document.getElementById('namaPoliInput').value.trim();

    if (!nama) {
        alert("Nama Poliklinik tidak boleh kosong!");
        return;
    }

    if (id) { // Update data yang ada
        const index = allPoliklinik.findIndex(p => p.idPoli == id);
        allPoliklinik[index].nama = nama;
    } else { // Tambah data baru
        const newId = allPoliklinik.length > 0 ? Math.max(...allPoliklinik.map(p => p.idPoli)) + 1 : 1;
        allPoliklinik.push({ idPoli: newId, nama: nama });
    }

    poliModal.hide();
    renderTable(); // Tampilkan ulang tabel dengan data terbaru
}

function deletePoliklinik(idPoli) {
    if (confirm(`Apakah Anda yakin ingin menghapus poliklinik ini?`)) {
        allPoliklinik = allPoliklinik.filter(p => p.idPoli !== idPoli);
        renderTable();
    }
}