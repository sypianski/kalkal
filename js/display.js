// Tryb wyświetlania: standardowy albo e-ink (css/eink.css) oraz motyw jasny/ciemny.
// Ładowany synchronnie w <head> przed CSS, żeby atrybut był ustawiony przed
// pierwszym malowaniem (inaczej na e-ink widać migotanie przy przeładowaniu).
//
// Wybór użytkownika: localStorage 'kalkal-display' = 'eink' | 'normal'.
// Bez wyboru: e-ink, jeśli przeglądarka zgłasza wolny ekran (update: slow).
// ?eink=1 / ?eink=0 w adresie zapisuje wybór — wygodne na czytniku, gdzie
// klikanie po ustawieniach jest uciążliwe.
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
