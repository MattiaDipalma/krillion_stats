// Legge il file .txt di "Esporta chat" di WhatsApp (iPhone e Android, formati
// data italiani/tedeschi/inglesi) e restituisce i singoli messaggi.
//
//   iPhone:  [03/10/26, 13:24:05] Daniel: Krillion #80 🦐
//   Android: 03/10/26, 13:24 - Daniel: Krillion #80 🦐
//   Inglese: 10/3/26, 1:24 PM - Daniel: Krillion #80 🦐

import { parseKrillion } from './parser.js';
import { localDate } from './stats.js';

const LINE_RE = new RegExp(
  '^\\[?' +
    '(\\d{1,4})[./-](\\d{1,2})[./-](\\d{1,4})' + // data
    ',?\\s+' +
    '(\\d{1,2})[:.](\\d{2})(?:[:.](\\d{2}))?' + // ora
    '\\s*([AaPp]\\.?\\s?[Mm]\\.?)?' + // AM/PM
    '\\]?\\s*(?:-\\s+)?' +
    '([^:]+?):\\s?' + // mittente
    '(.*)$',
);

// Riga che inizia con data e ora ma senza "Mittente:" (messaggi di sistema).
const SYSTEM_RE = /^\[?\d{1,4}[./-]\d{1,2}[./-]\d{1,4},?\s+\d{1,2}[:.]\d{2}/;

const INVISIBLE = /[​‎‏‪-‮⁦-⁩﻿]/g;

function normalizeLine(line) {
  return line.replace(INVISIBLE, '').replace(/[  ]/g, ' ');
}

/** Determina se le date sono giorno/mese o mese/giorno guardando tutto il file. */
function detectDateOrder(rows) {
  let dmy = false;
  let mdy = false;
  for (const [a, b] of rows) {
    if (a > 31) return 'ymd';
    if (a > 12) dmy = true;
    if (b > 12) mdy = true;
  }
  if (mdy && !dmy) return 'mdy';
  return 'dmy';
}

function tzOffsetMs(utcMs, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(utcMs));
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return asUtc - utcMs;
}

/** Ora locale (nel fuso indicato) → timestamp unix in secondi. */
export function zonedToUnix(y, mo, d, h, mi, s, timeZone) {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let ts = guess - tzOffsetMs(guess, timeZone);
  ts = guess - tzOffsetMs(ts, timeZone);
  return Math.floor(ts / 1000);
}

/**
 * @param {string} text contenuto del file esportato
 * @param {{ timeZone?: string, dateOrder?: 'dmy' | 'mdy' | 'ymd' }} [opts]
 * @returns {Array<{ sender: string, ts: number, date: string, text: string }>}
 */
export function parseExport(text, { timeZone = 'Europe/Zurich', dateOrder } = {}) {
  const raw = [];
  for (const original of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = normalizeLine(original);
    const m = line.match(LINE_RE);
    if (m) {
      raw.push({ m, lines: [m[9]] });
    } else if (SYSTEM_RE.test(line)) {
      raw.push({ m: null, lines: [] });
    } else if (raw.length) {
      raw[raw.length - 1].lines.push(line);
    }
  }

  const withSender = raw.filter((r) => r.m);
  const order = dateOrder ?? detectDateOrder(withSender.map(({ m }) => [Number(m[1]), Number(m[2])]));

  const messages = [];
  for (const { m, lines } of withSender) {
    const [a, b, c] = [Number(m[1]), Number(m[2]), Number(m[3])];
    let y, mo, d;
    if (order === 'ymd') [y, mo, d] = [a, b, c];
    else if (order === 'mdy') [mo, d, y] = [a, b, c];
    else [d, mo, y] = [a, b, c];
    if (y < 100) y += 2000;
    if (mo < 1 || mo > 12 || d < 1 || d > 31) continue;

    let h = Number(m[4]);
    const ampm = m[7]?.toLowerCase().replace(/[^ap]/g, '');
    if (ampm === 'p' && h < 12) h += 12;
    if (ampm === 'a' && h === 12) h = 0;

    const ts = zonedToUnix(y, mo, d, h, Number(m[5]), Number(m[6] ?? 0), timeZone);
    const sender = m[8].replace(/^~\s*/, '').trim();
    messages.push({ sender, ts, date: localDate(ts, timeZone), text: lines.join('\n') });
  }
  return messages;
}

/**
 * Estrae i risultati Krillion da un export.
 * @param {string} text
 * @param {{ timeZone?: string, dateOrder?: 'dmy' | 'mdy' | 'ymd' }} [opts]
 */
export function resultsFromExport(text, opts = {}) {
  const results = [];
  for (const msg of parseExport(text, opts)) {
    const parsed = parseKrillion(msg.text);
    if (!parsed) continue;
    results.push({ ...parsed, player: msg.sender, ts: msg.ts, date: msg.date });
  }
  return results;
}
