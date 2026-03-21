# kalkal

Konwerter dat gregoriańskich (AD) / juliańskich i islamskich (AH) w formie statycznej strony internetowej.

## Funkcje

- **AD → AH** — konwersja daty dziennej (automatyczne rozpoznanie kalendarza juliańskiego/gregoriańskiego)
- **AH → AD** — konwersja daty hidżri na gregoriańską/juliańską
- **Zakres miesiąca AD** — np. marzec 789 → pokrywające się miesiące hidżri
- **Zakres miesiąca AH** — np. Ramaḍān 172 → odpowiadający okres gregoriański/juliański
- Julian Day Number (JDN) w wynikach
- 4 języki: polski, angielski, arabski (RTL), esperanto
- Transkrypcja ISO 233 (Muḥarram, Ṣafar, Ǧumādā, Šawwāl, Ḏū al-Ḥiǧǧa...)

## Algorytm

Tabularyczny kalendarz islamski (arytmetyczny) z 30-letnim cyklem przestępnym, konwersja przez Julian Day Number. Daty przed 15.10.1582 traktowane jako juliańskie.

Wyniki mogą się różnić o ±1–2 dni od kalendarzy obserwacyjnych (Umm al-Qura, lokalne obserwacje księżyca).

## Użycie

Otwórz `index.html` w przeglądarce. Zero zależności, zero buildu.

```
python3 -m http.server 8000
# → http://localhost:8000
```

## Czcionki

- **Charis SIL** — pełna obsługa znaków transkrypcji ISO 233 (ṯ ḏ ṣ ḍ ṭ ẓ ġ ḫ ǧ š ā ī ū ʿ ʾ)
- **Noto Sans** — interfejs
- **Amiri** — arabski (naskh)

## Źródła referencyjne

- [muqawwim.com](https://www.muqawwim.com/) — konwerter dla historyków Bliskiego Wschodu
- [Tabular Islamic calendar converter (Utrecht)](https://webspace.science.uu.nl/~gent0113/islam/islam_tabcal_converter.htm) — tablice Wüstenfelda
- [pteo.paranoiaworks.mobi](https://pteo.paranoiaworks.mobi/islamic-calendar/) — porównanie tabularyczny vs Umm al-Qura

## Struktura

```
index.html        — strona
css/style.css     — style + RTL
js/hijri.js       — algorytm konwersji (Cal)
js/i18n.js        — tłumaczenia (I18N)
js/app.js         — logika UI
```
