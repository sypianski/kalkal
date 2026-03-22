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
    [17, 2, 15, 'H', 1.005, true, '10017roman'],
    [20, 12, 3, 'H', 1.010, true, '10020roman'],
    [26, 2, 6, 'A', 0.989, true, '10026roman'],
    [29, 11, 24, 'T', 1.022, true, '10029crucifixion'],
    [34, 9, 1, 'A', 0.959, true, '10034roman'],
    [45, 8, 1, 'T', 1.072, true, '10045claudius'],
    [49, 5, 20, 'A', 0.958, true, '10049roman'],
    [59, 4, 30, 'T', 1.019, true, '10059pliny'],
    [71, 3, 20, 'H', 1.007, true, '10071jerusalem'],
    [80, 3, 10, 'A', 0.986, true, '10080roman'],
    [83, 12, 27, 'T', 1.029, true, '10083roman'],

    // === 2nd Century CE ===
    [110, 8, 3, 'A', 0.981, true, '10110roman'],
    [118, 9, 3, 'T', 1.037, true, '10118roman'],
    [121, 7, 2, 'A', 0.967, true, '10121roman'],
    [125, 4, 21, 'H', 1.006, true, '10125roman'],
    [132, 6, 1, 'T', 1.078, true, '10132barkokhba'],
    [135, 4, 1, 'A', 0.946, true, '10135roman'],
    [164, 9, 4, 'A', 0.963, true, '10164roman'],
    [165, 2, 28, 'T', 1.047, true, '10165roman'],
    [172, 10, 5, 'T', 1.020, true, '10172roman'],
    [174, 2, 19, 'T', 1.047, true, '10174roman'],
    [197, 6, 3, 'A', 0.998, true, '10197roman'],

    // === 3rd Century CE ===
    [219, 4, 2, 'T', 1.063, true, '10219elagabalus'],
    [247, 3, 24, 'T', 1.054, true, '10247rome'],
    [251, 7, 6, 'A', 0.986, true, '10251roman'],
    [262, 6, 4, 'A', 0.969, true, '10262roman'],
    [284, 4, 3, 'A', 0.998, true, '10284roman'],
    [301, 4, 25, 'T', 1.053, true, '10301roman'],

    // === 4th Century CE ===
    [320, 10, 18, 'T', 1.026, true, '10320roman'],
    [334, 7, 17, 'A', 0.976, true, '10334roman'],
    [338, 5, 6, 'A', 0.995, true, '10338roman'],
    [345, 6, 16, 'T', 1.081, true, '10345constantius'],
    [349, 4, 4, 'A', 0.954, true, '10349roman'],
    [364, 6, 16, 'T', 1.057, true, '10364julian'],
    [371, 7, 28, 'T', 1.036, true, '10371roman'],
    [378, 9, 8, 'A', 0.932, true, '10378roman'],
    [381, 1, 12, 'A', 0.926, true, '10381roman'],
    [388, 8, 18, 'A', 0.976, true, '10388roman'],
    [393, 11, 20, 'T', 1.037, true, '10393theon'],
    [399, 7, 19, 'T', 1.076, true, '10399arcadius'],

    // === 5th Century CE ===
    [402, 11, 11, 'T', 1.040, true, '10402stilicho'],
    [410, 6, 18, 'A', 0.984, true, '10410roman'],
    [418, 7, 19, 'T', 1.046, true, '10418theon'],
    [425, 3, 6, 'A', 0.989, true, '10425roman'],
    [432, 4, 16, 'T', 1.073, true, '10432ephesus'],
    [433, 9, 29, 'A', 0.955, true, '10433roman'],
    [435, 2, 14, 'A', 0.929, true, '10435roman'],
    [456, 12, 13, 'T', 1.034, true, '10456roman'],
    [464, 7, 20, 'A', 0.969, true, '10464roman'],
    [472, 8, 20, 'T', 1.030, true, '10472roman'],
    [484, 1, 14, 'T', 1.037, true, '10484proclus'],
    [486, 5, 19, 'T', 1.081, true, '10486odoacer'],
    [487, 11, 1, 'A', 0.957, true, '10487roman'],

    // === 6th Century CE ===
    [512, 6, 29, 'T', 1.042, true, '10512byzantine'],
    [534, 4, 29, 'A', 0.944, true, '10534byzantine'],
    [536, 9, 1, 'A', 0.947, true, '10536byzantine'],
    [538, 2, 15, 'T', 1.041, true, '10538byzantine'],
    [540, 6, 20, 'T', 1.080, true, '10540justinian'],
    [541, 12, 3, 'A', 0.963, true, '10541byzantine'],
    [547, 2, 6, 'T', 1.033, true, '10547byzantine'],
    [550, 11, 24, 'A', 0.979, true, '10550byzantine'],
    [559, 6, 21, 'T', 1.049, true, '10559byzantine'],
    [562, 4, 19, 'A', 0.968, true, '10562byzantine'],
    [563, 10, 3, 'A', 0.944, true, '10563byzantine'],
    [573, 3, 19, 'T', 1.066, true, '10573sassanid'],
    [590, 10, 4, 'A', 0.930, true, '10590arabia'],
    [592, 3, 19, 'T', 1.047, true, '10592byzantine'],

    // === 7th Century CE ===
    [601, 3, 10, 'T', 1.033, true, '10601byzantine'],
    [604, 12, 26, 'A', 0.988, true, '10604byzantine'],
    [606, 6, 11, 'A', 0.948, true, '10606byzantine'],
    [617, 11, 4, 'A', 0.931, true, '10617byzantine'],
    [627, 4, 21, 'T', 1.076, true, '10627nineveh'],
    [632, 1, 27, 'A', 0.984, true, '10632ibrahim'],
    [644, 11, 5, 'A', 0.918, true, '10644byzantine'],
    [646, 4, 21, 'T', 1.050, true, '10646conquest'],
    [659, 1, 28, 'H', 1.002, true, '10659umayyad'],
    [671, 12, 7, 'A', 0.924, true, '10671umayyad'],
    [678, 7, 24, 'A', 0.946, true, '10678umayyad'],
    [686, 2, 28, 'H', 1.003, true, '10686umayyad'],
    [692, 4, 22, 'A', 0.977, true, '10692umayyad'],
    [693, 10, 5, 'T', 1.052, true, '10693umayyad'],
    [698, 12, 8, 'A', 0.912, true, '10698umayyad'],

    // === 8th Century CE ===
    [718, 6, 3, 'T', 1.046, true, '10718constantinople'],
    [725, 7, 14, 'T', 1.054, true, '10725bede'],
    [726, 1, 8, 'A', 0.922, true, '10726umayyad'],
    [733, 8, 14, 'A', 0.978, true, '10733umayyad'],
    [740, 4, 1, 'T', 1.023, true, '10740umayyad'],
    [747, 11, 7, 'T', 1.042, true, '10747umayyad'],
    [753, 1, 9, 'A', 0.912, true, '10753abbasid'],
    [772, 7, 5, 'T', 1.035, true, '10772abbasid'],
    [779, 8, 16, 'T', 1.054, true, '10779abbasid'],
    [780, 2, 10, 'A', 0.926, true, '10780abbasid'],
    [787, 9, 16, 'A', 0.980, true, '10787abbasid'],

    // === 9th Century CE ===
    [809, 7, 16, 'A', 0.968, true, '10809harun'],
    [810, 11, 30, 'T', 1.014, true, '10810abbasid'],
    [812, 5, 14, 'T', 1.046, true, '10812charlemagne'],
    [819, 6, 26, 'A', 0.950, true, '10819abbasid'],
    [826, 8, 7, 'T', 1.018, true, '10826abbasid'],
    [833, 9, 17, 'T', 1.051, true, '10833mamun'],
    [834, 3, 14, 'A', 0.933, true, '10834abbasid'],
    [840, 5, 5, 'T', 1.076, true, '10840louis'],
    [841, 10, 18, 'A', 0.981, true, '10841abbasid'],
    [862, 3, 4, 'A', 0.959, true, '10862abbasid'],
    [866, 6, 16, 'T', 1.057, true, '10866abbasid'],
    [891, 8, 8, 'A', 0.946, true, '10891abbasid'],
    [892, 2, 2, 'T', 1.032, true, '10892abbasid'],

    // === 10th Century CE ===
    [906, 4, 26, 'A', 0.944, true, '10906abbasid'],
    [913, 6, 7, 'T', 1.035, true, '10913abbasid'],
    [916, 4, 5, 'A', 0.975, true, '10916abbasid'],
    [920, 7, 18, 'T', 1.062, true, '10920romanos'],
    [938, 2, 3, 'A', 0.958, true, '10938abbasid'],
    [939, 7, 19, 'T', 1.075, true, '10939byzantine'],
    [946, 3, 6, 'T', 1.034, true, '10946abbasid'],
    [953, 4, 16, 'T', 1.042, true, '10953abbasid'],
    [961, 5, 17, 'A', 0.975, true, '10961fatimid'],
    [968, 12, 22, 'T', 1.030, true, '10968biruni'],
    [977, 12, 13, 'T', 1.044, true, '10977abbasid'],
    [992, 3, 7, 'A', 0.958, true, '10992abbasid'],
    [993, 8, 20, 'T', 1.065, true, '10993hakim'],
    [1000, 4, 7, 'T', 1.035, true, '11000millennium'],

    // === 11th Century CE ===
    [1007, 5, 19, 'T', 1.057, true, '11007seljuk'],
    [1033, 6, 29, 'A', 0.993, true, '11033crucifixion'],
    [1039, 8, 22, 'A', 0.998, true, '11039seljuk'],
    [1044, 11, 22, 'A', 0.921, true, '11044seljuk'],
    [1054, 5, 10, 'T', 1.032, true, '11054schism'],
    [1079, 7, 1, 'T', 1.066, true, '11079khayyam'],
    [1084, 10, 2, 'A', 0.989, true, '11084seljuk'],
    [1087, 8, 1, 'A', 1.000, true, '11087seljuk'],
    [1093, 9, 23, 'A', 0.978, true, '11093seljuk'],
    [1098, 12, 25, 'A', 0.926, true, '11098crusade'],

    // === 12th Century CE ===
    [1113, 3, 19, 'T', 1.060, true, '11113crusader'],
    [1119, 5, 11, 'A', 0.948, true, '11119crusader'],
    [1133, 8, 2, 'T', 1.065, true, '11133henry'],
    [1147, 10, 26, 'A', 0.960, true, '11147crusade'],
    [1153, 1, 26, 'A', 0.937, true, '11153crusader'],
    [1162, 1, 17, 'A', 0.950, true, '11162crusader'],
    [1163, 7, 3, 'A', 0.962, true, '11163crusader'],
    [1176, 4, 11, 'T', 1.063, true, '11176byzantine'],
    [1178, 9, 13, 'T', 1.050, true, '11178crusader'],
    [1187, 9, 4, 'T', 1.059, true, '11187hattin'],

    // === 13th Century CE ===
    [1201, 11, 27, 'A', 0.946, true, '11201crusader'],
    [1207, 2, 28, 'A', 0.953, true, '11207crusader'],
    [1213, 4, 22, 'T', 1.024, true, '11213crusader'],
    [1216, 2, 19, 'A', 0.964, true, '11216crusader'],
    [1228, 12, 28, 'A', 0.956, true, '11228crusader'],
    [1230, 5, 14, 'T', 1.060, true, '11230damascus'],
    [1232, 10, 15, 'T', 1.047, true, '11232crusader'],
    [1239, 6, 3, 'T', 1.077, true, '11239ayyubid'],
    [1241, 10, 6, 'T', 1.049, true, '11241mongols'],
    [1255, 12, 30, 'A', 0.939, true, '11255mamluk'],
    [1261, 4, 1, 'A', 0.972, true, '11261palaiologos'],
    [1267, 5, 25, 'T', 1.018, true, '11267mamluk'],
    [1283, 1, 30, 'A', 0.953, true, '11283mamluk'],
    [1290, 9, 5, 'A', 0.942, true, '11290mamluk'],
    [1293, 7, 5, 'T', 1.073, true, '11293acre'],
    [1300, 8, 15, 'H', 1.012, true, '11300mamluk'],

    // === 14th Century CE ===
    [1307, 4, 3, 'T', 1.050, true, '11307mamluk'],
    [1310, 1, 31, 'A', 0.936, true, '11310ilkhanid'],
    [1315, 5, 4, 'A', 0.991, true, '11315mamluk'],
    [1331, 11, 30, 'T', 1.038, true, '11331mamluk'],
    [1337, 3, 3, 'A', 0.954, true, '11337mamluk'],
    [1354, 9, 17, 'H', 1.012, true, '11354ottoman'],
    [1361, 5, 5, 'T', 1.064, true, '11361adrianople'],
    [1376, 7, 17, 'A', 0.953, true, '11376mamluk'],
    [1384, 8, 17, 'A', 1.000, true, '11384mamluk'],
    [1386, 1, 1, 'T', 1.037, true, '11386mamluk'],
    [1387, 6, 16, 'H', 1.010, true, '11387mamluk'],
    [1391, 4, 5, 'A', 0.957, true, '11391mamluk'],

    // === 15th Century CE ===
    [1419, 3, 26, 'A', 0.938, true, '11419ottoman'],
    [1431, 2, 12, 'T', 1.053, true, '11431murad'],
    [1434, 6, 7, 'T', 1.074, true, '11434ottoman'],
    [1438, 9, 19, 'A', 0.983, true, '11438ottoman'],
    [1448, 8, 29, 'A', 0.939, true, '11453constantinople'],
    [1463, 5, 18, 'A', 0.958, true, '11463ottoman'],
    [1478, 7, 29, 'T', 1.068, true, '11478mehmed']
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
