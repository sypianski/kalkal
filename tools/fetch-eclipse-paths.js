#!/usr/bin/env node
// Fetch eclipse path data from NASA for eclipses missing from eclipse_path_data.json
// Usage: node tools/fetch-eclipse-paths.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const ECLIPSES_TO_FETCH = [
  // --- previously fetched (will skip) ---
  { key: '10632ibrahim',    year: 632,  month: 1,  day: 27 },
  { key: '10693umayyad',    year: 693,  month: 10, day: 5  },
  { key: '10891abbasid',    year: 891,  month: 8,  day: 8  },
  { key: '10961fatimid',    year: 961,  month: 5,  day: 17 },
  { key: '11176byzantine', year: 1176, month: 4,  day: 11 },
  { key: '11230damascus',  year: 1230, month: 5,  day: 14 },
  { key: '11239ayyubid',   year: 1239, month: 6,  day: 3  },
  { key: '11310ilkhanid',  year: 1310, month: 1,  day: 31 },
  { key: '11354ottoman',   year: 1354, month: 9,  day: 17 },
  { key: '11431murad',     year: 1431, month: 2,  day: 12 },
  // --- new batch ---
  { key: '10045claudius',       year: 45,   month: 8,  day: 1  },
  { key: '10132barkokhba',     year: 132,  month: 6,  day: 1  },
  { key: '10247rome',          year: 247,  month: 3,  day: 24 },
  { key: '10345constantius',   year: 345,  month: 6,  day: 16 },
  { key: '10399arcadius',      year: 399,  month: 7,  day: 19 },
  { key: '10402stilicho',      year: 402,  month: 11, day: 11 },
  { key: '10432ephesus',       year: 432,  month: 4,  day: 16 },
  { key: '10486odoacer',       year: 486,  month: 5,  day: 19 },
  { key: '10540justinian',     year: 540,  month: 6,  day: 20 },
  { key: '10573sassanid',      year: 573,  month: 3,  day: 19 },
  { key: '10627nineveh',       year: 627,  month: 4,  day: 21 },
  { key: '10646conquest',      year: 646,  month: 4,  day: 21 },
  { key: '10725bede',          year: 725,  month: 7,  day: 14 },
  { key: '10812charlemagne',   year: 812,  month: 5,  day: 14 },
  { key: '10833mamun',         year: 833,  month: 9,  day: 17 },
  { key: '10920romanos',       year: 920,  month: 7,  day: 18 },
  { key: '10939byzantine',     year: 939,  month: 7,  day: 19 },
  { key: '10993hakim',         year: 993,  month: 8,  day: 20 },
  { key: '11000millennium',   year: 1000, month: 4,  day: 7  },
  { key: '11054schism',       year: 1054, month: 5,  day: 10 },
  { key: '11079khayyam',      year: 1079, month: 7,  day: 1  },
  { key: '11113crusader',     year: 1113, month: 3,  day: 19 },
  { key: '11147crusade',      year: 1147, month: 10, day: 26 },
  { key: '11261palaiologos',  year: 1261, month: 4,  day: 1  },
  { key: '11293acre',         year: 1293, month: 7,  day: 5  },
  { key: '11361adrianople',   year: 1361, month: 5,  day: 5  },
  { key: '11434ottoman',      year: 1434, month: 6,  day: 7  },
  { key: '11478mehmed',       year: 1478, month: 7,  day: 29 },
];

function pad2(n) { return n < 10 ? '0' + n : '' + n; }
function pad4(n) { let s = '' + n; while (s.length < 4) s = '0' + s; return s; }

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function parseNasaData(jsText, ecl) {
  const latGE = parseFloat(jsText.match(/var LatGE\s*=\s*([-\d.]+)/)?.[1]);
  const lngGE = parseFloat(jsText.match(/var LngGE\s*=\s*([-\d.]+)/)?.[1]);

  function extractCoords(varName) {
    const re = new RegExp('const ' + varName + '\\s*=\\s*\\[([\\s\\S]*?)\\];');
    const m = jsText.match(re);
    if (!m) return [];
    const coords = [];
    const pairRe = /\{lat:\s*([-\d.]+),\s*lng:\s*([-\d.]+)\}/g;
    let pm;
    while ((pm = pairRe.exec(m[1])) !== null) {
      coords.push([parseFloat(pm[1]), parseFloat(pm[2])]);
    }
    return coords;
  }

  return {
    noteKey: ecl.key,
    year: ecl.year,
    month: ecl.month,
    day: ecl.day,
    greatestLat: latGE,
    greatestLon: lngGE,
    northernLimit: extractCoords('northernLimitCoords'),
    centralLine: extractCoords('centralLimitCoords'),
    southernLimit: extractCoords('southernLimitCoords')
  };
}

async function main() {
  const dataFile = path.join(__dirname, '..', 'eclipse_path_data.json');
  const existing = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  for (const ecl of ECLIPSES_TO_FETCH) {
    if (existing[ecl.key]) {
      console.log('  skip ' + ecl.key + ' (already exists)');
      continue;
    }

    const ecession = pad4(ecl.year) + pad2(ecl.month) + pad2(ecl.day);
    const url = 'https://eclipse.gsfc.nasa.gov/SEsearch/eclipse-path-data.js.php?Ecl=' + ecession + '&Spc=0.5';
    console.log('  fetch ' + ecl.key + ' (' + ecession + ')...');

    const jsText = await fetchUrl(url);

    if (!jsText.includes('northernLimitCoords') && !jsText.includes('centralLimitCoords')) {
      console.log('    ERROR: no path data for ' + ecl.key);
      continue;
    }

    const parsed = parseNasaData(jsText, ecl);
    console.log('    greatest: ' + parsed.greatestLat.toFixed(2) + ' N, ' + parsed.greatestLon.toFixed(2) + ' E');
    console.log('    central line: ' + parsed.centralLine.length + ' points');
    console.log('    northern limit: ' + parsed.northernLimit.length + ' points');
    console.log('    southern limit: ' + parsed.southernLimit.length + ' points');

    existing[ecl.key] = parsed;
  }

  fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2));
  console.log('\nDone! Updated eclipse_path_data.json');
}

main().catch(console.error);
