// registrasi.js

document.addEventListener('DOMContentLoaded', function() {

    const registerForm = document.getElementById('registerForm');
    const errorMessageDiv = document.getElementById('error-message');
    const successMessageDiv = document.getElementById('success-message');
    
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    const submitButton = registerForm.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');
    const btnText = submitButton.querySelector('.btn-text');

    // Fungsi untuk toggle password visibility
    function addToggleListener(toggleBtn, inputField) {
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
                inputField.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }
    }

    addToggleListener(togglePassword, passwordInput);
    addToggleListener(toggleConfirmPassword, confirmPasswordInput);

    // Logika validasi dan submit form registrasi
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        errorMessageDiv.style.display = 'none';
        successMessageDiv.style.display = 'none';

        const namaLengkap = document.getElementById('namaLengkap').value;
        const tglLahir = document.getElementById('tglLahir').value;
        const username = document.getElementById('username').value.toLowerCase();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!namaLengkap || !tglLahir || !username || !password || !confirmPassword) {
            errorMessageDiv.textContent = 'Semua kolom wajib diisi.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessageDiv.textContent = 'Password dan Konfirmasi Password tidak cocok.';
            errorMessageDiv.style.display = 'block';
            return;
        }
        
        if (password.length < 8) {
            errorMessageDiv.textContent = 'Password minimal harus 8 karakter.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        btnText.textContent = 'Memproses...';
        spinner.style.display = 'inline-block';
        submitButton.disabled = true;

        setTimeout(() => {
            // **LOGIKA PENYIMPANAN DATA DIMULAI DI SINI**
            const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            // Validasi tambahan: Cek jika username sudah ada
            if (users.some(user => user.username === username)) {
                errorMessageDiv.textContent = 'Username sudah digunakan. Silakan pilih username lain.';
                errorMessageDiv.style.display = 'block';
                btnText.textContent = 'Registrasi';
                spinner.style.display = 'none';
                submitButton.disabled = false;
                return;
            }

            // Buat objek pengguna baru
            const newUser = {
                namaLengkap: namaLengkap,
                tglLahir: tglLahir,
                username: username,
                password: password,
                role: 'pasien'
            };

            // Tambahkan ke array dan simpan ke localStorage
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            // **LOGIKA PENYIMPANAN DATA SELESAI**

            btnText.textContent = 'Registrasi';
            spinner.style.display = 'none';
            submitButton.disabled = false;

            successMessageDiv.textContent = 'Registrasi berhasil! Anda akan diarahkan ke halaman login dalam 2 detik.';
            successMessageDiv.style.display = 'block';
            registerForm.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        }, 2000);
    });
});