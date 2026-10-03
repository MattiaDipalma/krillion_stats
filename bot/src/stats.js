// Modello dati di docs/data/stats.json e logica di unione dei risultati.
//
// {
//   "version": 1,
//   "updatedAt": "2026-10-03T17:56:00.000Z",
//   "results": [
//     { "puzzle": 80, "player": "Daniel", "score": 285, "date": "2026-10-03",
//       "ts": 1759490640, "grid": "🦐⚪...", "msgId": "3EB0..." }
//   ]
// }
//
// Un giocatore ha al massimo un risultato per puzzle: vale il primo messaggio
// inviato. Se lo stesso messaggio viene modificato su WhatsApp (stesso msgId),
// la versione modificata sostituisce quella vecchia.

export const DATA_VERSION = 1;

export function emptyData() {
  return { version: DATA_VERSION, updatedAt: null, results: [] };
}

/**
 * Normalizza un nome usando la mappa degli alias (confronto senza maiuscole/spazi).
 * @param {string} name
 * @param {Map<string, string>} aliasMap chiavi già normalizzate con aliasKey()
 */
export function resolveName(name, aliasMap) {
  const clean = String(name ?? '')
    .replace(/[​‎‏‪-‮﻿]/g, '')
    .trim();
  return aliasMap?.get(aliasKey(clean)) ?? clean;
}

export function aliasKey(s) {
  const key = String(s ?? '')
    .replace(/[​‎‏‪-‮﻿]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  // "+41 79 123 45 67", "41791234567", "41791234567@s.whatsapp.net" → "41791234567"
  const phone = key.replace(/@s\.whatsapp\.net$/, '');
  if (/^\+?[\d\s().-]{6,}$/.test(phone)) return phone.replace(/\D/g, '');
  return key;
}

/** @param {Record<string, string>} aliases */
export function buildAliasMap(aliases = {}) {
  const map = new Map();
  for (const [from, to] of Object.entries(aliases)) {
    if (typeof to === 'string' && to.trim()) map.set(aliasKey(from), to.trim());
  }
  return map;
}

const keyOf = (r) => `${r.puzzle}\u0000${r.player.toLowerCase()}`;

function sortResults(results) {
  return results.sort(
    (a, b) => b.puzzle - a.puzzle || (a.ts ?? 0) - (b.ts ?? 0) || a.player.localeCompare(b.player),
  );
}

function isValid(r) {
  return (
    r &&
    Number.isSafeInteger(r.puzzle) &&
    r.puzzle > 0 &&
    Number.isSafeInteger(r.score) &&
    r.score >= 0 &&
    typeof r.player === 'string' &&
    r.player.trim() !== ''
  );
}

function clean(r) {
  const out = { puzzle: r.puzzle, player: r.player, score: r.score };
  if (r.date) out.date = r.date;
  if (Number.isFinite(r.ts)) out.ts = r.ts;
  if (r.grid) out.grid = r.grid;
  if (r.msgId) out.msgId = r.msgId;
  return out;
}

/**
 * Unisce nuovi risultati nei dati esistenti. Non modifica `data`.
 *
 * @param {ReturnType<typeof emptyData>} data
 * @param {Array<object>} incoming
 * @param {{ aliasMap?: Map<string, string> }} [opts]
 * @returns {{ data: object, changed: boolean, added: object[], updated: object[] }}
 */
export function mergeResults(data, incoming, { aliasMap } = {}) {
  const base = data && Array.isArray(data.results) ? data : emptyData();
  const before = JSON.stringify(base.results);

  // Riapplica gli alias anche ai dati già salvati: aggiungere un alias
  // sistema lo storico alla prossima scrittura.
  const byKey = new Map();
  const byMsgId = new Map();
  const put = (r) => {
    byKey.set(keyOf(r), r);
    if (r.msgId) byMsgId.set(r.msgId, r);
  };
  const remove = (r) => {
    byKey.delete(keyOf(r));
    if (r.msgId && byMsgId.get(r.msgId) === r) byMsgId.delete(r.msgId);
  };
  const isEarlier = (a, b) => (a.ts ?? Infinity) < (b.ts ?? Infinity);

  for (const old of base.results) {
    if (!isValid(old)) continue;
    const r = clean({ ...old, player: resolveName(old.player, aliasMap) });
    const existing = byKey.get(keyOf(r));
    if (!existing || isEarlier(r, existing)) {
      if (existing) remove(existing);
      put(r);
    }
  }

  const added = [];
  const updated = [];
  for (const raw of incoming) {
    if (!isValid(raw)) continue;
    const r = clean({ ...raw, player: resolveName(raw.player, aliasMap) });

    // Modifica di un messaggio già registrato: sostituisce la vecchia versione.
    const sameMsg = r.msgId ? byMsgId.get(r.msgId) : undefined;
    if (sameMsg) {
      const edited = { ...r, ts: sameMsg.ts ?? r.ts, date: sameMsg.date ?? r.date };
      if (JSON.stringify(clean(edited)) === JSON.stringify(sameMsg)) continue;
      const clash = byKey.get(keyOf(edited));
      remove(sameMsg);
      if (clash && clash !== sameMsg) remove(clash);
      put(clean(edited));
      updated.push(clean(edited));
      continue;
    }

    const existing = byKey.get(keyOf(r));
    if (!existing) {
      put(r);
      added.push(r);
    } else if (isEarlier(r, existing)) {
      remove(existing);
      put(r);
      updated.push(r);
    } else if (!existing.grid && r.grid && existing.score === r.score) {
      // stesso risultato, ma ora abbiamo anche la griglia
      const merged = { ...existing, grid: r.grid };
      remove(existing);
      put(merged);
    }
  }

  const results = sortResults([...byKey.values()]);
  const changed = JSON.stringify(results) !== before;
  return {
    data: {
      version: DATA_VERSION,
      updatedAt: changed ? new Date().toISOString() : (base.updatedAt ?? null),
      results,
    },
    changed,
    added,
    updated,
  };
}

/**
 * JSON con un risultato per riga: file leggibile e diff git puliti.
 */
export function serialize(data) {
  const head = { version: data.version ?? DATA_VERSION, updatedAt: data.updatedAt ?? null };
  const rows = (data.results ?? []).map((r) => '    ' + JSON.stringify(r));
  return (
    '{\n' +
    `  "version": ${JSON.stringify(head.version)},\n` +
    `  "updatedAt": ${JSON.stringify(head.updatedAt)},\n` +
    '  "results": [' +
    (rows.length ? '\n' + rows.join(',\n') + '\n  ' : '') +
    ']\n}\n'
  );
}

export function parseData(text) {
  if (!text || !text.trim()) return emptyData();
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.results)) return emptyData();
  return data;
}

/** Data locale (YYYY-MM-DD) di un timestamp unix in secondi. */
export function localDate(tsSeconds, timeZone = 'Europe/Zurich') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(tsSeconds * 1000));
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Riassunto breve per il messaggio di commit. */
export function describeChanges(added, updated) {
  const all = [...added, ...updated];
  if (all.length === 0) return 'Aggiorna statistiche Krillion';
  const puzzles = [...new Set(all.map((r) => r.puzzle))].sort((a, b) => b - a);
  const parts = all.slice(0, 6).map((r) => `${r.player} ${r.score}`);
  const more = all.length > 6 ? ` +${all.length - 6}` : '';
  const label = puzzles.length === 1 ? `#${puzzles[0]}` : `${puzzles.length} puzzle`;
  return `Krillion ${label}: ${parts.join(', ')}${more}`;
}
