# dispereertniet.nl

Historische website over **Jan Pieterszoon Coen** (1587–1629) — Gouverneur-Generaal van de VOC, stichter van Batavia en omstreden figuur van de Nederlandse Gouden Eeuw.

**Live:** [dispereertniet.nl](https://dispereertniet.nl)

---

## Inhoud

| Sectie | Beschrijving |
|---|---|
| Home | Introductie, portretmedallion, sleutelfeiten |
| Biografie | Zes hoofdstukken: van Hoorn tot Batavia |
| VOC & Context | De Gouden Eeuw, de VOC als organisatie, Aziatische context |
| Tijdlijn | Chronologisch overzicht van zijn leven |
| Kaart | Interactieve Leaflet-kaart met VOC-handelsroute |
| Banda 1621 | De vrijwel volledige vernietiging van de Bandanese bevolking |
| Erfenis | Nalatenschap, het standbeelddebat en moderne reflectie |

---

## Deployment via GitHub Pages

### Eerste keer deployen

**1. Maak een GitHub repository aan**
```bash
# Initialiseer git als dat nog niet gedaan is
git init
git add .
git commit -m "first commit"

# Koppel aan GitHub (vervang USERNAME en REPO)
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

**2. Activeer GitHub Pages**
- Ga naar je repository op GitHub
- **Settings → Pages**
- Source: **GitHub Actions**
- Bij de volgende `git push` wordt de site automatisch gedeployed

**3. Controleer de deployment**
- Ga naar **Actions** in je repository
- De workflow `Deploy naar GitHub Pages` runt automatisch
- Na ±1 minuut is de site live op `https://USERNAME.github.io/REPO`

---

### Koppel het domein `dispereertniet.nl`

**Stap 1 — DNS instellen bij je domeinprovider**

Voeg deze DNS-records toe:

| Type | Naam | Waarde |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `USERNAME.github.io` |

**Stap 2 — Custom domain in GitHub Pages**
- **Settings → Pages → Custom domain**
- Vul `dispereertniet.nl` in en sla op
- Vink **Enforce HTTPS** aan (na DNS-propagatie, kan 24u duren)

Het `CNAME`-bestand in de repo doet dit automatisch bij elke deploy.

---

### Google Analytics activeren

Vervang in `index.html` regel 7:
```html
<script>window.GA_ID = 'G-XXXXXXXXXX';</script>
```
door jouw eigen **GA4 Measurement ID** (te vinden in Google Analytics → Admin → Data Streams).

Analytics laadt alleen na expliciete cookietoestemming van de bezoeker.

---

## Bestanden

```
dispereertniet.nl/
├── index.html          # Alle inhoud (SPA)
├── styles.css          # Styling
├── script.js           # Navigatie, kaart, cookie-logica
├── portrait.png        # Portret Jan Pieterszoon Coen (Jacob Waben, ca. 1620)
├── favicon.svg         # VOC-kompasroos favicon
├── sitemap.xml         # Voor zoekmachines
├── robots.txt          # Crawl-instructies
├── CNAME               # Custom domein voor GitHub Pages
├── .nojekyll           # Schakelt Jekyll uit
├── 404.html            # Gestylede foutpagina
└── .github/
    └── workflows/
        └── deploy.yml  # Automatische deployment via GitHub Actions
```

---

## Techniek

- Puur statisch HTML/CSS/JS — geen build-stap vereist
- [Leaflet.js](https://leafletjs.com/) voor de interactieve kaart (CartoDB Dark Matter tiles)
- Lettertypen via Google Fonts: *IM Fell English*, *Crimson Text*, *Lora*
- SEO: meta description, Open Graph, Twitter Card, JSON-LD structured data
- GDPR: cookie-bar met localStorage, GA laadt alleen na toestemming
- Responsive met hamburger-menu op mobiel

---

## Licentie & bronnen

Historische inhoud gebaseerd op publieke bronnen. Afbeeldingen publiek domein via Rijksmuseum / Wikimedia Commons. Portret toegeschreven aan Jacob Waben, ca. 1620, Rijksmuseum Amsterdam.
