import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseKrillion } from '../src/parser.js';

test('messaggio standard', () => {
  assert.deepEqual(parseKrillion('Krillion #80 🦐\n285\n🦐⚪🦐🔴🦐⬛⚪'), {
    puzzle: 80,
    score: 285,
    grid: '🦐⚪🦐🔴🦐⬛⚪',
  });
});

test('il punteggio è sempre la seconda riga', () => {
  assert.equal(parseKrillion('Krillion #80 🦐\n225\n🐟🐟🐟⚪🔴⚪🐟').score, 225);
  assert.equal(parseKrillion('Krillion #81\r\n\r\n  312  \r\n🦐').score, 312);
});

test('testo prima del risultato e caratteri invisibili', () => {
  const r = parseKrillion('oggi difficile\n‎Krillion #79 🦐\n‎190\n🦐');
  assert.deepEqual([r.puzzle, r.score], [79, 190]);
});

test('separatore delle migliaia', () => {
  assert.equal(parseKrillion("Krillion #5\n1'234\n🦐").score, 1234);
});

test('il link finale non finisce nella griglia', () => {
  const r = parseKrillion('Krillion #80 🦐\n285\n🦐🦐\nhttps://krillion.example');
  assert.equal(r.grid, '🦐🦐');
});

test('messaggi che non sono risultati', () => {
  assert.equal(parseKrillion(null), null);
  assert.equal(parseKrillion(''), null);
  assert.equal(parseKrillion('machsch du?'), null);
  assert.equal(parseKrillion('Krillion #80 🦐'), null);
  assert.equal(parseKrillion('Krillion #80 🦐\n🦐⚪🦐'), null);
  assert.equal(parseKrillion('hai fatto il krillion #80?\nio ho fatto 3 errori'), null);
  assert.equal(parseKrillion('1. Nils\n2. Daniel\n3. Nic'), null);
});
