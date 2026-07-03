// ============================
// 1. PENGATURAN TEMA (Jalan paling awal agar tidak berkedip)
// ============================
(function() {
    try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch (e) { /* localStorage tidak tersedia, gunakan mode terang default */ }
})();

// ============================
// 2. FUNGSI GLOBAL (Bisa diakses langsung oleh tombol HTML)
// ============================
let isPlaying = false;

function setToggleIcon() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggleBtn.innerText = isDark ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    }
    setToggleIcon();
}

function bukaUndangan() {
    document.getElementById('cover').style.transform = 'translateY(-100vh)';
    document.getElementById('main-content').style.display = 'block';
    const musicBtn = document.getElementById('music-btn');
    const music = document.getElementById('bg-music');
    musicBtn.style.display = 'block';
    music.play();
    isPlaying = true;
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    if (isPlaying) {
        music.pause();
        musicBtn.innerText = '🔇';
    } else {
        music.play();
        musicBtn.innerText = '🎵';
    }
    isPlaying = !isPlaying;
}

function salinRekening() {
    const norek = document.getElementById('norek').innerText;
    navigator.clipboard.writeText(norek).then(() => {
        alert('Nomor rekening berhasil disalin!');
    });
}

// ============================
// 3. LOGIKA SETELAH HTML DIMUAT (DOM Content Loaded)
// ============================
document.addEventListener('DOMContentLoaded', function() {
    
    // Fitur Nama Tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    if (to && document.getElementById('guest-name')) {
        document.getElementById('guest-name').innerText = to.replace(/\+/g, ' ');
    }

    // Set ikon yang benar saat halaman pertama kali dimuat
    setToggleIcon();

    // Penghitung Mundur (Countdown)
    const targetDate = new Date("Dec 31, 2027 08:00:00").getTime();
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                document.getElementById("hari").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
                document.getElementById("jam").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                document.getElementById("menit").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                document.getElementById("detik").innerText = Math.floor((distance % (1000 * 60)) / 1000);
            } else {
                countdownEl.innerHTML = "<h3>Acara Sedang Berlangsung!</h3>";
            }
        }, 1000);
    }

    // Animasi Scroll (Scroll Reveal menggunakan Intersection Observer)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Formulir RSVP 
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const btn = this.querySelector('button');
            btn.innerText = 'Mengirim...';
            
            const scriptURL = 'URL_GOOGLE_APPS_SCRIPT_ANDA_DISINI'; 
            
            setTimeout(() => {
                alert('Terima kasih! RSVP Anda telah terkirim.');
                this.reset();
                btn.innerText = 'Kirim RSVP';
            }, 1000);
        });
    }
});