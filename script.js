// krystiannagaba.pl: menu, wejścia sekcji, odtwarzacz YouTube ładowany po kliknięciu

(function () {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    var callbar = document.getElementById('callbar');

    // Cień pod menu po przewinięciu + pasek z telefonem na małych ekranach
    function onScroll() {
        var y = window.scrollY;
        nav.classList.toggle('is-stuck', y > 8);
        if (callbar) callbar.classList.toggle('is-on', y > 520);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Menu na telefonie
    function closeMenu() {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Otwórz menu');
    }
    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    });
    links.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    // Wejścia sekcji
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(function (el, i) {
            el.style.transitionDelay = (i % 4) * 70 + 'ms';
            io.observe(el);
        });
    } else {
        items.forEach(function (el) { el.classList.add('is-in'); });
    }

    // YouTube: film wczytuje się dopiero po kliknięciu (bez ciasteczek przed kliknięciem)
    document.querySelectorAll('.yt[data-yt]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var frame = document.createElement('iframe');
            frame.src = 'https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
            frame.title = btn.getAttribute('aria-label') || 'Film';
            frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            frame.allowFullscreen = true;
            var box = document.createElement('div');
            box.className = 'yt';
            box.appendChild(frame);
            btn.replaceWith(box);
        });
    });

    var rok = document.getElementById('rok');
    if (rok) rok.textContent = new Date().getFullYear();
})();
