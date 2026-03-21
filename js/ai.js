// kalkal — AI conversion via Gemini Flash
// Depends on: Cal (hijri.js), I18N (i18n.js)

(() => {
  'use strict';

  const DAILY_LIMIT = 10;
  const STORAGE_KEY_API = 'kalkal-gemini-key';
  const STORAGE_KEY_USAGE = 'kalkal-ai-usage';
  const GEMINI_MODEL = 'gemini-2.0-flash';

  const $ = (sel) => document.querySelector(sel);
  const aiForm = $('#ai-form');
  const aiInput = $('#ai-input');
  const aiSend = $('#ai-send');
  const aiStatus = $('#ai-status');
  const aiResult = $('#ai-result');

  function getLang() {
    return localStorage.getItem('kalkal-lang') || 'en';
  }

  function t(key) {
    return (I18N[getLang()] || I18N.en)[key] || I18N.en[key] || key;
  }

  // ---- API key ----

  function getApiKey() {
    return localStorage.getItem(STORAGE_KEY_API) || '';
  }

  function promptApiKey() {
    const key = prompt(t('aiKeyPrompt'));
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY_API, key.trim());
      return key.trim();
    }
    return '';
  }

  // ---- Rate limiting ----

  function getUsage() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_USAGE) || '{}');
      const today = new Date().toISOString().slice(0, 10);
      if (raw.date !== today) return { date: today, count: 0 };
      return raw;
    } catch {
      return { date: new Date().toISOString().slice(0, 10), count: 0 };
    }
  }

  function incrementUsage() {
    const usage = getUsage();
    usage.count++;
    localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify(usage));
    return usage;
  }

  function canQuery() {
    return getUsage().count < DAILY_LIMIT;
  }

  function updateStatusCounter() {
    const usage = getUsage();
    const remaining = DAILY_LIMIT - usage.count;
    if (remaining <= 3 && remaining > 0) {
      setStatus(remaining + '/' + DAILY_LIMIT + ' ' + t('aiRemaining'), '');
    } else if (remaining <= 0) {
      setStatus(t('aiLimit'), 'error');
    } else {
      setStatus('', '');
    }
  }

  // ---- UI helpers ----

  function setStatus(text, type) {
    aiStatus.textContent = text;
    aiStatus.className = 'ai-status' + (type ? ' ai-status--' + type : '');
  }

  function setLoading(on) {
    aiSend.disabled = on;
    aiInput.disabled = on;
    if (on) setStatus(t('aiLoading'), 'loading');
  }

  function clearAiResult() {
    while (aiResult.firstChild) aiResult.removeChild(aiResult.firstChild);
  }

  function showAiResult(data) {
    clearAiResult();
    const card = document.createElement('div');
    card.className = 'ai-result-card';

    if (data.answer) {
      const answer = document.createElement('p');
      answer.className = 'ai-answer';
      answer.textContent = data.answer;
      card.appendChild(answer);
    }

    if (data.detail) {
      const detail = document.createElement('p');
      detail.className = 'ai-detail';
      detail.textContent = data.detail;
      card.appendChild(detail);
    }

    if (data.source) {
      const source = document.createElement('p');
      source.className = 'ai-source';
      source.textContent = data.source;
      card.appendChild(source);
    }

    aiResult.appendChild(card);
  }

  // ---- Gemini API ----

  const SYSTEM_PROMPT = `You are a calendar conversion assistant for a tool that converts between Gregorian, Julian, and Hijri (Islamic) calendars.

The user will ask about dates — either direct conversions (e.g. "15 Ramadan 1445") or historical events (e.g. "Battle of Hattin", "death of Harun al-Rashid").

Your task:
1. Identify the date(s) involved.
2. Provide the conversion between calendar systems.
3. For historical events, give the commonly accepted date.

IMPORTANT RULES:
- Dates before October 15, 1582 use the Julian calendar (not Gregorian).
- Use the tabular/arithmetic Islamic calendar for Hijri dates.
- The Hijri epoch is July 16, 622 CE (Julian).
- Be concise. Answer in the same language the user writes in.

Respond in this JSON format (no markdown, no code fences):
{
  "answer": "The main date result, e.g. '4 July 1187 (Julian) = 25 Rabīʿ al-Thānī 583 AH'",
  "detail": "Brief context or explanation (1-2 sentences max)",
  "source": "Calendar system note, e.g. 'Julian calendar (pre-1582)' or 'Gregorian calendar'"
}`;

  async function queryGemini(userQuery) {
    const apiKey = getApiKey() || promptApiKey();
    if (!apiKey) return null;

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      GEMINI_MODEL + ':generateContent?key=' + apiKey;

    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [{
        parts: [{ text: userQuery }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 400
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      if (resp.status === 401 || resp.status === 403) {
        localStorage.removeItem(STORAGE_KEY_API);
      }
      throw new Error('API error: ' + resp.status);
    }

    const json = await resp.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response (strip potential markdown fences)
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  }

  // ---- Submit handler ----

  aiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = aiInput.value.trim();
    if (!query) return;

    if (!canQuery()) {
      setStatus(t('aiLimit'), 'error');
      return;
    }

    setLoading(true);
    clearAiResult();

    try {
      const result = await queryGemini(query);
      if (!result) {
        setLoading(false);
        updateStatusCounter();
        return;
      }
      incrementUsage();
      showAiResult(result);
      updateStatusCounter();
    } catch (err) {
      console.error('AI query error:', err);
      setStatus(t('aiError'), 'error');
    } finally {
      setLoading(false);
    }
  });

  // ---- Language-aware placeholder ----

  function updatePlaceholder() {
    aiInput.placeholder = t('aiPlaceholder');
  }

  // Watch for language changes
  const langSwitcher = $('#lang-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', () => {
      setTimeout(updatePlaceholder, 10);
    });
  }

  // ---- Init ----
  updatePlaceholder();
  updateStatusCounter();
})();
