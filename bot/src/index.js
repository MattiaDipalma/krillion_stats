#!/usr/bin/env node
// Bot WhatsApp: legge i risultati Krillion dal gruppo e aggiorna docs/data/stats.json.
//
// Si collega al tuo account come "dispositivo collegato" (come WhatsApp Web),
// legge soltanto: non invia messaggi e non segna nulla come letto.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from 'baileys';
import { Collector } from './collector.js';
import { loadConfig } from './config.js';
import { createStore } from './store.js';

const config = loadConfig();
const store = createStore(config);
const baileysLogger = pino({ level: process.env.LOG_LEVEL || 'error' });

const log = (...args) =>
  console.log(new Date().toLocaleString('it-CH', { timeZone: config.timeZone }), '|', ...args);

// ---------------------------------------------------------------------------
// Stato locale (non pubblicato): rubrica e risultati in attesa di essere salvati

const contactsFile = resolve(config.stateDir, 'contacts.json');
const pendingFile = resolve(config.stateDir, 'pending.json');

/** chiave → risultato da salvare */
const pending = new Map();
const pendingKey = (r) => r.msgId ?? `${r.player}#${r.puzzle}`;

const collector = new Collector({
  config,
  onResult: async (result, { edit }) => {
    pending.set(pendingKey(result), result);
    log(`📥 ${edit ? '(modificato) ' : ''}Krillion #${result.puzzle} – ${result.player}: ${result.score}`);
    await savePending().catch(() => {});
    scheduleFlush();
  },
});

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function savePending() {
  await writeFile(pendingFile, JSON.stringify([...pending.values()], null, 2));
}

let contactsSaveTimer = null;
function rememberContacts(list) {
  if (!collector.rememberContacts(list)) return;
  clearTimeout(contactsSaveTimer);
  contactsSaveTimer = setTimeout(() => {
    writeFile(contactsFile, JSON.stringify(Object.fromEntries(collector.contacts), null, 2)).catch((err) =>
      log('⚠️  Impossibile salvare la rubrica:', err.message),
    );
  }, 2000);
}

// ---------------------------------------------------------------------------
// Gruppo

async function resolveGroup(sock) {
  if (config.groupJid) return;
  let groups;
  try {
    groups = Object.values(await sock.groupFetchAllParticipating());
  } catch (err) {
    log('⚠️  Impossibile leggere la lista dei gruppi:', err.message);
    return;
  }
  const wanted = config.groupName.toLowerCase();
  const match = groups.find((g) => g.subject?.trim().toLowerCase() === wanted);
  if (match) {
    log(`👥 Gruppo trovato: "${match.subject}" (${match.id})`);
  } else {
    log(`⚠️  Nessun gruppo chiamato "${config.groupName}". Gruppi disponibili:`);
    for (const g of groups) log(`     - ${g.subject}  (${g.id})`);
    log('   Imposta GROUP_NAME (o GROUP_JID) nel file .env e riavvia il bot.');
  }
  await collector.setGroup(sock, match?.id ?? null);
}

// ---------------------------------------------------------------------------
// Salvataggio (a gruppi, per non fare un commit per ogni messaggio)

let flushTimer = null;
let flushing = null;

function scheduleFlush(delay = config.flushDelayMs) {
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush().catch(() => {});
  }, delay);
}

async function flush() {
  while (flushing) await flushing;
  if (pending.size === 0) return;
  flushing = (async () => {
    const batch = new Map(pending);
    try {
      const { changed, added, updated } = await store.merge([...batch.values()], {
        aliasMap: config.aliasMap,
      });
      for (const [key, r] of batch) if (pending.get(key) === r) pending.delete(key);
      await savePending();
      log(
        changed
          ? `💾 Salvato su ${store.name}: ${added.length} nuovi, ${updated.length} aggiornati`
          : '💾 Nessuna novità da salvare',
      );
    } catch (err) {
      log(`❌ Salvataggio fallito (riprovo tra 5 minuti): ${err.message}`);
      scheduleFlush(5 * 60 * 1000);
    }
  })();
  try {
    await flushing;
  } finally {
    flushing = null;
  }
}

// ---------------------------------------------------------------------------
// Connessione a WhatsApp

let retries = 0;

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion({ signal: AbortSignal.timeout(10000) }));
  } catch {
    // si usa la versione inclusa in Baileys
  }

  const sock = makeWASocket({
    auth: state,
    ...(version ? { version } : {}),
    logger: baileysLogger,
    // "Desktop" + syncFullHistory: al primo collegamento WhatsApp invia anche
    // lo storico dei messaggi, così vengono recuperati i risultati passati.
    browser: Browsers.macOS('Desktop'),
    syncFullHistory: true,
    shouldSyncHistoryMessage: () => true,
    // non risultare "online": le notifiche continuano ad arrivare sul telefono
    markOnlineOnConnect: false,
  });

  let pairingRequested = false;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      if (config.pairingPhone && !pairingRequested) {
        pairingRequested = true;
        try {
          const code = await sock.requestPairingCode(config.pairingPhone);
          log(`🔑 Codice di collegamento: ${code}`);
          log(
            '   WhatsApp → Dispositivi collegati → Collega un dispositivo → Collega con numero di telefono',
          );
        } catch (err) {
          log('⚠️  Codice di collegamento non disponibile:', err.message);
        }
      } else if (!config.pairingPhone) {
        log('📱 Scansiona il QR: WhatsApp → Impostazioni → Dispositivi collegati → Collega un dispositivo');
        qrcode.generate(qr, { small: true });
      }
    }

    if (connection === 'open') {
      retries = 0;
      log(`✅ Collegato a WhatsApp come ${sock.user?.name ?? sock.user?.id}`);
      await resolveGroup(sock);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        log('🚪 Il dispositivo è stato scollegato da WhatsApp.');
        log(`   Cancella la cartella "${config.authDir}" e riavvia il bot per collegarlo di nuovo.`);
        await flush().catch(() => {});
        process.exit(1);
      }
      const delay = code === DisconnectReason.restartRequired ? 0 : Math.min(60, 2 ** retries) * 1000;
      retries++;
      log(`🔌 Connessione chiusa (${code ?? 'sconosciuto'}), riconnessione tra ${delay / 1000}s…`);
      setTimeout(() => connect().catch(fatal), delay);
    }
  });

  sock.ev.on('contacts.upsert', rememberContacts);
  sock.ev.on('contacts.update', rememberContacts);

  sock.ev.on('messaging-history.set', async ({ messages, contacts }) => {
    rememberContacts(contacts);
    for (const msg of messages ?? []) await collector.handleMessage(sock, msg);
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages ?? []) await collector.handleMessage(sock, msg);
  });

  sock.ev.on('messages.update', async (updates) => {
    for (const u of updates ?? []) await collector.handleUpdate(sock, u);
  });
}

function fatal(err) {
  log('❌ Errore:', err?.stack ?? err);
  process.exit(1);
}

async function shutdown(signal) {
  log(`${signal}: salvo i risultati in sospeso ed esco…`);
  clearTimeout(flushTimer);
  await flush().catch(() => {});
  process.exit(0);
}

async function main() {
  await mkdir(config.stateDir, { recursive: true });
  collector.rememberContacts(
    Object.entries(await readJson(contactsFile, {})).map(([id, c]) => ({ id, ...c })),
  );
  for (const r of await readJson(pendingFile, [])) pending.set(pendingKey(r), r);

  log(`🦐 Krillion stats bot – gruppo "${config.groupJid ?? config.groupName}"`);
  log(`   Statistiche salvate su: ${store.name}`);
  if (!config.githubToken) log('   (GITHUB_TOKEN non impostato: scrivo solo il file locale)');
  if (Object.keys(config.aliases).length) log(`   Alias caricati: ${Object.keys(config.aliases).length}`);

  try {
    const data = await store.load();
    log(`   Risultati già presenti: ${data.results.length}`);
  } catch (err) {
    log(`⚠️  Non riesco a leggere le statistiche (${err.message}). Controlla GITHUB_TOKEN/GITHUB_REPO.`);
  }

  if (pending.size) scheduleFlush(5000);

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  log('   Connessione a WhatsApp…');
  await connect();
}

main().catch(fatal);
