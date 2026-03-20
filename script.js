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
const LANG = window.location.pathname.startsWith('/uk') ? 'uk'
           : window.location.pathname.startsWith('/en') ? 'en'
           : 'nl';

function t(nl, en, uk) { return LANG === 'uk' ? uk : LANG === 'en' ? en : nl; }

const LOCATIONS = [
    {
        id: 'hoorn', name: 'Hoorn', lat: 52.6424, lng: 5.0601, type: 'persoonlijk',
        year: t('8 jan 1587', '8 Jan 1587', '8 січ 1587'),
        body: t(
            'Geboorteplaats van Jan Pieterszoon Coen. Hoorn was een van de welvarendste handelssteden van de Republiek en een van de oprichters van de VOC.',
            'Birthplace of Jan Pieterszoon Coen. Hoorn was one of the wealthiest trading cities of the Dutch Republic and one of the founding chambers of the VOC.',
            'Місце народження Яна Пітерзона Куна. Горн був одним із найзаможніших торговельних міст Республіки та одним із засновників VOC.'
        )
    },
    {
        id: 'rome', name: 'Rome', lat: 41.9028, lng: 12.4964, type: 'persoonlijk',
        year: '1601–1607',
        body: t(
            'Coen leerde het handelsvak bij het Italiaanse handelshuis van Paschalius Nanning. Hij verwierf kennis van boekhouden, handelsrecht en internationale koopmanspraktijk.',
            'Coen learned the trade at the Italian merchant house of Paschalius Nanning, acquiring knowledge of bookkeeping, commercial law, and international commerce.',
            'Кун навчався торговельній справі у торговому домі Пасхаліуса Нанніна, здобуваючи знання з бухгалтерії, торговельного права та міжнародної комерції.'
        )
    },
    {
        id: 'amsterdam', name: 'Amsterdam', lat: 52.3676, lng: 4.9041, type: 'voc',
        year: t('1602 — heden', '1602 — present', '1602 — сьогодні'),
        body: t(
            'Hoofdkantoor van de VOC en zetel van de Heren XVII. Coen schreef hen talloze brieven vanuit Azië. De aandelenbeurs van Amsterdam was de eerste ter wereld.',
            'Headquarters of the VOC and seat of the Heeren XVII. Coen sent them countless letters from Asia. The Amsterdam stock exchange was the first in the world.',
            'Штаб-квартира VOC і резиденція Панів Сімнадцяти. Кун надсилав їм незліченні листи з Азії. Амстердамська фондова біржа була першою у світі.'
        )
    },
    {
        id: 'kaap', name: t('Kaap de Goede Hoop', 'Cape of Good Hope', 'Мис Доброї Надії'), lat: -34.3568, lng: 18.4735, type: 'voc',
        year: t('doorvaart', 'transit', 'транзит'),
        body: t(
            'Alle VOC-schepen voeren via de Kaap. De reis van Amsterdam naar Batavia duurde zes tot negen maanden. De VOC stichtte hier later (1652) een verversingspost.',
            'All VOC ships passed via the Cape. The voyage from Amsterdam to Batavia took six to nine months. The VOC later established a resupply post here in 1652.',
            'Усі кораблі VOC проходили через Мис. Подорож з Амстердама до Батавії тривала від шести до дев\'яти місяців. Пізніше (1652) VOC заснувала тут станцію постачання.'
        )
    },
    {
        id: 'bantam', name: 'Bantam (Banten)', lat: -6.0366, lng: 106.1503, type: 'voc',
        year: '1607–1619',
        body: t(
            'Het eerste VOC-hoofdkwartier in Azië. Coen werkte hier als assistent en hoofdkoopman. Bantam was een machtig sultanaat en een van de grootste handelssteden van Azië.',
            'The first VOC headquarters in Asia. Coen served here as assistant and chief merchant. Bantam was a powerful sultanate and one of the largest trading cities in Asia.',
            'Перша штаб-квартира VOC в Азії. Кун служив тут помічником і головним купцем. Бантам був потужним султанатом і одним із найбільших торговельних міст Азії.'
        )
    },
    {
        id: 'batavia', name: 'Batavia (Jakarta)', lat: -6.2088, lng: 106.8456, type: 'stichting',
        year: t('30 mei 1619', '30 May 1619', '30 тра 1619'),
        body: t(
            'Coen brandde de stad Jayakarta plat en bouwde op de ruïnes Batavia — het centrum van het Nederlandse koloniale gezag voor drie eeuwen. De stad heet nu Jakarta.',
            'Coen burned the city of Jayakarta to the ground and built Batavia on its ruins — the centre of Dutch colonial authority for three centuries. The city is now known as Jakarta.',
            'Кун спалив місто Джаяртку і збудував на руїнах Батавію — центр нідерландської колоніальної влади протягом трьох сторіч. Нині місто відоме як Джакарта.'
        )
    },
    {
        id: 'ambon', name: 'Ambon', lat: -3.6954, lng: 128.1814, type: 'voc',
        year: '1623',
        body: t(
            'De "Amboyna-massacre": twintig Engelse en Japanse kooplieden werden geëxecuteerd wegens vermeende samenzwering. De episode vergiftigde de Engels-Nederlandse betrekkingen voor decennia.',
            'The "Amboyna massacre": twenty English and Japanese merchants were executed on charges of conspiracy. The episode poisoned Anglo-Dutch relations for decades.',
            '«Амбойнська різанина»: двадцять англійських та японських купців були страчені за звинуваченням у змові. Цей епізод отруїв англо-нідерландські відносини на десятиліття.'
        )
    },
    {
        id: 'banda', name: t('Banda-eilanden', 'Banda Islands', 'Острови Банда'), lat: -4.5228, lng: 129.8945, type: 'banda',
        year: t('mei–okt 1621', 'May–Oct 1621', 'тра–жов 1621'),
        body: t(
            'Coen leidde een expeditie waarbij de Bandanese bevolking van ~15.000 mensen vrijwel geheel werd vernietigd. De enige productieplek van nootmuskaat ter wereld viel volledig in VOC-handen.',
            'Coen led an expedition in which the Bandanese population of ~15,000 was almost entirely annihilated. The world\'s only source of nutmeg fell completely into VOC hands.',
            'Кун очолив експедицію, під час якої населення Банди ~15 000 людей було майже повністю знищено. Єдине у світі місце вирощування мускатного горіха повністю перейшло під контроль VOC.'
        )
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
