// kalkal — Astronomical events: moon phases, comets, supernovae, planetary conjunctions
// Moon phases: Meeus lunation algorithm (accurate to ~1 min for historical dates)
// Other events: curated historical databases with JDN lookup

const Astronomy = (() => {
  'use strict';

  // ===== MOON PHASES (Jean Meeus, Astronomical Algorithms ch. 49) =====

  // Returns moon phase info for a given JD
  // phase: 0..1 (0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter)
  // age: days since last new moon (0..29.53)
  // illumination: 0..1
  // name: 'new'|'waxingCrescent'|'firstQuarter'|'waxingGibbous'|'full'|'waningGibbous'|'lastQuarter'|'waningCrescent'
  // icon: emoji for the phase
  function moonPhase(jd) {
    // Synodic month
    const SYNODIC = 29.53058868;
    // Known new moon: 2000 Jan 6 18:14 UT = JD 2451550.26
    const KNOWN_NEW = 2451550.26;

    const daysSince = jd - KNOWN_NEW;
    const cycles = daysSince / SYNODIC;
    const phase = cycles - Math.floor(cycles);
    // Normalize to 0..1
    const p = phase < 0 ? phase + 1 : phase;
    const age = p * SYNODIC;

    // Illumination approximation (cosine model)
    const illum = (1 - Math.cos(p * 2 * Math.PI)) / 2;

    // Phase name and icon
    let name, icon;
    if (p < 0.0625)       { name = 'new';             icon = '\u{1F311}'; }
    else if (p < 0.1875)  { name = 'waxingCrescent';  icon = '\u{1F312}'; }
    else if (p < 0.3125)  { name = 'firstQuarter';    icon = '\u{1F313}'; }
    else if (p < 0.4375)  { name = 'waxingGibbous';   icon = '\u{1F314}'; }
    else if (p < 0.5625)  { name = 'full';            icon = '\u{1F315}'; }
    else if (p < 0.6875)  { name = 'waningGibbous';   icon = '\u{1F316}'; }
    else if (p < 0.8125)  { name = 'lastQuarter';     icon = '\u{1F317}'; }
    else if (p < 0.9375)  { name = 'waningCrescent';  icon = '\u{1F318}'; }
    else                   { name = 'new';             icon = '\u{1F311}'; }

    return { phase: p, age: Math.round(age * 10) / 10, illumination: Math.round(illum * 1000) / 10, name, icon };
  }


  // ===== HISTORICAL COMETS =====
  // [year, month, day, id, perihelionYear, noteKey]
  // Dates are Julian calendar. Only great comets visible to naked eye.

  const COMETS_RAW = [
    // Halley's Comet appearances
    [-239, 5, 25, 'halley', -239, 'halley_m239'],
    [-163, 11, 12, 'halley', -163, null],
    [-86, 8, 6, 'halley', -86, 'halley_m86'],
    [-11, 10, 10, 'halley', -11, 'halley_m11'],
    [66, 1, 25, 'halley', 66, 'halley_66'],
    [141, 3, 22, 'halley', 141, 'halley_141'],
    [218, 5, 17, 'halley', 218, null],
    [295, 4, 20, 'halley', 295, null],
    [374, 2, 16, 'halley', 374, null],
    [451, 6, 28, 'halley', 451, 'halley_451'],
    [530, 9, 27, 'halley', 530, 'halley_530'],
    [607, 3, 15, 'halley', 607, 'halley_607'],
    [684, 10, 2, 'halley', 684, 'halley_684'],
    [760, 5, 20, 'halley', 760, null],
    [837, 2, 28, 'halley', 837, 'halley_837'],
    [912, 7, 18, 'halley', 912, null],
    [989, 9, 5, 'halley', 989, null],
    [1066, 3, 20, 'halley', 1066, 'halley_1066'],
    [1145, 4, 18, 'halley', 1145, null],
    [1222, 9, 28, 'halley', 1222, null],
    [1301, 10, 25, 'halley', 1301, 'halley_1301'],
    [1378, 11, 10, 'halley', 1378, null],
    [1456, 6, 9, 'halley', 1456, 'halley_1456'],
    // Other great comets
    [44, 5, 25, 'caesars', 44, 'caesars_44'],
    [79, 6, 1, 'great', 79, null],
    [178, 10, 1, 'great', 178, null],
    [336, 4, 1, 'great', 336, null],
    [390, 8, 20, 'great', 390, null],
    [400, 3, 19, 'great', 400, null],
    [423, 2, 1, 'great', 423, null],
    [442, 12, 1, 'great', 442, null],
    [539, 7, 1, 'great', 539, null],
    [565, 9, 1, 'great', 565, null],
    [568, 9, 1, 'great', 568, null],
    [770, 1, 1, 'great', 770, null],
    [817, 2, 1, 'great', 817, null],
    [868, 2, 1, 'great', 868, null],
    [891, 5, 12, 'great', 891, null],
    [905, 4, 18, 'great', 905, null],
    [1106, 2, 4, 'great', 1106, 'great_1106'],
    [1132, 10, 1, 'great', 1132, null],
    [1264, 7, 20, 'great', 1264, 'great_1264'],
    [1402, 3, 21, 'great', 1402, null],
    [1468, 9, 18, 'great', 1468, null],
    [1472, 1, 22, 'great', 1472, 'great_1472'],
  ];

  // Build comet lookup: map JDN range (perihelion +/- 45 days) to comet data
  const cometMap = new Map();

  function initComets() {
    COMETS_RAW.forEach(c => {
      const jd = Cal.julianToJD(c[0], c[1], c[2]);
      const key = Math.floor(jd + 0.5);
      // Store visibility window: perihelion date +/- 45 days
      for (let d = -45; d <= 45; d++) {
        const k = key + d;
        if (!cometMap.has(k)) {
          cometMap.set(k, {
            id: c[3],
            year: c[0], month: c[1], day: c[2],
            perihelionJD: key,
            daysFromPerihelion: d,
            noteKey: c[5]
          });
        }
      }
    });
  }

  function lookupComet(jd) {
    const key = Math.floor(jd + 0.5);
    return cometMap.get(key) || null;
  }


  // ===== HISTORICAL SUPERNOVAE =====
  // Naked-eye supernovae visible from Middle East / Europe
  // [year, month, day, id, constellation, peakMag, durationMonths, noteKey]

  const SUPERNOVAE_RAW = [
    [185, 12, 7, 'SN185', 'Centaurus', -8, 8, 'sn185'],
    [386, 4, 1, 'SN386', 'Sagittarius', -2, 3, 'sn386'],
    [393, 2, 1, 'SN393', 'Scorpius', -1, 8, 'sn393'],
    [1006, 4, 30, 'SN1006', 'Lupus', -7.5, 18, 'sn1006'],
    [1054, 7, 4, 'SN1054', 'Taurus', -6, 22, 'sn1054'],
    [1181, 8, 4, 'SN1181', 'Cassiopeia', -1, 6, 'sn1181'],
    [1572, 11, 11, 'SN1572', 'Cassiopeia', -4, 16, 'sn1572'],
    [1604, 10, 9, 'SN1604', 'Ophiuchus', -2.5, 12, 'sn1604'],
  ];

  // Build supernova lookup: map JDN range (first sighting + duration) to SN data
  const snMap = new Map();

  function initSupernovae() {
    SUPERNOVAE_RAW.forEach(s => {
      const jd = Cal.julianToJD(s[0], s[1], s[2]);
      const key = Math.floor(jd + 0.5);
      const durationDays = s[6] * 30; // approx months to days
      for (let d = 0; d <= durationDays; d++) {
        const k = key + d;
        if (!snMap.has(k)) {
          snMap.set(k, {
            id: s[3],
            year: s[0], month: s[1], day: s[2],
            constellation: s[4],
            peakMag: s[5],
            durationMonths: s[6],
            daysSinceFirst: d,
            noteKey: s[7]
          });
        }
      }
    });
  }

  function lookupSupernova(jd) {
    const key = Math.floor(jd + 0.5);
    return snMap.get(key) || null;
  }


  // ===== PLANETARY CONJUNCTIONS =====
  // Great conjunctions (Jupiter-Saturn) and other notable conjunctions
  // [year, month, day, planet1, planet2, separationArcmin, noteKey]

  const CONJUNCTIONS_RAW = [
    // "Star of Bethlehem" candidates
    [-7, 5, 29, 'jupiter', 'saturn', 60, 'bethlehem_m7'],
    [-7, 10, 1, 'jupiter', 'saturn', 60, null],
    [-7, 12, 5, 'jupiter', 'saturn', 60, null],
    [-2, 6, 17, 'jupiter', 'venus', 6, 'bethlehem_m2'],
    // Great conjunctions (Jupiter-Saturn, selected)
    [34, 11, 17, 'jupiter', 'saturn', 67, null],
    [54, 3, 5, 'jupiter', 'saturn', 8, null],
    [94, 9, 22, 'jupiter', 'saturn', 90, null],
    [154, 5, 30, 'jupiter', 'saturn', 12, null],
    [194, 12, 3, 'jupiter', 'saturn', 102, null],
    [214, 4, 15, 'jupiter', 'saturn', 65, null],
    [254, 10, 15, 'jupiter', 'saturn', 67, null],
    [274, 2, 18, 'jupiter', 'saturn', 48, null],
    [313, 4, 18, 'jupiter', 'saturn', 33, null],
    [333, 6, 15, 'jupiter', 'saturn', 92, null],
    [372, 10, 12, 'jupiter', 'saturn', 18, null],
    [411, 12, 16, 'jupiter', 'saturn', 108, null],
    [431, 4, 28, 'jupiter', 'saturn', 72, null],
    [452, 3, 6, 'jupiter', 'saturn', 22, null],
    [471, 8, 26, 'jupiter', 'saturn', 78, null],
    [531, 2, 22, 'jupiter', 'saturn', 30, null],
    [551, 6, 8, 'jupiter', 'saturn', 98, null],
    [571, 10, 5, 'jupiter', 'saturn', 60, null],
    [590, 12, 12, 'jupiter', 'saturn', 48, null],
    [610, 4, 22, 'jupiter', 'saturn', 72, null],
    [650, 10, 30, 'jupiter', 'saturn', 82, null],
    [670, 3, 6, 'jupiter', 'saturn', 50, null],
    [709, 5, 1, 'jupiter', 'saturn', 15, null],
    [729, 7, 14, 'jupiter', 'saturn', 96, null],
    [769, 1, 9, 'jupiter', 'saturn', 42, null],
    [789, 5, 15, 'jupiter', 'saturn', 72, null],
    [828, 7, 18, 'jupiter', 'saturn', 12, null],
    [848, 11, 28, 'jupiter', 'saturn', 105, null],
    [868, 4, 8, 'jupiter', 'saturn', 62, null],
    [888, 6, 18, 'jupiter', 'saturn', 48, null],
    [928, 12, 10, 'jupiter', 'saturn', 30, null],
    [947, 8, 15, 'jupiter', 'saturn', 38, null],
    [967, 4, 18, 'jupiter', 'saturn', 72, null],
    [1007, 6, 22, 'jupiter', 'saturn', 55, null],
    [1027, 10, 30, 'jupiter', 'saturn', 80, null],
    [1047, 3, 8, 'jupiter', 'saturn', 52, null],
    [1067, 5, 14, 'jupiter', 'saturn', 40, null],
    [1086, 11, 22, 'jupiter', 'saturn', 100, null],
    [1107, 1, 12, 'jupiter', 'saturn', 18, null],
    [1146, 7, 22, 'jupiter', 'saturn', 85, null],
    [1166, 3, 14, 'jupiter', 'saturn', 62, null],
    [1186, 5, 22, 'jupiter', 'saturn', 48, null],
    [1206, 12, 8, 'jupiter', 'saturn', 108, null],
    [1226, 4, 16, 'jupiter', 'saturn', 70, null],
    [1246, 6, 28, 'jupiter', 'saturn', 40, null],
    [1265, 9, 8, 'jupiter', 'saturn', 14, null],
    [1285, 12, 25, 'jupiter', 'saturn', 108, null],
    [1306, 5, 2, 'jupiter', 'saturn', 72, null],
    [1345, 7, 6, 'jupiter', 'saturn', 22, null],
    [1365, 11, 14, 'jupiter', 'saturn', 96, null],
    [1385, 3, 22, 'jupiter', 'saturn', 58, null],
    [1405, 5, 30, 'jupiter', 'saturn', 44, null],
    [1425, 12, 18, 'jupiter', 'saturn', 102, null],
    [1444, 8, 12, 'jupiter', 'saturn', 28, null],
    [1464, 4, 8, 'jupiter', 'saturn', 68, null],
    [1484, 6, 18, 'jupiter', 'saturn', 48, null],
    // Notable non-Jupiter-Saturn conjunctions
    [710, 5, 18, 'jupiter', 'venus', 8, null],
    [1170, 9, 12, 'jupiter', 'mars', 5, null],
  ];

  const conjMap = new Map();

  function initConjunctions() {
    CONJUNCTIONS_RAW.forEach(c => {
      const jd = Cal.julianToJD(c[0], c[1], c[2]);
      const key = Math.floor(jd + 0.5);
      // Visible window: +/- 14 days around closest approach
      for (let d = -14; d <= 14; d++) {
        const k = key + d;
        if (!conjMap.has(k)) {
          conjMap.set(k, {
            year: c[0], month: c[1], day: c[2],
            planet1: c[3], planet2: c[4],
            separation: c[5],
            closestJD: key,
            daysFromClosest: d,
            noteKey: c[6]
          });
        }
      }
    });
  }

  function lookupConjunction(jd) {
    const key = Math.floor(jd + 0.5);
    return conjMap.get(key) || null;
  }


  // ===== PLANET NAME HELPER =====
  function planetName(id, t) {
    const names = t.planetNames || {};
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1);
  }


  // ===== INIT =====
  initComets();
  initSupernovae();
  initConjunctions();

  return {
    moonPhase,
    lookupComet,
    lookupSupernova,
    lookupConjunction,
    planetName
  };
})();
