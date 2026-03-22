#!/usr/bin/env node
// Generate individual eclipse map HTML files from NASA path data + base map template
// Each map is centered on the eclipse path, covering Iberia to Persia.
// Usage: node tools/generate-eclipse-maps.js

const fs = require('fs');
const path = require('path');

// --- Mercator projection (same as eklipso.html) ---
// The projection is absolute: given lon/lat → pixel x/y
// The viewBox then selects which pixel region to display.
const R = 629;
const Y_OFFSET = 555.0;
const LON_LEFT = 20; // reference: 20°E = x:0 in the original coordinate system
const LON_SCALE = 800 / 60; // 13.333 px per degree

function lonToX(lon) { return (lon - LON_LEFT) * LON_SCALE; }
function latToY(lat) {
  return Y_OFFSET - R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
}

// Load cities from JSON
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));

// Approximate penumbral radius in degrees latitude (~3400 km ≈ 31° lat)
const PENUMBRA_RADIUS = 15;

// Check if a city is within the partial eclipse zone
function isInPartialZone(city, centralLine) {
  // Find the closest point on the central line by longitude
  let minDist = Infinity;
  for (const [cLat, cLon] of centralLine) {
    const dLon = Math.abs(city.lon - cLon);
    const dLat = Math.abs(city.lat - cLat);
    const dist = Math.sqrt(dLon * dLon + dLat * dLat);
    if (dist < minDist) minDist = dist;
  }
  return minDist <= PENUMBRA_RADIUS;
}

// Select cities for the map: major cities always, others if in partial zone
function selectCities(vb, year, centralLine) {
  const inView = CITIES.filter(c =>
    c.lon >= vb.lonMin + 0.5 && c.lon <= vb.lonMax - 0.5 &&
    c.lat >= vb.latMin + 0.5 && c.lat <= vb.latMax - 0.5 &&
    (c.from === null || c.from <= year) &&
    (c.to === null || c.to >= year)
  );

  // Split into major (always show) and partial-zone cities
  const major = inView.filter(c => c.major);
  const inZone = inView.filter(c => !c.major && isInPartialZone(c, centralLine));

  // Merge: major first, then zone cities
  const candidates = [...major, ...inZone];

  // Anti-overlap filter using bounding-box collision
  // Approximate label size: ~50px wide, ~12px tall at typical zoom
  const scaleX = vb.w / 800; // scale factor relative to default 800px viewport
  const labelW = 55 * scaleX;  // approximate label width in map coords
  const labelH = 14 * scaleX;  // approximate label height
  const selected = [];

  for (const c of candidates) {
    const cx = lonToX(c.lon);
    const cy = latToY(c.lat);
    const tooClose = selected.some(s => {
      const dx = Math.abs(lonToX(s.lon) - cx);
      const dy = Math.abs(latToY(s.lat) - cy);
      return dx < labelW && dy < labelH;
    });
    if (!tooClose) selected.push(c);
    if (selected.length >= 25) break;
  }
  return selected;
}

// --- Load data ---
const pathData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'eclipse_path_data.json'), 'utf8'));
const landSvg = fs.readFileSync(path.join(__dirname, '..', 'svg', 'basemap-land.svg.part'), 'utf8');

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const TITLES = {
  crucifixion29: 'Total eclipse discussed in dating the Crucifixion',
  pliny59: 'Documented by Pliny the Elder in Natural History',
  jerusalem71: 'Eclipse near Jerusalem during the era of the Roman siege',
  elagabalus219: 'Total eclipse over Persia \u2014 reign of Elagabalus',
  julian364: 'During Julian the Apostate\u2019s Persian campaign',
  theon393: 'First eclipse observation recorded by Theon of Alexandria',
  theon418: 'Observed by Theon of Alexandria, used to calibrate astronomical tables',
  proclus484: 'Documented by Marinus of Neapolis in the biography of Proclus',
  arabia590: 'Annular eclipse over Arabia \u2014 pre-Islamic period',
  constantinople718: 'During the Arab siege of Constantinople',
  harun809: 'During the reign of Harun al-Rashid',
  louis840: 'Eclipse of Emperor Louis the Pious, seen as an omen of his death',
  biruni968: 'Observed and recorded by al-Biruni in Baghdad',
  crucifixion1033: 'Millennium of the Crucifixion \u2014 widely documented across Christendom',
  crusade1098: 'During the First Crusade, siege of Antioch',
  henry1133: 'King Henry\u2019s Eclipse \u2014 observed across Europe and the Levant',
  hattin1187: 'Year of the Battle of Hattin and Saladin\u2019s conquest of Jerusalem',
  mongols1241: 'During the Mongol invasion of the Middle East',
  constantinople1453: 'Months before the fall of Constantinople to Mehmed II',
};

// Historical observations: where / by whom the eclipse was documented
const OBSERVATIONS = {
  crucifixion29: [
    { lat: 31.77, lon: 35.23, label: 'Jerusalem — discussed in Crucifixion dating' }
  ],
  pliny59: [
    { lat: 41.90, lon: 12.50, label: 'Rome — documented by Pliny the Elder' }
  ],
  jerusalem71: [
    { lat: 31.77, lon: 35.23, label: 'Jerusalem — era of the Roman siege' }
  ],
  elagabalus219: [
    { lat: 33.09, lon: 44.58, label: 'Ctesiphon — reign of Elagabalus' }
  ],
  julian364: [
    { lat: 33.09, lon: 44.58, label: 'Mesopotamia — Julian\u2019s Persian campaign' }
  ],
  theon393: [
    { lat: 31.20, lon: 29.92, label: 'Alexandria — first observation by Theon' }
  ],
  theon418: [
    { lat: 31.20, lon: 29.92, label: 'Alexandria — Theon\u2019s calibration observation' }
  ],
  proclus484: [
    { lat: 37.98, lon: 23.73, label: 'Athens — biography of Proclus by Marinus' }
  ],
  arabia590: [
    { lat: 21.43, lon: 39.83, label: 'Arabia — pre-Islamic period' }
  ],
  constantinople718: [
    { lat: 41.01, lon: 28.98, label: 'Constantinople — during Arab siege' }
  ],
  harun809: [
    { lat: 33.31, lon: 44.37, label: 'Baghdad — reign of Harun al-Rashid' }
  ],
  louis840: [
    { lat: 50.77, lon: 6.08, label: 'Aachen — omen of Emperor Louis\u2019 death' },
    { lat: 48.85, lon: 2.35, label: 'Francia — widely observed' }
  ],
  biruni968: [
    { lat: 33.31, lon: 44.37, label: 'Baghdad — observed by al-Biruni' }
  ],
  crucifixion1033: [
    { lat: 31.77, lon: 35.23, label: 'Jerusalem — millennium of the Crucifixion' },
    { lat: 41.90, lon: 12.50, label: 'Rome — documented across Christendom' }
  ],
  crusade1098: [
    { lat: 36.20, lon: 36.16, label: 'Antioch — during the First Crusade siege' }
  ],
  henry1133: [
    { lat: 51.50, lon: -0.12, label: 'England — King Henry\u2019s Eclipse' },
    { lat: 31.77, lon: 35.23, label: 'Levant — observed by Crusader chroniclers' }
  ],
  hattin1187: [
    { lat: 32.79, lon: 35.53, label: 'Tiberias — year of the Battle of Hattin' },
    { lat: 31.77, lon: 35.23, label: 'Jerusalem — Saladin\u2019s conquest' }
  ],
  mongols1241: [
    { lat: 33.31, lon: 44.37, label: 'Baghdad — Mongol invasion era' },
    { lat: 36.20, lon: 37.16, label: 'Aleppo — Mongol advance' }
  ],
  constantinople1453: [
    { lat: 41.01, lon: 28.98, label: 'Constantinople — before the fall to Mehmed II' }
  ],
};

const TYPE_NAMES = { T: 'Total', A: 'Annular', H: 'Hybrid' };
const TYPE_COLORS = { T: '#8b0000', A: '#c46920', H: '#6b3fa0' };
const TYPES = {
  crucifixion29: 'T', pliny59: 'T', jerusalem71: 'H', elagabalus219: 'T',
  julian364: 'T', theon393: 'T', theon418: 'T', proclus484: 'T',
  arabia590: 'A', constantinople718: 'T', harun809: 'A', louis840: 'T',
  biruni968: 'T', crucifixion1033: 'A', crusade1098: 'A', henry1133: 'T',
  hattin1187: 'T', mongols1241: 'T', constantinople1453: 'A',
};
const MAGS = {
  crucifixion29: 1.022, pliny59: 1.019, jerusalem71: 1.007, elagabalus219: 1.063,
  julian364: 1.057, theon393: 1.037, theon418: 1.046, proclus484: 1.037,
  arabia590: 0.930, constantinople718: 1.046, harun809: 0.968, louis840: 1.076,
  biruni968: 1.030, crucifixion1033: 0.993, crusade1098: 0.926, henry1133: 1.065,
  hattin1187: 1.059, mongols1241: 1.049, constantinople1453: 0.939,
};

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function pad4(n) { let s = '' + n; while (s.length < 4) s = '0' + s; return s; }
function nasaUrl(y, m, d) {
  return 'https://eclipse.gsfc.nasa.gov/SEsearch/SEsearchmap.php?Ecession=' + pad4(y) + pad2(m) + pad2(d);
}

// Compute viewBox centered on the eclipse path within the core region.
// Uses the centroid of the central line (clipped to core), not greatest eclipse.
const CORE = { lonMin: -8, lonMax: 58, latMin: 12, latMax: 45 };

function computeViewBox(ecl, key) {
  const HALF_LON = 22;
  const HALF_LAT = 14;

  // Find centroid of central line within core region
  const inCore = ecl.centralLine.filter(([lat, lon]) =>
    lon >= CORE.lonMin && lon <= CORE.lonMax && lat >= CORE.latMin && lat <= CORE.latMax
  );

  // Collect all points that must be visible: central line in core + observation sites
  const mustShow = inCore.map(([lat, lon]) => ({ lat, lon }));
  const obs = OBSERVATIONS[key] || [];
  obs.forEach(o => mustShow.push({ lat: o.lat, lon: o.lon }));

  let cLon, cLat;
  if (mustShow.length >= 2) {
    cLon = mustShow.reduce((s, p) => s + p.lon, 0) / mustShow.length;
    cLat = mustShow.reduce((s, p) => s + p.lat, 0) / mustShow.length;
  } else {
    cLon = Math.max(-5, Math.min(55, ecl.greatestLon));
    cLat = Math.max(18, Math.min(42, ecl.greatestLat));
  }

  // Ensure all must-show points fit within the view
  let halfLon = HALF_LON, halfLat = HALF_LAT;
  for (const p of mustShow) {
    halfLon = Math.max(halfLon, Math.abs(p.lon - cLon) + 3);
    halfLat = Math.max(halfLat, Math.abs(p.lat - cLat) + 3);
  }

  let lonMin = cLon - halfLon;
  let lonMax = cLon + halfLon;
  let latMin = cLat - halfLat;
  let latMax = cLat + halfLat;

  // Clamp to outer limits (land data available)
  lonMin = Math.max(lonMin, -15);
  lonMax = Math.min(lonMax, 75);
  latMin = Math.max(latMin, 5);
  latMax = Math.min(latMax, 55);

  const x = lonToX(lonMin);
  const y = latToY(latMax); // note: higher lat = lower y
  const w = lonToX(lonMax) - x;
  const h = latToY(latMin) - y;

  return { x, y, w, h, lonMin, lonMax, latMin, latMax };
}

// Generate grid lines for the visible area
function generateGrid(vb) {
  const lines = [];
  // Latitude lines every 10°
  for (let lat = 10; lat <= 50; lat += 10) {
    if (lat < vb.latMin || lat > vb.latMax) continue;
    const y = latToY(lat).toFixed(1);
    const x1 = lonToX(vb.lonMin).toFixed(1);
    const x2 = lonToX(vb.lonMax).toFixed(1);
    lines.push(`      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`);
    lines.push(`      <text x="${(parseFloat(x1) + 3).toFixed(1)}" y="${(parseFloat(y) - 3).toFixed(1)}" class="gl">${lat}\u00b0N</text>`);
  }
  // Longitude lines every 10°
  const lonStart = Math.ceil(vb.lonMin / 10) * 10;
  for (let lon = lonStart; lon <= vb.lonMax; lon += 10) {
    const x = lonToX(lon).toFixed(1);
    const y1 = latToY(vb.latMax).toFixed(1);
    const y2 = latToY(vb.latMin).toFixed(1);
    lines.push(`      <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`);
    const label = lon >= 0 ? lon + '\u00b0E' : (-lon) + '\u00b0W';
    lines.push(`      <text x="${(parseFloat(x) + 2).toFixed(1)}" y="${(parseFloat(y2) - 3).toFixed(1)}" class="gl">${label}</text>`);
  }
  return `    <g stroke="#8a7a62" stroke-width="0.25" fill="none" opacity="0.35">\n${lines.join('\n')}\n    </g>`;
}

// Generate city markers for the visible area (filtered by year)
function generateCities(vb, year, centralLine) {
  const cities = selectCities(vb, year, centralLine);
  if (!cities.length) return '';

  const elems = cities.map(c => {
    const cx = lonToX(c.lon).toFixed(1);
    const cy = latToY(c.lat).toFixed(1);
    const anchor = c.lon > (vb.lonMin + vb.lonMax) / 2 ? 'end' : 'start';
    const tx = anchor === 'start' ? (parseFloat(cx) + 5).toFixed(1) : (parseFloat(cx) - 5).toFixed(1);
    const ty = (parseFloat(cy) + 3).toFixed(1);
    return `      <circle cx="${cx}" cy="${cy}" r="2.5" class="city"/>\n      <text x="${tx}" y="${ty}" text-anchor="${anchor}" class="cn">${c.name}</text>`;
  });

  return `    <g>\n${elems.join('\n')}\n    </g>`;
}

// Convert coordinate array to SVG path string
function coordsToPath(coords) {
  const points = [];
  for (const [lat, lon] of coords) {
    points.push(lonToX(lon).toFixed(1) + ',' + latToY(lat).toFixed(1));
  }
  if (points.length < 2) return '';
  return 'M' + points.join('L');
}

// Build eclipse band (filled area between limits)
function buildBand(northern, southern) {
  const nPts = northern.map(([lat, lon]) => [lonToX(lon), latToY(lat)]);
  const sPts = southern.map(([lat, lon]) => [lonToX(lon), latToY(lat)]);
  if (nPts.length < 2 || sPts.length < 2) return '';

  let d = 'M' + nPts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const sRev = sPts.slice().reverse();
  d += 'L' + sRev.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z';
  return d;
}

function generateMap(key, ecl) {
  const type = TYPES[key] || 'T';
  const mag = MAGS[key] || 1.0;
  const color = TYPE_COLORS[type] || '#8b4513';
  const centralColor = { '#8b0000': '#4a0000', '#c46920': '#8b4513', '#6b3fa0': '#3f1f6b' }[color] || color;
  const typeName = TYPE_NAMES[type] || type;
  const title = TITLES[key] || '';
  const dateStr = pad2(ecl.day) + ' ' + MONTHS[ecl.month] + ' ' + ecl.year + ' CE';

  // Compute centered viewBox
  const vb = computeViewBox(ecl, key);

  const gx = lonToX(ecl.greatestLon);
  const gy = latToY(ecl.greatestLat);
  const inBounds = gx >= vb.x && gx <= vb.x + vb.w && gy >= vb.y && gy <= vb.y + vb.h;

  // SVG paths
  const bandPath = buildBand(ecl.northernLimit, ecl.southernLimit);
  const northPath = coordsToPath(ecl.northernLimit);
  const southPath = coordsToPath(ecl.southernLimit);
  const centralPath = coordsToPath(ecl.centralLine);

  // Penumbral band: expand central line by ±PENUMBRA_RADIUS degrees latitude
  const penumbraN = ecl.centralLine.map(([lat, lon]) => [lat + PENUMBRA_RADIUS, lon]);
  const penumbraS = ecl.centralLine.map(([lat, lon]) => [lat - PENUMBRA_RADIUS, lon]);
  const penumbraPath = buildBand(penumbraN, penumbraS);

  const gridSvg = generateGrid(vb);
  const citiesSvg = generateCities(vb, ecl.year, ecl.centralLine);

  // Historical observation markers
  const obs = OBSERVATIONS[key] || [];
  const obsElems = obs.map(o => {
    const ox = lonToX(o.lon);
    const oy = latToY(o.lat);
    const inView = ox >= vb.x && ox <= vb.x + vb.w && oy >= vb.y && oy <= vb.y + vb.h;
    if (!inView) return '';
    const anchor = o.lon > (vb.lonMin + vb.lonMax) / 2 ? 'end' : 'start';
    const tx = anchor === 'start' ? (ox + 8).toFixed(1) : (ox - 8).toFixed(1);
    return `    <!-- Observation: ${o.label} -->
    <g>
      <polygon points="${ox.toFixed(1)},${(oy - 7).toFixed(1)} ${(ox - 4.5).toFixed(1)},${(oy + 4).toFixed(1)} ${(ox + 4.5).toFixed(1)},${(oy + 4).toFixed(1)}" fill="#d4a017" stroke="#8b6914" stroke-width="0.8"/>
      <text x="${tx}" y="${(oy - 9).toFixed(1)}" text-anchor="${anchor}" style="font: italic 7px 'Alegreya Sans', sans-serif; fill: #8b6914;">${o.label}</text>
    </g>`;
  }).filter(Boolean);
  const observationsSvg = obsElems.length ? '\n    <!-- Historical observations -->\n' + obsElems.join('\n') : '';

  const eclipseSvg = `
    <!-- Partial eclipse zone (penumbra) -->
    ${penumbraPath ? '<path d="' + penumbraPath + '" fill="' + color + '" fill-opacity="0.06" stroke="none"/>' : ''}
    <!-- Total/annular eclipse band -->
    ${bandPath ? '<path d="' + bandPath + '" fill="' + color + '" fill-opacity="0.2" stroke="none"/>' : ''}
    <!-- Northern limit -->
    ${northPath ? '<path d="' + northPath + '" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.6"/>' : ''}
    <!-- Southern limit -->
    ${southPath ? '<path d="' + southPath + '" fill="none" stroke="' + color + '" stroke-width="0.8" opacity="0.6"/>' : ''}
    <!-- Central line -->
    ${centralPath ? '<path d="' + centralPath + '" fill="none" stroke="' + centralColor + '" stroke-width="1.5" stroke-dasharray="6,3"/>' : ''}
    <!-- Greatest eclipse -->
    ${inBounds ? `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="6" fill="none" stroke="${color}" stroke-width="2"/>
    <circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="2" fill="${color}"/>
    <text x="${(gx - 10).toFixed(1)}" y="${(gy - 10).toFixed(1)}" text-anchor="end" class="cn" style="font-size:8px;fill:${color};">Greatest eclipse</text>` : `<!-- Greatest eclipse outside view: ${ecl.greatestLat.toFixed(1)}\u00b0N, ${ecl.greatestLon.toFixed(1)}\u00b0E -->`}
${observationsSvg}`;

  const legendItems = [];
  if (penumbraPath) {
    legendItems.push(`<div class="legend-item">
      <div class="legend-swatch" style="background:${color}10;border:1px solid ${color}30;"></div>
      Partial eclipse zone
    </div>`);
  }
  if (bandPath) {
    legendItems.push(`<div class="legend-item">
      <div class="legend-swatch" style="background:${color}40;border:1px solid ${color};"></div>
      ${typeName} eclipse path
    </div>
    <div class="legend-item">
      <div class="legend-swatch" style="border-top:2px dashed ${centralColor};"></div>
      Central line
    </div>`);
  }
  legendItems.push(`<div class="legend-item">
      <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5" fill="none" stroke="${color}" stroke-width="1.5"/><circle cx="7" cy="7" r="2" fill="${color}"/></svg>
      Greatest eclipse (${ecl.greatestLat.toFixed(1)}\u00b0N, ${ecl.greatestLon.toFixed(1)}\u00b0E)
    </div>`);
  if (obs.length) {
    legendItems.push(`<div class="legend-item">
      <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,2 3.5,12 10.5,12" fill="#d4a017" stroke="#8b6914" stroke-width="0.8"/></svg>
      Historical observation
    </div>`);
  }

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>kalkal \u2014 ${typeName} Eclipse, ${dateStr}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&family=Charis+SIL:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Sans:wght@400;500;600&family=Noto+Sans+Mono:wght@400;500&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body data-page="eclipse-map">

  <div class="page-grain"></div>

  <header class="site-header">
    <div class="header-inner">
      <div class="brand">
        <div class="brand-text">
          <h1 class="site-title">${typeName} Solar Eclipse of ${dateStr}</h1>
          <p class="site-subtitle">${title}</p>
        </div>
      </div>
      <nav class="lang-switcher" id="lang-switcher" aria-label="Language">
        <button class="lang-btn active" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="pl">PL</button>
        <button class="lang-btn" data-lang="ar">AR</button>
        <button class="lang-btn" data-lang="eo">EO</button>
      </nav>
    </div>
    <nav class="page-nav" aria-label="Pages">
      <a href="../index.html" data-nav="converter">Converter</a>
      <a href="../calendars.html" data-nav="calendars">Calendars</a>
      <a href="../methodology.html" data-nav="methodology">Methodology</a>
      <a href="../eclipses.html" data-nav="eclipses">Eclipses</a>
    </nav>
  </header>

  <main class="main-content ecl-map-page">

  <svg class="map" viewBox="${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        .gl { font: 8px 'Charis SIL', Georgia, serif; fill: #8a7a62; opacity: 0.6; }
        .cn { font: 500 8.5px 'Alegreya Sans', 'Noto Sans', sans-serif; fill: #1a1612; }
        .city { fill: #4a3f30; }
      </style>
    </defs>

    <!-- Sea -->
    <rect x="${(vb.x - 10).toFixed(0)}" y="${(vb.y - 10).toFixed(0)}" width="${(vb.w + 20).toFixed(0)}" height="${(vb.h + 20).toFixed(0)}" fill="#d4dce6"/>

    <!-- Land -->
    <g fill="#e8ddc6" stroke="#4a3f30" stroke-width="0.6" stroke-linejoin="round">
${landSvg}
    </g>

${gridSvg}

${citiesSvg}

${eclipseSvg}

    <!-- Frame -->
    <rect x="${vb.x.toFixed(1)}" y="${vb.y.toFixed(1)}" width="${vb.w.toFixed(1)}" height="${vb.h.toFixed(1)}" fill="none" stroke="#8a7a62" stroke-width="0.8"/>
  </svg>

  <div class="ecl-map-legend">
    ${legendItems.join('\n    ')}
  </div>

  ${obs.length ? `<div class="ecl-map-note" style="text-align:left;max-width:700px;margin:0.8rem auto;">
    <strong>Historical context</strong>
    ${obs.map(o => '<p style="margin:0.3rem 0;">\u25b2 ' + o.label + '</p>').join('\n    ')}
  </div>` : ''}

  <p class="ecl-map-note">
    Eclipse path computed from NASA Five Millennium Canon of Solar Eclipses (Fred Espenak, NASA/GSFC).<br>
    Land contours: Natural Earth 10m. Magnitude: ${mag.toFixed(3)}.
    <a href="${nasaUrl(ecl.year, ecl.month, ecl.day)}" target="_blank">NASA eclipse page</a> \u2022
    <a href="../index.html?cal=julian&y=${ecl.year}&m=${ecl.month}&d=${ecl.day}">Convert this date</a>
  </p>

  </main>

  <script src="../js/pages.js"></script>

  <button class="theme-switcher" id="theme-switcher" aria-label="Switch theme">
    &#x1F3A8;
    <span class="theme-label" id="theme-label"></span>
  </button>
  <script>
  (() => {
    const THEMES = ['manuscript', 'brutalist'];
    const LABELS = { manuscript: 'Manuscript', brutalist: 'Brutalist' };
    const btn = document.getElementById('theme-switcher');
    const label = document.getElementById('theme-label');
    function applyTheme(theme) {
      if (theme === 'manuscript') document.body.removeAttribute('data-theme');
      else document.body.setAttribute('data-theme', theme);
      label.textContent = LABELS[theme];
      localStorage.setItem('kalkal-theme', theme);
    }
    const saved = localStorage.getItem('kalkal-theme');
    if (saved && THEMES.includes(saved)) applyTheme(saved);
    else applyTheme('brutalist');
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('kalkal-theme') || 'manuscript';
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      applyTheme(next);
    });
  })();
  </script>
</body>
</html>`;
}

// Generate all maps
const outDir = path.join(__dirname, '..', 'maps');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let count = 0;
for (const [key, ecl] of Object.entries(pathData)) {
  const html = generateMap(key, ecl);
  const heYear = ecl.year + 10000;
  const filename = heYear + pad2(ecl.month) + pad2(ecl.day) + '.html';
  fs.writeFileSync(path.join(outDir, filename), html);

  const vb = computeViewBox(ecl, key);
  console.log(`maps/${filename}  (${key})  view: ${vb.lonMin.toFixed(0)}\u00b0..${vb.lonMax.toFixed(0)}\u00b0E, ${vb.latMin.toFixed(0)}\u00b0..${vb.latMax.toFixed(0)}\u00b0N`);
  count++;
}

console.log('\nDone! Generated ' + count + ' centered eclipse maps.');
