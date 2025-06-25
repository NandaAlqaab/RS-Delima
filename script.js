// script.js (untuk login.html)

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const errorMessageDiv = document.getElementById('error-message');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const spinner = loginButton.querySelector('.spinner-border');
    const loginText = loginButton.querySelector('.login-text');

    // Fungsi untuk toggle password
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Logika login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        errorMessageDiv.style.display = 'none';
        loginText.textContent = 'Loading...';
        spinner.style.display = 'inline-block';
        loginButton.disabled = true;

        setTimeout(() => {
            const username = document.getElementById('username').value.toLowerCase();
            const password = document.getElementById('password').value;
            
            let destination = '';
            let loginSuccess = false;

            // **LOGIKA PEMERIKSAAN LOGIN DIMULAI DI SINI**
            
            // 1. Ambil data pengguna dari localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

            // 2. Cari pengguna yang cocok di localStorage
            const foundUser = registeredUsers.find(user => user.username === username && user.password === password);

            if (foundUser) {
                // Jika ditemukan, arahkan sesuai peran (saat ini hanya pasien)
                if (foundUser.role === 'pasien') {
                    destination = 'dashboard_pasien.html'; // Pastikan Anda punya halaman ini
                    loginSuccess = true;
                }
            } else {
                // 3. Jika tidak ditemukan, gunakan logika fallback untuk admin/dokter
                if (username.includes('dokter')) {
                    destination = 'dashboard_dokter.html'; // Pastikan Anda punya halaman ini
                    loginSuccess = true;
                } else if (username.includes('admin')) {
                    destination = 'dashboard_admin.html'; // Pastikan Anda punya halaman ini
                    loginSuccess = true;
                }
            }
            // **LOGIKA PEMERIKSAAN LOGIN SELESAI**
            
            loginText.textContent = 'Login';
            spinner.style.display = 'none';
            loginButton.disabled = false;

            if (loginSuccess) {
                window.location.href = destination;
            } else {
                errorMessageDiv.textContent = 'Username atau Password tidak valid.';
                errorMessageDiv.style.display = 'block';
            }

        }, 1500);
    });
});