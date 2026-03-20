// ── Google Analytics ─────────────────────────────────────
function loadAnalytics() {
    const id = window.GA_ID;
    if (!id || id === 'G-XXXXXXXXXX') return; // geen ID ingesteld
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
}

// ── Cookie Bar ────────────────────────────────────────────
(function initCookieBar() {
    const STORAGE_KEY = 'cookie_consent';
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'accepted') { loadAnalytics(); return; }
    if (stored === 'declined') return;

    // Show bar after brief delay
    const bar = document.getElementById('cookie-bar');
    bar.removeAttribute('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('is-visible')));

    function dismiss(choice) {
        localStorage.setItem(STORAGE_KEY, choice);
        bar.classList.remove('is-visible');
        setTimeout(() => bar.setAttribute('hidden', ''), 500);
        if (choice === 'accepted') loadAnalytics();
    }

    document.getElementById('cookie-accept').addEventListener('click', () => dismiss('accepted'));
    document.getElementById('cookie-decline').addEventListener('click', () => dismiss('declined'));
})();

// ── Map ───────────────────────────────────────────────────
const LOCATIONS = [
    {
        id: 'hoorn', name: 'Hoorn', lat: 52.6424, lng: 5.0601, type: 'persoonlijk',
        year: '8 jan 1587',
        body: 'Geboorteplaats van Jan Pieterszoon Coen. Hoorn was een van de welvarendste handelssteden van de Republiek en een van de oprichters van de VOC.'
    },
    {
        id: 'rome', name: 'Rome', lat: 41.9028, lng: 12.4964, type: 'persoonlijk',
        year: '1601–1607',
        body: 'Coen leerde het handelsvak bij het Italiaanse handelshuis van Paschalius Nanning. Hij verwierf kennis van boekhouden, handelsrecht en internationale koopmanspraktijk.'
    },
    {
        id: 'amsterdam', name: 'Amsterdam', lat: 52.3676, lng: 4.9041, type: 'voc',
        year: '1602 — heden',
        body: 'Hoofdkantoor van de VOC en zetel van de Heren XVII. Coen schreef hen talloze brieven vanuit Azië. De aandelenbeurs van Amsterdam was de eerste ter wereld.'
    },
    {
        id: 'kaap', name: 'Kaap de Goede Hoop', lat: -34.3568, lng: 18.4735, type: 'voc',
        year: 'doorvaart',
        body: 'Alle VOC-schepen voeren via de Kaap. De reis van Amsterdam naar Batavia duurde zes tot negen maanden. De VOC stichtte hier later (1652) een verversingspost.'
    },
    {
        id: 'bantam', name: 'Bantam (Banten)', lat: -6.0366, lng: 106.1503, type: 'voc',
        year: '1607–1619',
        body: 'Het eerste VOC-hoofdkwartier in Azië. Coen werkte hier als assistent en hoofdkoopman. Bantam was een machtig sultanaat en een van de grootste handelssteden van Azië.'
    },
    {
        id: 'batavia', name: 'Batavia (Jakarta)', lat: -6.2088, lng: 106.8456, type: 'stichting',
        year: '30 mei 1619',
        body: 'Coen brandde de stad Jayakarta plat en bouwde op de ruïnes Batavia — het centrum van het Nederlandse koloniale gezag voor drie eeuwen. De stad heet nu Jakarta.'
    },
    {
        id: 'ambon', name: 'Ambon', lat: -3.6954, lng: 128.1814, type: 'voc',
        year: '1623',
        body: 'De "Amboyna-massacre": twintig Engelse en Japanse kooplieden werden geëxecuteerd wegens vermeende samenzwering. De episode vergiftigde de Engels-Nederlandse betrekkingen voor decennia.'
    },
    {
        id: 'banda', name: 'Banda-eilanden', lat: -4.5228, lng: 129.8945, type: 'banda',
        year: 'mei–okt 1621',
        body: 'Coen leidde een expeditie waarbij de Bandanese bevolking van ~15.000 mensen vrijwel geheel werd vernietigd. De enige productieplek van nootmuskaat ter wereld viel volledig in VOC-handen.'
    }
];

// VOC-handelsroute: Nederland → Kaap → Indische Oceaan → Bantam → Batavia
const VOC_ROUTE = [
    [52.37, 4.90],   // Amsterdam
    [48.00, -5.00],  // Biscay
    [36.00, -9.00],  // Lissabon-hoogte
    [20.00, -18.00], // Canarische Eilanden
    [2.00,  -10.00], // West-Afrika
    [-15.00, 2.00],  // Golf van Guinea
    [-34.36, 18.47], // Kaap de Goede Hoop
    [-30.00, 40.00], // Zuid-Indische Oceaan
    [-15.00, 60.00], // Madagaskar-hoogte
    [-5.00,  78.00], // Indische Oceaan
    [5.00,   100.00],// Straat Malakka-hoogte
    [-6.04,  106.15],// Bantam
    [-6.21,  106.85] // Batavia
];

let mapInstance = null;

function initMap() {
    if (mapInstance) return;

    mapInstance = L.map('coen-map', {
        center: [10, 60],
        zoom: 3,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: true
    });

    // Dark CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapInstance);

    // VOC-route
    L.polyline(VOC_ROUTE, {
        color: 'rgba(212,165,116,0.45)',
        weight: 1.5,
        dashArray: '6, 5'
    }).addTo(mapInstance);

    // Markers
    LOCATIONS.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {
            icon: L.divIcon({
                className: '',
                html: `<div class="map-marker-dot ${loc.type}"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7],
                popupAnchor: [0, -10]
            })
        });

        marker.bindPopup(`
            <div class="map-popup-year">${loc.year}</div>
            <div class="map-popup-title">${loc.name}</div>
            <div class="map-popup-body">${loc.body}</div>
        `, { maxWidth: 280, closeButton: true });

        marker.addTo(mapInstance);
    });
}

// ── Navigation ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function activateSection(sectionId) {
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
        const targetSection = document.getElementById(sectionId);

        if (targetLink)  targetLink.classList.add('active');
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (sectionId === 'kaart') {
            setTimeout(initMap, 80);
        }
    }

    // Hamburger toggle
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu   = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar')) {
            navMenu.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', false);
        }
    });

    // Nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navMenu.classList.remove('is-open');
            hamburger.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', false);
            activateSection(this.getAttribute('data-section'));
        });
    });

    // Intro nav cards (home page)
    document.querySelectorAll('.intro-nav-card[data-goto]').forEach(card => {
        card.addEventListener('click', function () {
            activateSection(this.getAttribute('data-goto'));
        });
    });

    // Activate home on load
    activateSection('home');

    // ── Scroll-in animation ─────────────────────────────
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function observeElements() {
        const selectors = [
            '.chapter',
            '.pull-quote',
            '.primary-source-box',
            '.legacy-card',
            '.timeline-item',
            '.key-fact',
            '.intro-nav-card',
            '.stat-item',
            '.character-trait',
            '.source-category'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.06}s, transform 0.5s ease ${(i % 6) * 0.06}s`;
            observer.observe(el);
        });
    }

    observeElements();

    // Re-observe when switching sections
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            setTimeout(observeElements, 100);
        });
    });

    document.querySelectorAll('.intro-nav-card[data-goto]').forEach(card => {
        card.addEventListener('click', function () {
            setTimeout(observeElements, 100);
        });
    });
});
