import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExport, resultsFromExport, zonedToUnix } from '../src/whatsapp-export.js';

const IOS = [
  '‎[02/10/26, 09:00:00] Krillion Daily: ‎I messaggi e le chiamate sono crittografati end-to-end.',
  '[03/10/26, 11:25:12] Nic: Krillion #80 🦐',
  '270',
  '🐟⬛🦐🦐🦐⬛🦐',
  '‎[03/10/26, 13:20:00] Mattia: ‎Hai aggiunto Anna.',
  '[03/10/26, 13:24:05] Daniel: Krillion #80 🦐',
  '285',
  '🦐⚪🦐🔴🦐⬛⚪',
  '[03/10/26, 13:27:40] Anna: Krillion #80 🦐',
  '225',
  '🐟🐟🐟⚪🔴⚪🐟',
  '[03/10/26, 17:52:00] Nic: 1. Nils',
  '2. Daniel',
  '[03/10/26, 17:53:10] ~ Flu: machsch du?',
].join('\n');

const ANDROID = [
  '03/10/26, 13:24 - Daniel: Krillion #80 🦐',
  '285',
  '🦐⚪🦐🔴🦐⬛⚪',
  "03/10/26, 13:25 - Anna ha cambiato l'immagine del gruppo",
  '04/10/26, 08:01 - +41 79 123 45 67: Krillion #81 🦐',
  '199',
  '🦐',
].join('\n');

const ENGLISH = [
  '10/3/26, 1:24 PM - Daniel: Krillion #80 🦐',
  '285',
  '10/13/26, 12:05 AM - Anna: Krillion #90 🦐',
  '150',
].join('\n');

test('export iPhone', () => {
  const results = resultsFromExport(IOS, { timeZone: 'Europe/Zurich' });
  assert.deepEqual(
    results.map((r) => [r.player, r.puzzle, r.score, r.date]),
    [
      ['Nic', 80, 270, '2026-10-03'],
      ['Daniel', 80, 285, '2026-10-03'],
      ['Anna', 80, 225, '2026-10-03'],
    ],
  );
  assert.equal(results[1].grid, '🦐⚪🦐🔴🦐⬛⚪');
  assert.equal(results[1].ts, Date.UTC(2026, 9, 3, 11, 24, 5) / 1000, '13:24:05 a Zurigo = 11:24:05 UTC');

  const senders = parseExport(IOS).map((m) => m.sender);
  assert.ok(senders.includes('Flu'), 'toglie "~ " davanti ai nomi');
});

test('export Android con messaggi di sistema e numeri non salvati', () => {
  const results = resultsFromExport(ANDROID, { timeZone: 'Europe/Zurich' });
  assert.deepEqual(
    results.map((r) => [r.player, r.puzzle, r.score, r.grid]),
    [
      ['Daniel', 80, 285, '🦐⚪🦐🔴🦐⬛⚪'],
      ['+41 79 123 45 67', 81, 199, '🦐'],
    ],
  );
});

test('export in inglese (mese/giorno, AM/PM)', () => {
  const results = resultsFromExport(ENGLISH, { timeZone: 'Europe/Zurich' });
  assert.deepEqual(
    results.map((r) => [r.player, r.date]),
    [
      ['Daniel', '2026-10-03'],
      ['Anna', '2026-10-13'],
    ],
  );
  assert.equal(results[1].ts, Date.UTC(2026, 9, 12, 22, 5) / 1000, '12:05 AM = 00:05');
});

test('zonedToUnix gestisce ora legale e solare', () => {
  assert.equal(zonedToUnix(2026, 1, 15, 12, 0, 0, 'Europe/Zurich'), Date.UTC(2026, 0, 15, 11) / 1000);
  assert.equal(zonedToUnix(2026, 7, 15, 12, 0, 0, 'Europe/Zurich'), Date.UTC(2026, 6, 15, 10) / 1000);
});
