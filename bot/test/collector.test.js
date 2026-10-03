import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Collector, messageText } from '../src/collector.js';
import { buildAliasMap } from '../src/stats.js';

const GROUP = '120363000000000000@g.us';
const RESULT = 'Krillion #80 🦐\n285\n🦐⚪🦐🔴🦐⬛⚪';

function setup({ config = {}, sock = {} } = {}) {
  const results = [];
  const collector = new Collector({
    config: { groupJid: GROUP, timeZone: 'Europe/Zurich', aliasMap: buildAliasMap({}), ...config },
    onResult: (r, info) => results.push({ ...r, ...info }),
  });
  return {
    collector,
    results,
    sock: { user: { id: '41790000000:5@s.whatsapp.net', name: 'Mattia' }, ...sock },
  };
}

const groupMsg = (text, key = {}, extra = {}) => ({
  key: { remoteJid: GROUP, id: 'MSG1', participant: '41791111111@s.whatsapp.net', fromMe: false, ...key },
  message: { conversation: text },
  messageTimestamp: 1791040000,
  pushName: 'Dani',
  ...extra,
});

test('legge un risultato dal gruppo', async () => {
  const { collector, results, sock } = setup();
  await collector.handleMessage(sock, groupMsg(RESULT));
  assert.equal(results.length, 1);
  assert.deepEqual(
    { ...results[0] },
    {
      puzzle: 80,
      score: 285,
      grid: '🦐⚪🦐🔴🦐⬛⚪',
      player: 'Dani',
      ts: 1791040000,
      date: '2026-10-03',
      msgId: 'MSG1',
      edit: false,
    },
  );
});

test('ignora altri gruppi, messaggi inoltrati e testo normale', async () => {
  const { collector, results, sock } = setup();
  await collector.handleMessage(sock, groupMsg(RESULT, { remoteJid: 'altro@g.us' }));
  await collector.handleMessage(sock, groupMsg('machsch du?'));
  await collector.handleMessage(sock, {
    ...groupMsg(''),
    message: { extendedTextMessage: { text: RESULT, contextInfo: { isForwarded: true } } },
  });
  await collector.handleMessage(sock, { key: { remoteJid: GROUP }, message: null });
  assert.equal(results.length, 0);
});

test('testo con anteprima link e messaggi effimeri', async () => {
  const { collector, results, sock } = setup();
  await collector.handleMessage(sock, {
    ...groupMsg(''),
    message: { ephemeralMessage: { message: { extendedTextMessage: { text: RESULT } } } },
  });
  assert.equal(results[0]?.score, 285);
  assert.equal(messageText({ imageMessage: { caption: 'ciao' } }).text, 'ciao');
});

test('nome: rubrica > nome profilo > numero; alias prima di tutto', async () => {
  const { collector, results, sock } = setup({
    config: { aliasMap: buildAliasMap({ '+41 79 333 33 33': 'Elia' }) },
  });
  collector.rememberContacts([
    { id: '41791111111@s.whatsapp.net', lid: '111@lid', name: 'Daniel' },
    { id: '222@lid', notify: 'nic_' },
  ]);

  await collector.handleMessage(sock, groupMsg(RESULT, { id: 'a' }));
  // LID come partecipante, numero in participantAlt
  await collector.handleMessage(
    sock,
    groupMsg(RESULT, { id: 'b', participant: '111@lid', participantAlt: undefined }),
  );
  await collector.handleMessage(
    sock,
    groupMsg(RESULT, { id: 'c', participant: '222@lid' }, { pushName: undefined }),
  );
  await collector.handleMessage(
    sock,
    groupMsg(
      RESULT,
      { id: 'd', participant: '444@lid', participantAlt: '41794444444@s.whatsapp.net' },
      { pushName: undefined },
    ),
  );
  await collector.handleMessage(
    sock,
    groupMsg(RESULT, { id: 'e', participant: '41793333333:12@s.whatsapp.net' }),
  );
  assert.deepEqual(
    results.map((r) => r.player),
    ['Daniel', 'Daniel', 'nic_', '+41794444444', 'Elia'],
  );
});

test('messaggi dello storico con il mittente fuori dalla chiave', async () => {
  const { collector, results, sock } = setup();
  collector.rememberContacts([{ id: '41796666666@s.whatsapp.net', name: 'Flu' }]);
  await collector.handleMessage(
    sock,
    groupMsg(
      RESULT,
      { participant: undefined },
      { participant: '41796666666@s.whatsapp.net', pushName: undefined },
    ),
  );
  assert.equal(results[0].player, 'Flu');
});

test('nome ricavato dalla mappatura LID → numero di Baileys', async () => {
  const { collector, results, sock } = setup({
    sock: {
      signalRepository: {
        lidMapping: {
          getPNForLID: async (lid) => (lid === '555@lid' ? '41795555555:3@s.whatsapp.net' : null),
        },
      },
    },
  });
  collector.rememberContacts([{ id: '41795555555@s.whatsapp.net', name: 'Jonas' }]);
  await collector.handleMessage(sock, groupMsg(RESULT, { participant: '555@lid' }, { pushName: 'jj' }));
  assert.equal(results[0].player, 'Jonas');
});

test('i miei messaggi usano MY_NAME o il nome del mio profilo', async () => {
  const a = setup();
  await a.collector.handleMessage(a.sock, groupMsg(RESULT, { fromMe: true, participant: undefined }));
  assert.equal(a.results[0].player, 'Mattia');

  const b = setup({ config: { myName: 'Mattia D.' } });
  await b.collector.handleMessage(b.sock, groupMsg(RESULT, { fromMe: true }));
  assert.equal(b.results[0].player, 'Mattia D.');
});

test('messaggio modificato (messages.update)', async () => {
  const { collector, results, sock } = setup();
  await collector.handleUpdate(sock, {
    key: { remoteJid: GROUP, id: 'MSG1', participant: '41791111111@s.whatsapp.net' },
    update: {
      message: { editedMessage: { message: { conversation: 'Krillion #80 🦐\n290\n🦐' } } },
      messageTimestamp: 1791040100,
    },
  });
  await collector.handleUpdate(sock, { key: { remoteJid: GROUP, id: 'X' }, update: { status: 3 } });
  assert.equal(results.length, 1);
  assert.equal(results[0].score, 290);
  assert.equal(results[0].msgId, 'MSG1');
  assert.equal(results[0].edit, true);
});

test('i messaggi arrivati prima di conoscere il gruppo vengono processati dopo', async () => {
  const { collector, results, sock } = setup({ config: { groupJid: null } });
  await collector.handleMessage(sock, groupMsg(RESULT));
  await collector.handleMessage(sock, groupMsg(RESULT, { remoteJid: 'altro@g.us', id: 'Z' }));
  assert.equal(results.length, 0);
  await collector.setGroup(sock, GROUP);
  assert.equal(results.length, 1);
  await collector.handleMessage(sock, groupMsg(RESULT, { id: 'later' }));
  assert.equal(results.length, 2);
});

test('gruppo non trovato: niente viene registrato', async () => {
  const { collector, results, sock } = setup({ config: { groupJid: null } });
  await collector.handleMessage(sock, groupMsg(RESULT));
  await collector.setGroup(sock, null);
  await collector.handleMessage(sock, groupMsg(RESULT, { id: 'later' }));
  assert.equal(results.length, 0);
  assert.equal(collector.held.length, 0);
});

test('timestamp Long di protobuf', async () => {
  const { collector, results, sock } = setup();
  await collector.handleMessage(
    sock,
    groupMsg(
      RESULT,
      {},
      { messageTimestamp: { low: 1791040000, high: 0, unsigned: true, toNumber: () => 1791040000 } },
    ),
  );
  assert.equal(results[0].ts, 1791040000);
});
