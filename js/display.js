// Tryb wyświetlania: standardowy albo e-ink (css/eink.css) oraz motyw jasny/ciemny.
// Ładowany synchronnie w <head> przed CSS, żeby atrybut był ustawiony przed
// pierwszym malowaniem (inaczej na e-ink widać migotanie przy przeładowaniu).
//
// Wybór użytkownika: localStorage 'kalkal-display' = 'eink' | 'normal'.
// Bez wyboru: e-ink, jeśli przeglądarka zgłasza wolny ekran (update: slow).
// ?eink=1 / ?eink=0 w adresie zapisuje wybór — wygodne na czytniku, gdzie
// klikanie po ustawieniach jest uciążliwe.
// Bezpieczny magazyn: localStorage bywa zablokowany (Safari z blokadą ciasteczek, osadzenie w ramce,
// niektóre tryby prywatne) i wtedy już samo odwołanie rzuca wyjątek. Zamiast wywracać całą aplikację,
// przechodzimy na pamięć w obrębie karty (ustawienia nie przetrwają przeładowania, ale wszystko działa).
window.kkStore = (function () {
  var mem = {};
  var ok = true;
  try { localStorage.setItem('__kk', '1'); localStorage.removeItem('__kk'); } catch (e) { ok = false; }
  return {
    get: function (k) {
      if (ok) { try { return localStorage.getItem(k); } catch (e) { /* spadamy do pamięci */ } }
      return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
    },
    set: function (k, v) {
      if (ok) { try { localStorage.setItem(k, v); return; } catch (e) { /* np. brak miejsca: pamięć */ } }
      mem[k] = String(v);
    },
    remove: function (k) {
      if (ok) { try { localStorage.removeItem(k); } catch (e) {} }
      delete mem[k];
    }
  };
})();

(function () {
  var KEY = 'kalkal-display';
  var mode = null;
  try {
    var q = location.search.match(/[?&]eink=([01])\b/);
    if (q) localStorage.setItem(KEY, q[1] === '1' ? 'eink' : 'normal');
    mode = localStorage.getItem(KEY);
  } catch (e) { /* localStorage zablokowany — zostaje autodetekcja */ }
  if (mode !== 'eink' && mode !== 'normal') {
    mode = (window.matchMedia && matchMedia('(update: slow)').matches) ? 'eink' : 'normal';
  }
  if (mode === 'eink') document.documentElement.setAttribute('data-display', 'eink');

  // Motyw: localStorage 'kalkal-theme' = 'light' | 'dark'. Bez wyboru decyduje system
  // (prefers-color-scheme w CSS). E-ink jest zawsze jasny.
  var theme = null;
  try { theme = localStorage.getItem('kalkal-theme'); } catch (e) { /* zostaje motyw systemu */ }
  if (mode === 'eink') theme = 'light';
  if (theme === 'light' || theme === 'dark') document.documentElement.setAttribute('data-theme', theme);
})();
