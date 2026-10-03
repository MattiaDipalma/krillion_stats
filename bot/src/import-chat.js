#!/usr/bin/env node
// Importa lo storico da un export della chat WhatsApp.
//
//   npm run import -- percorso/_chat.txt [--dry-run] [--local] [--date-format dmy|mdy|ymd]
//
// Su WhatsApp: apri il gruppo → nome del gruppo → "Esporta chat" → "Senza media".
// Su iPhone ottieni uno .zip: estrailo e passa il file _chat.txt.

import { readFile } from 'node:fs/promises';
import { loadConfig } from './config.js';
import { createStore, LocalStore } from './store.js';
import { resolveName } from './stats.js';
import { resultsFromExport } from './whatsapp-export.js';

function parseArgs(argv) {
  const args = { files: [], dryRun: false, local: false, dateOrder: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--local') args.local = true;
    else if (a === '--date-format') args.dateOrder = argv[++i];
    else if (a.startsWith('--date-format=')) args.dateOrder = a.split('=')[1];
    else if (a === '-h' || a === '--help') args.help = true;
    else args.files.push(a);
  }
  if (args.dateOrder && !['dmy', 'mdy', 'ymd'].includes(args.dateOrder)) {
    throw new Error('--date-format deve essere dmy, mdy oppure ymd');
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args.files.length === 0) {
    console.log('Uso: npm run import -- _chat.txt [--dry-run] [--local] [--date-format dmy|mdy|ymd]');
    process.exit(args.help ? 0 : 1);
  }

  const config = loadConfig();
  const results = [];
  for (const file of args.files) {
    const text = await readFile(file, 'utf8');
    const found = resultsFromExport(text, { timeZone: config.timeZone, dateOrder: args.dateOrder });
    console.log(`${file}: ${found.length} risultati Krillion trovati`);
    results.push(...found);
  }

  const perPlayer = new Map();
  for (const r of results) {
    const name = resolveName(r.player, config.aliasMap);
    perPlayer.set(name, (perPlayer.get(name) ?? 0) + 1);
  }
  for (const [name, n] of [...perPlayer].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name.padEnd(24)} ${n}`);
  }
  if (results.length) {
    const puzzles = results.map((r) => r.puzzle);
    console.log(`Puzzle da #${Math.min(...puzzles)} a #${Math.max(...puzzles)}`);
  }

  if (args.dryRun) {
    console.log('--dry-run: nessuna modifica salvata.');
    return;
  }

  const store = args.local ? new LocalStore(config.localStatsFile) : createStore(config);
  const { changed, added, updated } = await store.merge(results, { aliasMap: config.aliasMap });
  console.log(
    changed
      ? `Salvato su ${store.name}: ${added.length} nuovi, ${updated.length} aggiornati.`
      : `Nessuna novità per ${store.name}.`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
