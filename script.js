// Tema biru malam ditetapkan langsung melalui CSS.
let isPlaying = false;

function bukaUndangan() {
    if (document.body.classList.contains('invitation-open')) return;

    const cover = document.getElementById('cover');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('invitation-opening');
    document.body.classList.add('invitation-open');
    cover.inert = true;
    document.getElementById('beranda').focus({ preventScroll: true });
    const finishOpening = () => {
        document.body.classList.remove('invitation-opening');
        cover.removeEventListener('transitionend', onCoverTransitionEnd);
    };
    const onCoverTransitionEnd = (event) => {
        if (event.target === cover && event.propertyName === 'transform') finishOpening();
    };
    cover.addEventListener('transitionend', onCoverTransitionEnd);
    // Fallback also handles a motion preference changed during the transition.
    window.setTimeout(finishOpening, reducedMotion ? 0 : 1400);

    // Aktifkan section pertama segera setelah cover dibuka. Section berikutnya
    // tetap muncul satu per satu ketika tamu menggulir halaman.
    requestAnimationFrame(() => {
        document.querySelectorAll('.reveal').forEach((section) => {
            if (section.getBoundingClientRect().top < window.innerHeight * 0.9) {
                section.classList.add('active');
            }
        });
    });

}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    if (isPlaying) {
        music.pause();
        musicBtn.innerText = '🔇';
        isPlaying = false;
    } else {
        const playPromise = music.play();
        musicBtn.innerText = '🎵';
        isPlaying = true;
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                isPlaying = false;
                musicBtn.innerText = '🔇';
            });
        }
    }
}

async function salinRekening() {
    const norek = document.getElementById('norek').innerText;
    const toast = document.getElementById('toast');
    try {
        await navigator.clipboard.writeText(norek);
        toast.textContent = 'Nomor rekening berhasil disalin.';
    } catch (error) {
        toast.textContent = 'Silakan salin nomor rekening secara manual: ' + norek;
    }
    toast.classList.add('visible');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

// ============================
// 3. LOGIKA SETELAH HTML DIMUAT (DOM Content Loaded)
// ============================
document.addEventListener('DOMContentLoaded', function() {

    // Fitur Nama Tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    if (to && document.getElementById('guest-name')) {
        document.getElementById('guest-name').innerText = to;
    }


    // Penghitung Mundur (Countdown)
    const targetDate = new Date("2027-10-02T10:00:00+07:00").getTime();
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        const updateCountdown = function() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                document.getElementById("hari").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
                document.getElementById("jam").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                document.getElementById("menit").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                document.getElementById("detik").innerText = Math.floor((distance % (1000 * 60)) / 1000);
            } else {
                countdownEl.innerHTML = "<h3>Hari bahagia telah tiba</h3>";
            }
        };
        updateCountdown();
        setInterval(updateCountdown, 1000);
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

    // No success message until a real delivery service is configured.
    document.getElementById('rsvp-form').addEventListener('submit', e => e.preventDefault());
    if (to) document.getElementById('nama').value = to;
    const attendance = document.getElementById('kehadiran');
    const guestCount = document.getElementById('jumlah-tamu');
    attendance.addEventListener('change', () => {
        const attending = attendance.value === 'Hadir';
        guestCount.disabled = !attending;
        guestCount.required = attending;
    });
    const field = document.querySelector('.star-field');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 95; i++) {
        const star = document.createElement('i');
        star.className = 'star';
        star.style.cssText = '--size:' + (i % 5 === 0 ? 2 : 1) + 'px;--duration:' + (3 + i % 7) + 's;--delay:-' + (i % 11) + 's;left:' + ((i * 37.31) % 100) + '%;top:' + ((i * 23.17) % 100) + '%';
        fragment.appendChild(star);
    }
    field.appendChild(fragment);
    document.addEventListener('visibilitychange', () => document.body.classList.toggle('motion-paused', document.hidden));
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            document.querySelectorAll('.bottom-nav a').forEach(link => {
                if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-15% 0px -45% 0px' });
    document.querySelectorAll('main [id]').forEach(el => { if (document.querySelector('.bottom-nav a[href="#' + el.id + '"]')) navObserver.observe(el); });
    const music = document.getElementById('bg-music');
    const syncMusic = () => {
        isPlaying = !music.paused;
        const button = document.getElementById('music-btn');
        button.textContent = isPlaying ? '♫' : '♪';
        button.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
        button.setAttribute('aria-pressed', String(isPlaying));
    };
    music.addEventListener('play', syncMusic);
    music.addEventListener('pause', syncMusic);
    syncMusic();
});
