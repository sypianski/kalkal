// CALENDARS registry and VARIANT_LABELS
// Extracted from app.js for React Native

import { Cal } from './cal';
import { T } from './i18n';

export const VARIANT_LABELS: Record<string, string> = {
  IIc: 'W\u00fcstenfeld',
  IIa: 'East civil',
  IIIa: 'West civil',
  IVa: '\u1e24abash',
  Constantinople: 'Constantinople',
  Alexandrian: 'Alexandrian',
  ChronPasch: 'Chron. Paschale',
  Macedonian: 'Macedonian',
  Babylonian: 'Babylonian',
  Shahenshahi: 'Shahenshahi',
  Qadimi: 'Qadimi',
  Fasli: 'Fasli',
  Proleptic: 'Proleptic Gregorian',
  Civil: 'Julian/Gregorian'
};

export interface CalendarDef {
  id: string;
  variants?: string[];
  defaultVariant?: string;
  _variant?: string;
  toJD(y: number, m: number, d: number): number;
  fromJD(jd: number): { year: number; month: number; day: number };
  monthLength(y: number, m: number): number;
  yearLength(y: number): number;
  isLeap(y: number): boolean;
  monthCount: number;
  monthNames(t: any): string[];
}

export const CALENDARS: Record<string, CalendarDef> = {
  hijri: {
    id: 'hijri',
    variants: ['IIc', 'IIa', 'IIIa', 'IVa'],
    defaultVariant: 'IIc',
    _variant: 'IIc',
    toJD(y, m, d) { return Cal.hijriToJD(y, m, d, this._variant); },
    fromJD(jd) { return Cal.jdToHijri(jd, this._variant); },
    monthLength(y, m) { return Cal.hijriMonthLength(y, m, this._variant); },
    yearLength(y) { return Cal.hijriYearLength(y, this._variant); },
    isLeap(y) { return Cal.isHijriLeapYear(y, this._variant); },
    monthCount: 12,
    monthNames: (t) => t.hijriMonths
  },
  julian: {
    id: 'julian',
    toJD: (y, m, d) => Cal.julianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToJulian(jd),
    monthLength: (y, m) => Cal.julianMonthLength(y, m),
    yearLength: (y) => Cal.isJulianLeapYear(y) ? 366 : 365,
    isLeap: (y) => Cal.isJulianLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  gregorian: {
    id: 'gregorian',
    toJD: (y, m, d) => Cal.civilToJD(y, m, d),
    fromJD: (jd) => Cal.jdToCivil(jd),
    monthLength: (y, m) => {
      const cutoverYear = 1582;
      if (y < cutoverYear || (y === cutoverYear && m < 10)) return Cal.julianMonthLength(y, m);
      if (y === cutoverYear && m === 10) return 21;
      return Cal.gregorianMonthLength(y, m);
    },
    yearLength: (y) => {
      if (y < 1582) return Cal.isJulianLeapYear(y) ? 366 : 365;
      if (y === 1582) return 355;
      return Cal.isGregorianLeapYear(y) ? 366 : 365;
    },
    isLeap: (y) => y < 1582 ? Cal.isJulianLeapYear(y) : Cal.isGregorianLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  coptic: {
    id: 'coptic',
    toJD: (y, m, d) => Cal.copticToJD(y, m, d),
    fromJD: (jd) => Cal.jdToCoptic(jd),
    monthLength: (y, m) => Cal.copticMonthLength(y, m),
    yearLength: (y) => Cal.copticYearLength(y),
    isLeap: (y) => Cal.isCopticLeapYear(y),
    monthCount: 13,
    monthNames: (t) => t.copticMonths
  },
  ethiopian: {
    id: 'ethiopian',
    toJD: (y, m, d) => Cal.ethiopianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToEthiopian(jd),
    monthLength: (y, m) => Cal.ethiopianMonthLength(y, m),
    yearLength: (y) => Cal.ethiopianYearLength(y),
    isLeap: (y) => Cal.isEthiopianLeapYear(y),
    monthCount: 13,
    monthNames: (t) => t.ethiopianMonths
  },
  yazdgerdi: {
    id: 'yazdgerdi',
    variants: ['Shahenshahi', 'Qadimi', 'Fasli'],
    defaultVariant: 'Shahenshahi',
    _variant: 'Shahenshahi',
    toJD(y, m, d) {
      if (this._variant === 'Qadimi') return Cal.qadimiToJD(y, m, d);
      if (this._variant === 'Fasli') return Cal.fasliToJD(y, m, d);
      return Cal.yazdgerdiToJD(y, m, d);
    },
    fromJD(jd) {
      if (this._variant === 'Qadimi') return Cal.jdToQadimi(jd);
      if (this._variant === 'Fasli') return Cal.jdToFasli(jd);
      return Cal.jdToYazdgerdi(jd);
    },
    monthLength(y, m) {
      if (this._variant === 'Qadimi') return Cal.qadimiMonthLength(y, m);
      if (this._variant === 'Fasli') return Cal.fasliMonthLength(y, m);
      return Cal.yazdgerdiMonthLength(y, m);
    },
    yearLength(y) {
      if (this._variant === 'Fasli') return Cal.fasliYearLength(y);
      return Cal.yazdgerdiYearLength();
    },
    isLeap(y) {
      if (this._variant === 'Fasli') return Cal.isFasliLeapYear(y);
      return false;
    },
    monthCount: 13,
    monthNames: (t) => t.persianMonths
  },
  armenian: {
    id: 'armenian',
    toJD: (y, m, d) => Cal.armenianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToArmenian(jd),
    monthLength: (y, m) => Cal.armenianMonthLength(y, m),
    yearLength: () => Cal.armenianYearLength(),
    isLeap: () => false,
    monthCount: 13,
    monthNames: (t) => t.armenianMonths
  },
  solarHijri: {
    id: 'solarHijri',
    toJD: (y, m, d) => Cal.solarHijriToJD(y, m, d),
    fromJD: (jd) => Cal.jdToSolarHijri(jd),
    monthLength: (y, m) => Cal.solarHijriMonthLength(y, m),
    yearLength: (y) => Cal.solarHijriYearLength(y),
    isLeap: (y) => Cal.isSolarHijriLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.persianMonths
  },
  ilkhani: {
    id: 'ilkhani',
    toJD: (y, m, d) => Cal.ilkhaniToJD(y, m, d),
    fromJD: (jd) => Cal.jdToIlkhani(jd),
    monthLength: (y, m) => Cal.ilkhaniMonthLength(y, m),
    yearLength: (y) => Cal.ilkhaniYearLength(y),
    isLeap: (y) => Cal.isIlkhaniLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.persianMonths
  },
  byzantine: {
    id: 'byzantine',
    variants: ['Constantinople', 'Alexandrian', 'ChronPasch'],
    defaultVariant: 'Constantinople',
    _variant: 'Constantinople',
    toJD(y, m, d) {
      if (this._variant === 'Alexandrian') return Cal.alexandrianToJD(y, m, d);
      if (this._variant === 'ChronPasch') return Cal.chronPaschToJD(y, m, d);
      return Cal.byzantineToJD(y, m, d);
    },
    fromJD(jd) {
      if (this._variant === 'Alexandrian') return Cal.jdToAlexandrian(jd);
      if (this._variant === 'ChronPasch') return Cal.jdToChronPasch(jd);
      return Cal.jdToByzantine(jd);
    },
    monthLength(y, m) {
      if (this._variant === 'Alexandrian') return Cal.alexandrianMonthLength(y, m);
      if (this._variant === 'ChronPasch') return Cal.chronPaschMonthLength(y, m);
      return Cal.byzantineMonthLength(y, m);
    },
    yearLength(y) {
      if (this._variant === 'Alexandrian') return Cal.alexandrianYearLength(y);
      if (this._variant === 'ChronPasch') return Cal.chronPaschYearLength(y);
      return Cal.byzantineYearLength(y);
    },
    isLeap(y) {
      if (this._variant === 'Alexandrian') return Cal.isAlexandrianLeapYear(y);
      if (this._variant === 'ChronPasch') return Cal.isChronPaschLeapYear(y);
      return Cal.isByzantineLeapYear(y);
    },
    monthCount: 12,
    monthNames(t) {
      if (this._variant === 'Alexandrian') return t.alexandrianMonths;
      if (this._variant === 'ChronPasch') return t.alexandrianMonths;
      return t.byzantineMonths;
    }
  },
  seleucid: {
    id: 'seleucid',
    variants: ['Macedonian', 'Babylonian'],
    defaultVariant: 'Macedonian',
    _variant: 'Macedonian',
    toJD(y, m, d) {
      return this._variant === 'Babylonian' ? Cal.seleucidBabToJD(y, m, d) : Cal.seleucidToJD(y, m, d);
    },
    fromJD(jd) {
      return this._variant === 'Babylonian' ? Cal.jdToSeleucidBab(jd) : Cal.jdToSeleucid(jd);
    },
    monthLength(y, m) {
      return this._variant === 'Babylonian' ? Cal.seleucidBabMonthLength(y, m) : Cal.seleucidMonthLength(y, m);
    },
    yearLength(y) {
      return this._variant === 'Babylonian' ? Cal.seleucidBabYearLength(y) : Cal.seleucidYearLength(y);
    },
    isLeap(y) {
      return this._variant === 'Babylonian' ? Cal.isSeleucidBabLeapYear(y) : Cal.isSeleucidLeapYear(y);
    },
    monthCount: 12,
    monthNames(t) {
      return this._variant === 'Babylonian' ? t.seleucidBabMonths : t.seleucidMonths;
    }
  },
  syriac: {
    id: 'syriac',
    toJD: (y, m, d) => Cal.syriacToJD(y, m, d),
    fromJD: (jd) => Cal.jdToSyriac(jd),
    monthLength: (y, m) => Cal.syriacMonthLength(y, m),
    yearLength: (y) => Cal.syriacYearLength(y),
    isLeap: (y) => Cal.isSyriacLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.syriacMonths
  },
  rumi: {
    id: 'rumi',
    toJD: (y, m, d) => Cal.rumiToJD(y, m, d),
    fromJD: (jd) => Cal.jdToRumi(jd),
    monthLength: (y, m) => Cal.rumiMonthLength(y, m),
    yearLength: (y) => Cal.rumiYearLength(y),
    isLeap: (y) => Cal.isRumiLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  egyptian: {
    id: 'egyptian',
    toJD: (y, m, d) => Cal.egyptianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToEgyptian(jd),
    monthLength: (y, m) => Cal.egyptianMonthLength(y, m),
    yearLength: () => Cal.egyptianYearLength(),
    isLeap: () => false,
    monthCount: 13,
    monthNames: (t) => t.egyptianMonths
  },
  auc: {
    id: 'auc',
    toJD: (y, m, d) => Cal.aucToJD(y, m, d),
    fromJD: (jd) => Cal.jdToAuc(jd),
    monthLength: (y, m) => Cal.aucMonthLength(y, m),
    yearLength: (y) => Cal.aucYearLength(y),
    isLeap: (y) => Cal.isAucLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  roman: {
    id: 'roman',
    toJD: (y, m, d) => Cal.aucToJD(y, m, d),
    fromJD: (jd) => Cal.jdToAuc(jd),
    monthLength: (y, m) => Cal.aucMonthLength(y, m),
    yearLength: (y) => Cal.aucYearLength(y),
    isLeap: (y) => Cal.isAucLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.romanMonths
  },
  spanish: {
    id: 'spanish',
    toJD: (y, m, d) => Cal.spanishToJD(y, m, d),
    fromJD: (jd) => Cal.jdToSpanish(jd),
    monthLength: (y, m) => Cal.spanishMonthLength(y, m),
    yearLength: (y) => Cal.spanishYearLength(y),
    isLeap: (y) => Cal.isSpanishLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  antiochene: {
    id: 'antiochene',
    toJD: (y, m, d) => Cal.antiocheneToJD(y, m, d),
    fromJD: (jd) => Cal.jdToAntiochene(jd),
    monthLength: (y, m) => Cal.antiocheneMonthLength(y, m),
    yearLength: (y) => Cal.antiocheneYearLength(y),
    isLeap: (y) => Cal.isAntiocheneLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.seleucidMonths
  },
  olympiad: {
    id: 'olympiad',
    toJD: (y, m, d) => Cal.olympiadToJD(y, m, d),
    fromJD: (jd) => Cal.jdToOlympiad(jd),
    monthLength: (y, m) => Cal.olympiadMonthLength(y, m),
    yearLength: (y) => Cal.olympiadYearLength(y),
    isLeap: (y) => Cal.isOlympiadLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  macedonian: {
    id: 'macedonian',
    toJD: (y, m, d) => Cal.macedonianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToMacedonian(jd),
    monthLength: (y, m) => Cal.macedonianMonthLength(y, m),
    yearLength: (y) => Cal.macedonianYearLength(y),
    isLeap: (y) => Cal.isMacedonianLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.macedonianMonths
  },
  hebrew: {
    id: 'hebrew',
    toJD: (y, m, d) => Cal.hebrewToJD(y, m, d),
    fromJD: (jd) => Cal.jdToHebrew(jd),
    monthLength: (y, m) => Cal.hebrewMonthLength(y, m),
    yearLength: (y) => Cal.hebrewYearLength(y),
    isLeap: (y) => Cal.isHebrewLeapYear(y),
    monthCount: 13,
    monthNames: (t) => t.hebrewMonths
  },
  babylonian: {
    id: 'babylonian',
    toJD: (y, m, d) => Cal.babylonianToJD(y, m, d),
    fromJD: (jd) => Cal.jdToBabylonian(jd),
    monthLength: (y, m) => Cal.babylonianMonthLength(y, m),
    yearLength: (y) => Cal.babylonianYearLength(y),
    isLeap: (y) => Cal.isBabylonianLeapYear(y),
    monthCount: 13,
    monthNames: (t) => t.babylonianMonths
  },
  bp: {
    id: 'bp',
    toJD: (y, m, d) => Cal.bpToJD(y, m, d),
    fromJD: (jd) => Cal.jdToBP(jd),
    monthLength: (y, m) => Cal.bpMonthLength(y, m),
    yearLength: (y) => Cal.bpYearLength(y),
    isLeap: (y) => Cal.isBPLeapYear(y),
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  },
  human: {
    id: 'human',
    variants: Cal.HUMAN_VARIANTS,
    defaultVariant: Cal.HUMAN_DEFAULT,
    _variant: Cal.HUMAN_DEFAULT,
    toJD(y, m, d) { return Cal.humanToJD(y, m, d, this._variant); },
    fromJD(jd) { return Cal.jdToHuman(jd, this._variant); },
    monthLength(y, m) { return Cal.humanMonthLength(y, m, this._variant); },
    yearLength(y) { return Cal.humanYearLength(y, this._variant); },
    isLeap(y) { return Cal.isHumanLeapYear(y, this._variant); },
    monthCount: 12,
    monthNames: (t) => t.gregorianMonths
  }
};

export const CALENDAR_GROUPS = [
  { group: 'universal', ids: ['human'] },
  { group: 'christian', ids: ['gregorian', 'julian', 'byzantine', 'spanish'] },
  { group: 'islamic', ids: ['hijri', 'solarHijri', 'rumi'] },
  { group: 'iranian', ids: ['yazdgerdi', 'ilkhani'] },
  { group: 'semitic', ids: ['hebrew', 'syriac', 'antiochene', 'seleucid', 'babylonian'] },
  { group: 'african', ids: ['coptic', 'ethiopian', 'egyptian'] },
  { group: 'grecoRoman', ids: ['roman', 'auc', 'olympiad', 'macedonian'] },
  { group: 'scientific', ids: ['bp'] }
];
