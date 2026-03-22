#!/usr/bin/env node
// Fetch eclipse path data from NASA for eclipses missing from eclipse_path_data.json
// Usage: node tools/fetch-eclipse-paths.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const ECLIPSES_TO_FETCH = [
  // --- previously fetched (will skip) ---
  { key: 'ibrahim632',    year: 632,  month: 1,  day: 27 },
  { key: 'umayyad693',    year: 693,  month: 10, day: 5  },
  { key: 'abbasid891',    year: 891,  month: 8,  day: 8  },
  { key: 'fatimid961',    year: 961,  month: 5,  day: 17 },
  { key: 'byzantine1176', year: 1176, month: 4,  day: 11 },
  { key: 'damascus1230',  year: 1230, month: 5,  day: 14 },
  { key: 'ayyubid1239',   year: 1239, month: 6,  day: 3  },
  { key: 'ilkhanid1310',  year: 1310, month: 1,  day: 31 },
  { key: 'ottoman1354',   year: 1354, month: 9,  day: 17 },
  { key: 'murad1431',     year: 1431, month: 2,  day: 12 },
  // --- new batch ---
  { key: 'claudius45',       year: 45,   month: 8,  day: 1  },
  { key: 'barkokhba132',     year: 132,  month: 6,  day: 1  },
  { key: 'rome247',          year: 247,  month: 3,  day: 24 },
  { key: 'constantius345',   year: 345,  month: 6,  day: 16 },
  { key: 'arcadius399',      year: 399,  month: 7,  day: 19 },
  { key: 'stilicho402',      year: 402,  month: 11, day: 11 },
  { key: 'ephesus432',       year: 432,  month: 4,  day: 16 },
  { key: 'odoacer486',       year: 486,  month: 5,  day: 19 },
  { key: 'justinian540',     year: 540,  month: 6,  day: 20 },
  { key: 'sassanid573',      year: 573,  month: 3,  day: 19 },
  { key: 'nineveh627',       year: 627,  month: 4,  day: 21 },
  { key: 'conquest646',      year: 646,  month: 4,  day: 21 },
  { key: 'bede725',          year: 725,  month: 7,  day: 14 },
  { key: 'charlemagne812',   year: 812,  month: 5,  day: 14 },
  { key: 'mamun833',         year: 833,  month: 9,  day: 17 },
  { key: 'romanos920',       year: 920,  month: 7,  day: 18 },
  { key: 'byzantine939',     year: 939,  month: 7,  day: 19 },
  { key: 'hakim993',         year: 993,  month: 8,  day: 20 },
  { key: 'millennium1000',   year: 1000, month: 4,  day: 7  },
  { key: 'schism1054',       year: 1054, month: 5,  day: 10 },
  { key: 'khayyam1079',      year: 1079, month: 7,  day: 1  },
  { key: 'crusader1113',     year: 1113, month: 3,  day: 19 },
  { key: 'crusade1147',      year: 1147, month: 10, day: 26 },
  { key: 'palaiologos1261',  year: 1261, month: 4,  day: 1  },
  { key: 'acre1293',         year: 1293, month: 7,  day: 5  },
  { key: 'adrianople1361',   year: 1361, month: 5,  day: 5  },
  { key: 'ottoman1434',      year: 1434, month: 6,  day: 7  },
  { key: 'mehmed1478',       year: 1478, month: 7,  day: 29 },
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
