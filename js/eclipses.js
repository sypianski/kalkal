// kalkal — Solar eclipse database for the Middle East region (1–1500 CE)
// Sources: NASA Five Millennium Canon of Solar Eclipses, historical chronicles
// All dates are Julian calendar. JDN computed at init from Cal.julianToJD.

const Eclipses = (() => {
  'use strict';

  // Eclipse data: [year, month, day, type, magnitude, notable, noteKey]
  // type: 'T'=total, 'A'=annular, 'H'=hybrid
  // notable: true for historically documented eclipses
  // noteKey: i18n key for notable descriptions (null if not notable)
  const RAW = [
    // === 1st Century CE ===
    [17, 2, 15, 'H', 1.005, false, null],
    [20, 12, 3, 'H', 1.010, false, null],
    [26, 2, 6, 'A', 0.989, false, null],
    [29, 11, 24, 'T', 1.022, true, 'crucifixion29'],
    [34, 9, 1, 'A', 0.959, false, null],
    [45, 8, 1, 'T', 1.072, true, 'claudius45'],
    [49, 5, 20, 'A', 0.958, false, null],
    [59, 4, 30, 'T', 1.019, true, 'pliny59'],
    [71, 3, 20, 'H', 1.007, true, 'jerusalem71'],
    [80, 3, 10, 'A', 0.986, false, null],
    [83, 12, 27, 'T', 1.029, false, null],

    // === 2nd Century CE ===
    [110, 8, 3, 'A', 0.981, false, null],
    [118, 9, 3, 'T', 1.037, false, null],
    [121, 7, 2, 'A', 0.967, false, null],
    [125, 4, 21, 'H', 1.006, false, null],
    [132, 6, 1, 'T', 1.078, true, 'barkokhba132'],
    [135, 4, 1, 'A', 0.946, false, null],
    [164, 9, 4, 'A', 0.963, false, null],
    [165, 2, 28, 'T', 1.047, false, null],
    [172, 10, 5, 'T', 1.020, false, null],
    [174, 2, 19, 'T', 1.047, false, null],
    [197, 6, 3, 'A', 0.998, false, null],

    // === 3rd Century CE ===
    [219, 4, 2, 'T', 1.063, true, 'elagabalus219'],
    [247, 3, 24, 'T', 1.054, true, 'rome247'],
    [251, 7, 6, 'A', 0.986, false, null],
    [262, 6, 4, 'A', 0.969, false, null],
    [284, 4, 3, 'A', 0.998, false, null],
    [301, 4, 25, 'T', 1.053, false, null],

    // === 4th Century CE ===
    [320, 10, 18, 'T', 1.026, false, null],
    [334, 7, 17, 'A', 0.976, false, null],
    [338, 5, 6, 'A', 0.995, false, null],
    [345, 6, 16, 'T', 1.081, true, 'constantius345'],
    [349, 4, 4, 'A', 0.954, false, null],
    [364, 6, 16, 'T', 1.057, true, 'julian364'],
    [371, 7, 28, 'T', 1.036, false, null],
    [378, 9, 8, 'A', 0.932, false, null],
    [381, 1, 12, 'A', 0.926, false, null],
    [388, 8, 18, 'A', 0.976, false, null],
    [393, 11, 20, 'T', 1.037, true, 'theon393'],
    [399, 7, 19, 'T', 1.076, true, 'arcadius399'],

    // === 5th Century CE ===
    [402, 11, 11, 'T', 1.040, true, 'stilicho402'],
    [410, 6, 18, 'A', 0.984, false, null],
    [418, 7, 19, 'T', 1.046, true, 'theon418'],
    [425, 3, 6, 'A', 0.989, false, null],
    [432, 4, 16, 'T', 1.073, true, 'ephesus432'],
    [433, 9, 29, 'A', 0.955, false, null],
    [435, 2, 14, 'A', 0.929, false, null],
    [456, 12, 13, 'T', 1.034, false, null],
    [464, 7, 20, 'A', 0.969, false, null],
    [472, 8, 20, 'T', 1.030, false, null],
    [484, 1, 14, 'T', 1.037, true, 'proclus484'],
    [486, 5, 19, 'T', 1.081, true, 'odoacer486'],
    [487, 11, 1, 'A', 0.957, false, null],

    // === 6th Century CE ===
    [512, 6, 29, 'T', 1.042, false, null],
    [534, 4, 29, 'A', 0.944, false, null],
    [536, 9, 1, 'A', 0.947, false, null],
    [538, 2, 15, 'T', 1.041, false, null],
    [540, 6, 20, 'T', 1.080, true, 'justinian540'],
    [541, 12, 3, 'A', 0.963, false, null],
    [547, 2, 6, 'T', 1.033, false, null],
    [550, 11, 24, 'A', 0.979, false, null],
    [559, 6, 21, 'T', 1.049, false, null],
    [562, 4, 19, 'A', 0.968, false, null],
    [563, 10, 3, 'A', 0.944, false, null],
    [573, 3, 19, 'T', 1.066, true, 'sassanid573'],
    [590, 10, 4, 'A', 0.930, true, 'arabia590'],
    [592, 3, 19, 'T', 1.047, false, null],

    // === 7th Century CE ===
    [601, 3, 10, 'T', 1.033, false, null],
    [604, 12, 26, 'A', 0.988, false, null],
    [606, 6, 11, 'A', 0.948, false, null],
    [617, 11, 4, 'A', 0.931, false, null],
    [627, 4, 21, 'T', 1.076, true, 'nineveh627'],
    [632, 1, 27, 'A', 0.984, true, 'ibrahim632'],
    [644, 11, 5, 'A', 0.918, false, null],
    [646, 4, 21, 'T', 1.050, true, 'conquest646'],
    [659, 1, 28, 'H', 1.002, false, null],
    [671, 12, 7, 'A', 0.924, false, null],
    [678, 7, 24, 'A', 0.946, false, null],
    [686, 2, 28, 'H', 1.003, false, null],
    [692, 4, 22, 'A', 0.977, false, null],
    [693, 10, 5, 'T', 1.052, true, 'umayyad693'],
    [698, 12, 8, 'A', 0.912, false, null],

    // === 8th Century CE ===
    [718, 6, 3, 'T', 1.046, true, 'constantinople718'],
    [725, 7, 14, 'T', 1.054, true, 'bede725'],
    [726, 1, 8, 'A', 0.922, false, null],
    [733, 8, 14, 'A', 0.978, false, null],
    [740, 4, 1, 'T', 1.023, false, null],
    [747, 11, 7, 'T', 1.042, false, null],
    [753, 1, 9, 'A', 0.912, false, null],
    [772, 7, 5, 'T', 1.035, false, null],
    [779, 8, 16, 'T', 1.054, false, null],
    [780, 2, 10, 'A', 0.926, false, null],
    [787, 9, 16, 'A', 0.980, false, null],

    // === 9th Century CE ===
    [809, 7, 16, 'A', 0.968, true, 'harun809'],
    [810, 11, 30, 'T', 1.014, false, null],
    [812, 5, 14, 'T', 1.046, true, 'charlemagne812'],
    [819, 6, 26, 'A', 0.950, false, null],
    [826, 8, 7, 'T', 1.018, false, null],
    [833, 9, 17, 'T', 1.051, true, 'mamun833'],
    [834, 3, 14, 'A', 0.933, false, null],
    [840, 5, 5, 'T', 1.076, true, 'louis840'],
    [841, 10, 18, 'A', 0.981, false, null],
    [862, 3, 4, 'A', 0.959, false, null],
    [866, 6, 16, 'T', 1.057, false, null],
    [891, 8, 8, 'A', 0.946, true, 'abbasid891'],
    [892, 2, 2, 'T', 1.032, false, null],

    // === 10th Century CE ===
    [906, 4, 26, 'A', 0.944, false, null],
    [913, 6, 7, 'T', 1.035, false, null],
    [916, 4, 5, 'A', 0.975, false, null],
    [920, 7, 18, 'T', 1.062, true, 'romanos920'],
    [938, 2, 3, 'A', 0.958, false, null],
    [939, 7, 19, 'T', 1.075, true, 'byzantine939'],
    [946, 3, 6, 'T', 1.034, false, null],
    [953, 4, 16, 'T', 1.042, false, null],
    [961, 5, 17, 'A', 0.975, true, 'fatimid961'],
    [968, 12, 22, 'T', 1.030, true, 'biruni968'],
    [977, 12, 13, 'T', 1.044, false, null],
    [992, 3, 7, 'A', 0.958, false, null],
    [993, 8, 20, 'T', 1.065, true, 'hakim993'],
    [1000, 4, 7, 'T', 1.035, true, 'millennium1000'],

    // === 11th Century CE ===
    [1007, 5, 19, 'T', 1.057, false, null],
    [1033, 6, 29, 'A', 0.993, true, 'crucifixion1033'],
    [1039, 8, 22, 'A', 0.998, false, null],
    [1044, 11, 22, 'A', 0.921, false, null],
    [1054, 5, 10, 'T', 1.032, true, 'schism1054'],
    [1079, 7, 1, 'T', 1.066, true, 'khayyam1079'],
    [1084, 10, 2, 'A', 0.989, false, null],
    [1087, 8, 1, 'A', 1.000, false, null],
    [1093, 9, 23, 'A', 0.978, false, null],
    [1098, 12, 25, 'A', 0.926, true, 'crusade1098'],

    // === 12th Century CE ===
    [1113, 3, 19, 'T', 1.060, true, 'crusader1113'],
    [1119, 5, 11, 'A', 0.948, false, null],
    [1133, 8, 2, 'T', 1.065, true, 'henry1133'],
    [1147, 10, 26, 'A', 0.960, true, 'crusade1147'],
    [1153, 1, 26, 'A', 0.937, false, null],
    [1162, 1, 17, 'A', 0.950, false, null],
    [1163, 7, 3, 'A', 0.962, false, null],
    [1176, 4, 11, 'T', 1.063, true, 'byzantine1176'],
    [1178, 9, 13, 'T', 1.050, false, null],
    [1187, 9, 4, 'T', 1.059, true, 'hattin1187'],

    // === 13th Century CE ===
    [1201, 11, 27, 'A', 0.946, false, null],
    [1207, 2, 28, 'A', 0.953, false, null],
    [1213, 4, 22, 'T', 1.024, false, null],
    [1216, 2, 19, 'A', 0.964, false, null],
    [1228, 12, 28, 'A', 0.956, false, null],
    [1230, 5, 14, 'T', 1.060, true, 'damascus1230'],
    [1232, 10, 15, 'T', 1.047, false, null],
    [1239, 6, 3, 'T', 1.077, true, 'ayyubid1239'],
    [1241, 10, 6, 'T', 1.049, true, 'mongols1241'],
    [1255, 12, 30, 'A', 0.939, false, null],
    [1261, 4, 1, 'A', 0.972, true, 'palaiologos1261'],
    [1267, 5, 25, 'T', 1.018, false, null],
    [1283, 1, 30, 'A', 0.953, false, null],
    [1290, 9, 5, 'A', 0.942, false, null],
    [1293, 7, 5, 'T', 1.073, true, 'acre1293'],
    [1300, 8, 15, 'H', 1.012, false, null],

    // === 14th Century CE ===
    [1307, 4, 3, 'T', 1.050, false, null],
    [1310, 1, 31, 'A', 0.936, true, 'ilkhanid1310'],
    [1315, 5, 4, 'A', 0.991, false, null],
    [1331, 11, 30, 'T', 1.038, false, null],
    [1337, 3, 3, 'A', 0.954, false, null],
    [1354, 9, 17, 'H', 1.012, true, 'ottoman1354'],
    [1361, 5, 5, 'T', 1.064, true, 'adrianople1361'],
    [1376, 7, 17, 'A', 0.953, false, null],
    [1384, 8, 17, 'A', 1.000, false, null],
    [1386, 1, 1, 'T', 1.037, false, null],
    [1387, 6, 16, 'H', 1.010, false, null],
    [1391, 4, 5, 'A', 0.957, false, null],

    // === 15th Century CE ===
    [1419, 3, 26, 'A', 0.938, false, null],
    [1431, 2, 12, 'T', 1.053, true, 'murad1431'],
    [1434, 6, 7, 'T', 1.074, true, 'ottoman1434'],
    [1438, 9, 19, 'A', 0.983, false, null],
    [1448, 8, 29, 'A', 0.939, true, 'constantinople1453'],
    [1463, 5, 18, 'A', 0.958, false, null],
    [1478, 7, 29, 'T', 1.068, true, 'mehmed1478']
  ];

  // Build lookup map keyed by integer JDN
  const map = new Map();

  function init() {
    RAW.forEach(e => {
      const jd = Cal.julianToJD(e[0], e[1], e[2]);
      const key = Math.floor(jd + 0.5);
      map.set(key, {
        year: e[0], month: e[1], day: e[2],
        type: e[3],
        mag: e[4],
        notable: e[5],
        noteKey: e[6]
      });
    });
  }

  function lookup(jd) {
    const key = Math.floor(jd + 0.5);
    return map.get(key) || null;
  }

  function typeLabel(type, t) {
    const labels = t.eclipseTypes || {};
    return labels[type] || type;
  }

  // Initialize when script loads (Cal must be loaded first)
  init();

  return { lookup, typeLabel };
})();
