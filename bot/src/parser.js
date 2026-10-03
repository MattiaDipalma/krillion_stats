// Riconosce un messaggio di risultato Krillion, per esempio:
//
//   Krillion #80 🦐
//   285
//   🦐⚪🦐🔴🦐⬛⚪
//
// Il punteggio è il numero sulla riga subito dopo "Krillion #N".

const HEADER_RE = /krillion\s*#\s*(\d+)/i;
// "285", "1'234", "1.234", "1,234", "1 234": separatori delle migliaia ammessi.
const SCORE_RE = /^\D{0,3}?(\d{1,3}(?:['’., ]\d{3})+|\d+)(?!\d)/;

const MAX_SCORE = 100000;

/**
 * @param {string | null | undefined} text
 * @returns {{ puzzle: number, score: number, grid: string } | null}
 */
export function parseKrillion(text) {
  if (!text || typeof text !== 'string') return null;

  const lines = text
    .replace(/\r\n?/g, '\n')
    // caratteri invisibili che WhatsApp inserisce a volte (LRM, RLM, ZWSP, BOM)
    .replace(/[​‎‏﻿]/g, '')
    .split('\n')
    .map((l) => l.trim());

  const headerIndex = lines.findIndex((l) => HEADER_RE.test(l));
  if (headerIndex === -1) return null;

  const puzzle = Number(lines[headerIndex].match(HEADER_RE)[1]);
  if (!Number.isSafeInteger(puzzle) || puzzle <= 0) return null;

  // Seconda riga = prima riga non vuota dopo l'intestazione.
  let i = headerIndex + 1;
  while (i < lines.length && lines[i] === '') i++;
  if (i >= lines.length) return null;

  const m = lines[i].match(SCORE_RE);
  if (!m) return null;
  const score = Number(m[1].replace(/['’., ]/g, ''));
  if (!Number.isSafeInteger(score) || score < 0 || score > MAX_SCORE) return null;

  const grid = lines
    .slice(i + 1)
    .filter((l) => l !== '' && !/https?:\/\//i.test(l))
    .join('\n')
    .slice(0, 200);

  return { puzzle, score, grid };
}
