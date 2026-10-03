# 🦐 Krillion Daily – statistiche

Un bot legge i risultati di Krillion che mandate nel gruppo WhatsApp
**Krillion Daily** e li pubblica su un sito dove potete guardare le statistiche di tutti:
classifica, andamento nel tempo, testa a testa e storico di ogni giocatore.

```
WhatsApp (gruppo)  ──►  bot (bot/)  ──►  docs/data/stats.json su GitHub  ──►  sito (GitHub Pages)
```

Il bot considera un risultato ogni messaggio fatto così: il punteggio è il numero sulla
**seconda riga**.

```
Krillion #80 🦐
285
🦐⚪🦐🔴🦐⬛⚪
```

- Un risultato per persona e per puzzle: vale il primo messaggio. Se il messaggio viene
  modificato su WhatsApp, vale la versione modificata.
- I messaggi inoltrati vengono ignorati.
- I numeri di telefono non vengono mai pubblicati: sul sito ci sono solo i nomi.

## Il sito

Il sito è in [`docs/`](docs/) (HTML/CSS/JS, nessuna dipendenza) e legge
[`docs/data/stats.json`](docs/data/stats.json). Mostra:

- il puzzle del giorno, con podio, griglie e chi non ha ancora giocato (si può andare ai giorni precedenti);
- la classifica (media, partite, record, vittorie, posizione media, serie di giorni consecutivi);
- il grafico dell'andamento (punteggio o media mobile su 7 partite);
- il testa a testa tra ogni coppia di giocatori;
- la scheda di ogni giocatore (clic sul nome).

Filtri per periodo (sempre, ultimi 30, ultimi 7), lingua italiano/tedesco/inglese e tema chiaro/scuro.
Per vederlo con dati inventati: aggiungi `?demo` all'indirizzo.

### Pubblicarlo con GitHub Pages

1. Su GitHub: **Settings → Pages**.
2. *Source*: **Deploy from a branch**, branch **main**, cartella **/docs** → *Save*.
3. Dopo un minuto il sito è su **https://mattiadipalma.github.io/krillion_stats/**

Ogni volta che il bot aggiorna le statistiche, GitHub Pages ripubblica il sito da solo.

## Il bot

Il bot usa [Baileys](https://github.com/WhiskeySockets/Baileys) e si collega al tuo WhatsApp come
**dispositivo collegato** (come WhatsApp Web). Legge e basta: non manda messaggi, non segna nulla come
letto e non risulta "online", quindi le notifiche continuano ad arrivarti sul telefono.

Deve restare acceso per raccogliere i risultati: va bene un PC sempre acceso, un Raspberry Pi o un
piccolo server. Se resta spento per un po', alla riaccensione WhatsApp gli consegna di solito i messaggi
arrivati nel frattempo; se manca qualcosa, puoi recuperarlo con l'[export della chat](#recuperare-lo-storico).

### 1. Token GitHub

Serve per permettere al bot di aggiornare `docs/data/stats.json`.

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. *Repository access*: **Only select repositories** → `krillion_stats`.
3. *Permissions → Repository permissions → Contents*: **Read and write**.
4. Copia il token (inizia con `github_pat_…`).

### 2. Installazione

Serve [Node.js](https://nodejs.org) 20.12 o più recente.

```bash
git clone https://github.com/MattiaDipalma/krillion_stats.git
cd krillion_stats/bot
npm install
cp .env.example .env
```

Apri `.env` e compila almeno `GITHUB_TOKEN` e `MY_NAME` (il tuo nome: su WhatsApp i tuoi messaggi
risultano "Tu"). Le altre opzioni sono spiegate nel file.

### 3. Avvio e collegamento

```bash
npm start
```

Nel terminale compare un QR code: sul telefono apri **WhatsApp → Impostazioni → Dispositivi collegati →
Collega un dispositivo** e scansionalo. Su un server senza schermo puoi usare invece un codice:
imposta `PAIRING_PHONE` nel file `.env` con il tuo numero (es. `41791234567`) e inserisci su WhatsApp il
codice stampato dal bot (**Collega con numero di telefono**).

Il bot cerca il gruppo per nome (`GROUP_NAME`). Se non lo trova, stampa l'elenco dei tuoi gruppi.

Al primo collegamento WhatsApp di solito manda anche lo **storico recente dei messaggi**: i risultati
già presenti nel gruppo vengono importati in automatico. Quanto storico arriva lo decide WhatsApp; per il
resto c'è l'[export della chat](#recuperare-lo-storico).

Esempio di output:

```
03/10/2026, 18:24:00 | 🦐 Krillion stats bot – gruppo "Krillion Daily"
03/10/2026, 18:24:00 |    Statistiche salvate su: github.com/MattiaDipalma/krillion_stats (main:docs/data/stats.json)
03/10/2026, 18:24:31 | ✅ Collegato a WhatsApp come Mattia
03/10/2026, 18:24:32 | 👥 Gruppo trovato: "Krillion Daily" (120363…@g.us)
03/10/2026, 18:31:10 | 📥 Krillion #80 – Daniel: 285
03/10/2026, 18:32:10 | 💾 Salvato su github.com/MattiaDipalma/krillion_stats (main:docs/data/stats.json): 1 nuovi, 0 aggiornati
```

I risultati vengono salvati a gruppi (dopo `FLUSH_DELAY_SECONDS`, 60 secondi di default), così più
risultati ravvicinati finiscono in un solo commit.

### 4. Tenerlo acceso

Con [pm2](https://pm2.keymetrics.io):

```bash
npm install -g pm2
cd krillion_stats/bot
pm2 start src/index.js --name krillion-bot
pm2 save && pm2 startup   # riavvio automatico al boot
pm2 logs krillion-bot     # per vedere i log
```

Oppure con systemd (Linux / Raspberry Pi), in `/etc/systemd/system/krillion-bot.service`:

```ini
[Unit]
Description=Krillion stats bot
After=network-online.target

[Service]
WorkingDirectory=/home/pi/krillion_stats/bot
ExecStart=/usr/bin/node src/index.js
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now krillion-bot
journalctl -u krillion-bot -f
```

## Nomi dei giocatori

Il bot usa il nome con cui hai salvato la persona in rubrica; se non c'è, il nome che la persona ha
scelto sul suo profilo WhatsApp. Per sistemare un nome (o unire due nomi della stessa persona) crea
`bot/aliases.json` partendo da [`bot/aliases.example.json`](bot/aliases.example.json):

```json
{
  "Nils Geigy": "Nils",
  "+41 79 123 45 67": "Elia"
}
```

Gli alias valgono anche per i risultati già salvati: vengono applicati alla scrittura successiva.
`aliases.json` non viene pubblicato (è nel `.gitignore`), quindi puoi metterci anche numeri di telefono.

## Recuperare lo storico

Se lo storico automatico non basta (ad esempio per i puzzle più vecchi):

1. Su WhatsApp apri il gruppo → nome del gruppo → **Esporta chat** → **Senza media**.
2. Su iPhone ottieni uno `.zip`: estrailo, dentro c'è `_chat.txt`.
3. Importa:

```bash
cd bot
npm run import -- percorso/_chat.txt --dry-run   # mostra cosa trova, senza salvare
npm run import -- percorso/_chat.txt             # salva su GitHub (o in locale senza token)
```

Funziona con gli export di iPhone e Android, in italiano, tedesco o inglese. Se le date risultano
sbagliate (giorno e mese invertiti) aggiungi `--date-format dmy` oppure `--date-format mdy`.
Importare più volte lo stesso file non crea doppioni.

## Correggere un risultato a mano

`docs/data/stats.json` contiene un risultato per riga e si può modificare direttamente su GitHub:

```json
{"puzzle":80,"player":"Daniel","score":285,"date":"2026-10-03","ts":1791026645,"grid":"🦐⚪🦐🔴🦐⬛⚪"}
```

## Struttura

```
bot/
  src/index.js           connessione a WhatsApp, salvataggio a gruppi
  src/collector.js       dai messaggi WhatsApp ai risultati (nomi, modifiche, gruppo)
  src/parser.js          riconosce il messaggio "Krillion #N" e il punteggio
  src/stats.js           formato di stats.json e unione dei risultati
  src/store.js           salvataggio su GitHub (API) o su file
  src/import-chat.js     import dall'export della chat
  src/whatsapp-export.js lettura del file esportato da WhatsApp
  test/                  test (npm test)
docs/                    il sito (GitHub Pages)
  data/stats.json        i dati
```

Per i test: `cd bot && npm test`.

## Note

- Baileys non è un client ufficiale di WhatsApp. Un bot che legge soltanto, sul tuo account, è un uso a
  basso rischio, ma WhatsApp in teoria può bloccare gli account che usano client non ufficiali.
- La cartella `bot/auth/` contiene la sessione WhatsApp: non condividerla e non pubblicarla
  (è già nel `.gitignore`). Per scollegare il bot: WhatsApp → Dispositivi collegati → esci dal dispositivo,
  poi cancella `bot/auth/`.
- Se WhatsApp scollega il dispositivo, il bot lo segnala e si ferma: cancella `bot/auth/` e rifai il collegamento.
