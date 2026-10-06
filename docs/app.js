// Krillion Daily – sito delle statistiche.
// Legge data/stats.json (aggiornato dal bot WhatsApp) e disegna tutto lato client.
// Aggiungi ?demo all'indirizzo per vedere il sito con dati inventati.

const I18N = {
  it: {
    subtitle: 'Le statistiche del gruppo',
    summary: 'Riassunto',
    updated: 'Aggiornato {time}',
    loading: 'Caricamento…',
    error: 'Impossibile caricare le statistiche ({msg}).',
    empty: 'Ancora nessun risultato: appena qualcuno manda il suo Krillion nel gruppo, comparirà qui.',
    demo: 'Dati di esempio (modalità demo).',
    prev: 'Puzzle precedente',
    next: 'Puzzle successivo',
    missing: 'Non ha ancora giocato: {names}',
    missingMany: 'Non hanno ancora giocato: {names}',
    vsAvg: 'vs media',
    firstGame: 'prima partita',
    period: 'Periodo',
    periodAll: 'Sempre',
    period30: 'Ultimi 30',
    period7: 'Ultimi 7',
    tilePuzzles: 'Puzzle',
    tilePlayers: 'Giocatori',
    tileRecord: 'Record',
    tileAvg: 'Media del gruppo',
    tilePlayersHint: '{n} risultati',
    tilePuzzlesHint: 'da #{from} a #{to}',
    leaderboard: 'Classifica',
    colPlayer: 'Giocatore',
    colGames: 'Partite',
    colAvg: 'Media',
    colBest: 'Migliore',
    colWins: 'Vittorie',
    colAvgRank: 'Pos. media',
    colStreak: 'Serie',
    qualifyNote: 'Chi ha giocato meno di {n} partite nel periodo è in fondo alla classifica della media.',
    trend: 'Andamento',
    trendPlayers: 'Giocatori nel grafico',
    modeScore: 'Punteggio',
    modeAvg: 'Media mobile (7)',
    groupAvg: 'Media del gruppo',
    noSelection: 'Seleziona almeno un giocatore.',
    h2h: 'Testa a testa',
    h2hHint:
      'Vittorie–sconfitte del giocatore della riga contro quello della colonna, nei puzzle giocati da entrambi.',
    h2hWorse: 'perde più spesso',
    h2hBetter: 'vince più spesso',
    h2hTip: '{a} contro {b}: {w} vinte, {l} perse, {d} pari',
    history: 'Storico',
    close: 'Chiudi',
    colPuzzle: 'Puzzle',
    colDate: 'Data',
    colScore: 'Punti',
    colRank: 'Pos.',
    colGrid: 'Risultato',
    tileWorst: 'Peggiore',
    tilePodiums: 'Podi',
    tileStreakBest: 'Serie migliore',
    footer: 'Dati raccolti dal bot WhatsApp del gruppo Krillion Daily',
  },
  de: {
    subtitle: 'Die Statistiken der Gruppe',
    summary: 'Übersicht',
    updated: 'Aktualisiert {time}',
    loading: 'Laden…',
    error: 'Statistiken konnten nicht geladen werden ({msg}).',
    empty: 'Noch keine Resultate: Sobald jemand sein Krillion in die Gruppe schickt, erscheint es hier.',
    demo: 'Beispieldaten (Demo-Modus).',
    prev: 'Vorheriges Rätsel',
    next: 'Nächstes Rätsel',
    missing: 'Hat noch nicht gespielt: {names}',
    missingMany: 'Haben noch nicht gespielt: {names}',
    vsAvg: 'vs. Schnitt',
    firstGame: 'erstes Spiel',
    period: 'Zeitraum',
    periodAll: 'Gesamt',
    period30: 'Letzte 30',
    period7: 'Letzte 7',
    tilePuzzles: 'Rätsel',
    tilePlayers: 'Spieler',
    tileRecord: 'Rekord',
    tileAvg: 'Gruppenschnitt',
    tilePlayersHint: '{n} Resultate',
    tilePuzzlesHint: 'von #{from} bis #{to}',
    leaderboard: 'Rangliste',
    colPlayer: 'Spieler',
    colGames: 'Spiele',
    colAvg: 'Schnitt',
    colBest: 'Bestes',
    colWins: 'Siege',
    colAvgRank: 'Ø Rang',
    colStreak: 'Serie',
    qualifyNote: 'Wer im Zeitraum weniger als {n} Spiele hat, steht in der Schnitt-Rangliste unten.',
    trend: 'Verlauf',
    trendPlayers: 'Spieler im Diagramm',
    modeScore: 'Punkte',
    modeAvg: 'Gleitender Schnitt (7)',
    groupAvg: 'Gruppenschnitt',
    noSelection: 'Wähle mindestens einen Spieler.',
    h2h: 'Direktvergleich',
    h2hHint:
      'Siege–Niederlagen des Spielers der Zeile gegen den der Spalte, bei Rätseln, die beide gespielt haben.',
    h2hWorse: 'verliert öfter',
    h2hBetter: 'gewinnt öfter',
    h2hTip: '{a} gegen {b}: {w} gewonnen, {l} verloren, {d} unentschieden',
    history: 'Verlauf',
    close: 'Schliessen',
    colPuzzle: 'Rätsel',
    colDate: 'Datum',
    colScore: 'Punkte',
    colRank: 'Rang',
    colGrid: 'Resultat',
    tileWorst: 'Schlechtestes',
    tilePodiums: 'Podestplätze',
    tileStreakBest: 'Beste Serie',
    footer: 'Daten gesammelt vom WhatsApp-Bot der Gruppe Krillion Daily',
  },
  en: {
    subtitle: 'The group stats',
    summary: 'Summary',
    updated: 'Updated {time}',
    loading: 'Loading…',
    error: 'Could not load the stats ({msg}).',
    empty: 'No results yet: as soon as someone posts their Krillion in the group, it will show up here.',
    demo: 'Sample data (demo mode).',
    prev: 'Previous puzzle',
    next: 'Next puzzle',
    missing: 'Still to play: {names}',
    missingMany: 'Still to play: {names}',
    vsAvg: 'vs avg',
    firstGame: 'first game',
    period: 'Period',
    periodAll: 'All time',
    period30: 'Last 30',
    period7: 'Last 7',
    tilePuzzles: 'Puzzles',
    tilePlayers: 'Players',
    tileRecord: 'Record',
    tileAvg: 'Group average',
    tilePlayersHint: '{n} results',
    tilePuzzlesHint: '#{from} to #{to}',
    leaderboard: 'Leaderboard',
    colPlayer: 'Player',
    colGames: 'Games',
    colAvg: 'Average',
    colBest: 'Best',
    colWins: 'Wins',
    colAvgRank: 'Avg. rank',
    colStreak: 'Streak',
    qualifyNote: 'Players with fewer than {n} games in the period sit at the bottom of the average ranking.',
    trend: 'Trend',
    trendPlayers: 'Players in the chart',
    modeScore: 'Score',
    modeAvg: 'Rolling average (7)',
    groupAvg: 'Group average',
    noSelection: 'Select at least one player.',
    h2h: 'Head to head',
    h2hHint: 'Wins–losses of the row player against the column player, on puzzles both played.',
    h2hWorse: 'loses more often',
    h2hBetter: 'wins more often',
    h2hTip: '{a} vs {b}: {w} won, {l} lost, {d} tied',
    history: 'History',
    close: 'Close',
    colPuzzle: 'Puzzle',
    colDate: 'Date',
    colScore: 'Score',
    colRank: 'Rank',
    colGrid: 'Result',
    tileWorst: 'Worst',
    tilePodiums: 'Podiums',
    tileStreakBest: 'Best streak',
    footer: 'Data collected by the Krillion Daily WhatsApp bot',
  },
};

const LOCALES = { it: 'it-CH', de: 'de-CH', en: 'en-GB' };
const SLOTS = 12;
const MEDALS = ['🥇', '🥈', '🥉'];
// partite minime nel periodo per stare in classifica (media e posizione media) insieme agli altri
const MIN_GAMES = 3;

// ---------------------------------------------------------------------------
// Preferenze (solo per comodità: se lo storage non è disponibile si va avanti)

const prefs = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(`krillion.${key}`);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`krillion.${key}`, JSON.stringify(value));
    } catch {
      /* ignora */
    }
  },
};

function detectLang() {
  const saved = prefs.get('lang', null);
  if (saved && I18N[saved]) return saved;
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = String(l).slice(0, 2).toLowerCase();
    if (I18N[code]) return code;
  }
  return 'it';
}

const state = {
  lang: detectLang(),
  data: null,
  demo: new URLSearchParams(location.search).has('demo'),
  period: prefs.get('period', 'all'),
  trendMode: prefs.get('trendMode', 'avg'),
  selected: null,
  sort: { key: 'avg', dir: 'desc' },
  dayPuzzle: null,
};

function t(key, vars = {}) {
  const s = I18N[state.lang][key] ?? I18N.it[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

const locale = () => LOCALES[state.lang];
const fmt = (n, digits = 0) =>
  new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
const fmtDate = (iso, opts = { day: 'numeric', month: 'short' }) =>
  iso
    ? new Intl.DateTimeFormat(locale(), { ...opts, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
    : '';

// ---------------------------------------------------------------------------
// DOM

const $ = (sel) => document.querySelector(sel);

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === undefined || c === null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    if (k === 'class') node.setAttribute('class', v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === undefined || c === null) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

// ---------------------------------------------------------------------------
// Calcoli

/** Indice dei puzzle: puzzle → { puzzle, date, results ordinati, rank per giocatore } */
function indexPuzzles(results) {
  const map = new Map();
  for (const r of results) {
    if (!map.has(r.puzzle)) map.set(r.puzzle, { puzzle: r.puzzle, date: r.date, results: [] });
    const p = map.get(r.puzzle);
    p.results.push(r);
    if (r.date && (!p.date || r.date < p.date)) p.date = r.date;
  }
  for (const p of map.values()) {
    p.results.sort((a, b) => b.score - a.score || (a.ts ?? 0) - (b.ts ?? 0));
    p.rank = new Map();
    p.results.forEach((r, i) => {
      // classifica "sportiva": a pari punteggio, pari posizione (1, 2, 2, 4)
      const rank = i > 0 && r.score === p.results[i - 1].score ? p.rank.get(p.results[i - 1].player) : i + 1;
      p.rank.set(r.player, rank);
    });
    p.top = p.results[0]?.score;
    p.avg = p.results.reduce((s, r) => s + r.score, 0) / p.results.length;
  }
  return map;
}

// Nomi da mostrare (data/names.json): { "nome come arriva da WhatsApp": "nome sul sito" }.
// Confronto senza maiuscole/spazi; i puntini dei numeri mascherati (+41∙∙∙46) valgono tutti uguale.
const nameKey = (s) =>
  String(s ?? '')
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g, '')
    .replace(/[∙•·⋅]/g, '∙')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

function nameMap(names) {
  const map = new Map();
  for (const [from, to] of Object.entries(names ?? {})) {
    if (!from.startsWith('_') && typeof to === 'string' && to.trim()) map.set(nameKey(from), to.trim());
  }
  return map;
}

function prepare(data, names = new Map()) {
  // Due nomi di WhatsApp possono diventare la stessa persona: un risultato per puzzle, vale il primo.
  const byKey = new Map();
  for (const r of data.results ?? []) {
    if (!r || !Number.isFinite(r.puzzle) || !Number.isFinite(r.score) || typeof r.player !== 'string')
      continue;
    const player = names.get(nameKey(r.player)) ?? r.player;
    const key = `${r.puzzle}\u0000${player.toLowerCase()}`;
    const prev = byKey.get(key);
    if (!prev || (r.ts ?? Infinity) < (prev.ts ?? Infinity)) byKey.set(key, { ...r, player });
  }
  const results = [...byKey.values()];
  const puzzles = indexPuzzles(results);
  const puzzleList = [...puzzles.keys()].sort((a, b) => a - b);
  const players = [...new Set(results.map((r) => r.player))].sort((a, b) => a.localeCompare(b, locale()));
  // colore per giocatore, fisso (ordine alfabetico); oltre il dodicesimo, stesso colore ma linea tratteggiata
  const colors = new Map(
    players.map((p, i) => [p, { color: `var(--s${(i % SLOTS) + 1})`, dashed: i >= SLOTS }]),
  );
  const byPlayer = new Map(players.map((p) => [p, []]));
  for (const r of results) byPlayer.get(r.player).push(r);
  for (const list of byPlayer.values()) list.sort((a, b) => a.puzzle - b.puzzle);
  return { updatedAt: data.updatedAt, results, puzzles, puzzleList, players, colors, byPlayer };
}

function periodRange(model, period) {
  const last = model.puzzleList.at(-1) ?? 0;
  if (period === 'all') return { from: model.puzzleList[0] ?? 0, to: last };
  return { from: last - Number(period) + 1, to: last };
}

function streaks(list, lastPuzzle) {
  let best = 0;
  let run = 0;
  let prev = null;
  for (const r of list) {
    run = prev !== null && r.puzzle === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = r.puzzle;
  }
  const current = prev !== null && prev >= lastPuzzle - 1 ? run : 0;
  return { current, best };
}

function playerStats(model, range) {
  const last = model.puzzleList.at(-1) ?? 0;
  const stats = [];
  for (const [name, all] of model.byPlayer) {
    const list = all.filter((r) => r.puzzle >= range.from && r.puzzle <= range.to);
    if (!list.length) continue;
    let total = 0;
    let wins = 0;
    let rankSum = 0;
    const podium = [0, 0, 0]; // volte primo, secondo, terzo (come le medaglie del puzzle del giorno)
    let best = list[0];
    let worst = list[0];
    for (const r of list) {
      const p = model.puzzles.get(r.puzzle);
      total += r.score;
      const rank = p.rank.get(name);
      rankSum += rank;
      if (rank === 1 && p.results.length > 1) wins++;
      if (rank <= 3 && p.results.length > 1) podium[rank - 1]++;
      if (r.score > best.score) best = r;
      if (r.score < worst.score) worst = r;
    }
    const s = streaks(all, last);
    stats.push({
      name,
      games: list.length,
      avg: total / list.length,
      best,
      worst,
      wins,
      podium,
      podiums: podium[0] + podium[1] + podium[2],
      avgRank: rankSum / list.length,
      streak: s.current,
      bestStreak: s.best,
    });
  }
  return stats;
}

function minGames(model, range) {
  // se nel periodo ci sono meno puzzle di MIN_GAMES, basta averli giocati tutti
  const n = model.puzzleList.filter((p) => p >= range.from && p <= range.to).length;
  return Math.max(1, Math.min(MIN_GAMES, n));
}

function sortStats(stats, sort, threshold) {
  const dir = sort.dir === 'asc' ? 1 : -1;
  const value = (s) => (sort.key === 'best' ? s.best.score : sort.key === 'name' ? s.name : s[sort.key]);
  const qualifies = sort.key === 'avg' || sort.key === 'avgRank';
  return [...stats].sort((a, b) => {
    if (qualifies) {
      const qa = a.games >= threshold;
      const qb = b.games >= threshold;
      if (qa !== qb) return qa ? -1 : 1;
    }
    const va = value(a);
    const vb = value(b);
    const cmp = typeof va === 'string' ? va.localeCompare(vb, locale()) : va - vb;
    return dir * cmp || b.games - a.games || a.name.localeCompare(b.name, locale());
  });
}

function rolling(values, size = 7) {
  const out = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= size) sum -= values[i - size];
    out.push(sum / Math.min(i + 1, size));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Rendering: puzzle del giorno

function renderDay(model) {
  const list = model.puzzleList;
  if (state.dayPuzzle === null || !model.puzzles.has(state.dayPuzzle)) state.dayPuzzle = list.at(-1);
  const idx = list.indexOf(state.dayPuzzle);
  const p = model.puzzles.get(state.dayPuzzle);

  $('#day-title').textContent = `Krillion #${p.puzzle}`;
  $('#day-date').textContent = fmtDate(p.date, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  $('#day-prev').disabled = idx <= 0;
  $('#day-next').disabled = idx >= list.length - 1;

  const ol = $('#day-list');
  ol.replaceChildren();
  for (const r of p.results) {
    const rank = p.rank.get(r.player);
    const history = model.byPlayer.get(r.player).filter((x) => x.puzzle !== r.puzzle);
    let delta;
    if (history.length) {
      const avg = history.reduce((s, x) => s + x.score, 0) / history.length;
      const d = Math.round(r.score - avg);
      const cls = d > 0 ? 'up' : d < 0 ? 'down' : '';
      const arrow = d > 0 ? '▲' : d < 0 ? '▼' : '=';
      delta = el('span', { class: `delta ${cls}` }, `${arrow} ${fmt(Math.abs(d))} ${t('vsAvg')}`);
    } else {
      delta = el('span', { class: 'delta' }, t('firstGame'));
    }
    ol.append(
      el(
        'li',
        {},
        el(
          'span',
          { class: 'rank', 'aria-label': `#${rank}` },
          rank <= 3 && p.results.length > 1 ? MEDALS[rank - 1] : rank,
        ),
        el('span', { class: 'name' }, playerButton(model, r.player, false)),
        el('span', { class: 'score' }, fmt(r.score)),
        el('span', { class: 'grid' }, r.grid ?? ''),
        delta,
      ),
    );
  }

  // chi gioca di solito ma non ha ancora mandato il risultato (solo per l'ultimo puzzle)
  let missing = [];
  if (idx === list.length - 1) {
    const recent = new Set();
    for (const q of list.slice(Math.max(0, idx - 7), idx)) {
      for (const r of model.puzzles.get(q).results) recent.add(r.player);
    }
    missing = [...recent].filter((name) => !p.rank.has(name)).sort((a, b) => a.localeCompare(b, locale()));
  }
  $('#day-missing').textContent = missing.length
    ? t(missing.length === 1 ? 'missing' : 'missingMany', { names: missing.join(', ') })
    : '';
}

function legendItem(label, color, dashed = false) {
  return el(
    'span',
    { class: 'chip static' },
    el('span', { class: `key${dashed ? ' dashed' : ''}`, style: `color:${color}` }),
    label,
  );
}

function playerButton(model, name, withKey = true) {
  const c = model.colors.get(name);
  return el(
    'button',
    { class: 'player-btn', type: 'button', onclick: () => openPlayer(model, name) },
    withKey ? el('span', { class: `key${c.dashed ? ' dashed' : ''}`, style: `color:${c.color}` }) : null,
    el('span', {}, name),
  );
}

// ---------------------------------------------------------------------------
// Rendering: riquadri, classifica

function tile(label, value, hint) {
  return el(
    'div',
    { class: 'tile' },
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    hint ? el('div', { class: 'hint' }, hint) : null,
  );
}

function renderTiles(model, range) {
  const results = model.results.filter((r) => r.puzzle >= range.from && r.puzzle <= range.to);
  const puzzles = model.puzzleList.filter((p) => p >= range.from && p <= range.to);
  const players = new Set(results.map((r) => r.player));
  const record = results.reduce((best, r) => (!best || r.score > best.score ? r : best), null);
  const avg = results.reduce((s, r) => s + r.score, 0) / (results.length || 1);
  $('#tiles').replaceChildren(
    tile(
      t('tilePuzzles'),
      fmt(puzzles.length),
      puzzles.length ? t('tilePuzzlesHint', { from: puzzles[0], to: puzzles.at(-1) }) : '',
    ),
    tile(t('tilePlayers'), fmt(players.size), t('tilePlayersHint', { n: fmt(results.length) })),
    tile(
      t('tileRecord'),
      record ? fmt(record.score) : '–',
      record ? `${record.player} · #${record.puzzle}` : '',
    ),
    tile(t('tileAvg'), fmt(avg, 1)),
  );
}

// cls: classe di colonna (c-*), usata anche per la classifica su due righe del telefono
const COLUMNS = [
  { key: 'name', label: 'colPlayer', cls: 'left c-name', defaultDir: 'asc' },
  { key: 'games', label: 'colGames', cls: 'c-games' },
  { key: 'avg', label: 'colAvg', cls: 'c-avg' },
  { key: 'best', label: 'colBest', cls: 'c-best' },
  { key: 'wins', label: 'colWins', cls: 'c-wins' },
  { key: 'avgRank', label: 'colAvgRank', cls: 'c-rank', defaultDir: 'asc' },
  { key: 'streak', label: 'colStreak', cls: 'c-streak' },
];

function renderLeaderboard(model, range) {
  const threshold = minGames(model, range);
  const stats = sortStats(playerStats(model, range), state.sort, threshold);
  const table = $('#leaderboard');

  const head = el(
    'tr',
    {},
    el('th', { class: 'pos', scope: 'col' }, '#'),
    COLUMNS.map((c) =>
      el(
        'th',
        {
          scope: 'col',
          class: c.cls,
          'aria-sort':
            state.sort.key === c.key ? (state.sort.dir === 'asc' ? 'ascending' : 'descending') : null,
        },
        el(
          'button',
          {
            type: 'button',
            onclick: () => {
              state.sort =
                state.sort.key === c.key
                  ? { key: c.key, dir: state.sort.dir === 'asc' ? 'desc' : 'asc' }
                  : { key: c.key, dir: c.defaultDir ?? 'desc' };
              renderLeaderboard(model, range);
            },
          },
          t(c.label),
        ),
      ),
    ),
  );

  const qualifies = state.sort.key === 'avg' || state.sort.key === 'avgRank';
  const rows = stats.map((s, i) => {
    const unq = qualifies && s.games < threshold;
    const cells = {
      name: playerButton(model, s.name),
      games: fmt(s.games),
      avg: fmt(s.avg, 1),
      best: fmt(s.best.score),
      wins: fmt(s.wins),
      avgRank: fmt(s.avgRank, 2),
      streak: s.streak ? `${fmt(s.streak)} 🔥` : '0',
    };
    return el(
      'tr',
      { class: unq ? 'unqualified' : null },
      el('td', { class: 'pos' }, unq ? '–' : i + 1),
      COLUMNS.map((c) => el('td', { class: c.cls }, cells[c.key])),
    );
  });
  table.replaceChildren(el('thead', {}, head), el('tbody', {}, rows));

  const someUnqualified = qualifies && stats.some((s) => s.games < threshold);
  $('#lb-note').textContent = someUnqualified ? t('qualifyNote', { n: threshold }) : '';
}

// ---------------------------------------------------------------------------
// Grafico a linee (SVG)

const tooltip = $('#tooltip');

function showTooltip(title, rows, clientX, clientY) {
  tooltip.replaceChildren(
    el('div', { class: 'tt-title' }, title),
    ...rows.map((r) =>
      el(
        'div',
        { class: 'tt-row' },
        el('span', { class: `key${r.dashed ? ' dashed' : ''}`, style: `color:${r.color}` }),
        el('strong', {}, r.value),
        el('span', {}, r.label),
      ),
    ),
  );
  tooltip.hidden = false;
  const { width, height } = tooltip.getBoundingClientRect();
  let x = clientX + 14;
  let y = clientY + 14;
  if (x + width > window.innerWidth - 8) x = clientX - width - 14;
  if (y + height > window.innerHeight - 8) y = clientY - height - 14;
  tooltip.style.left = `${Math.max(8, x)}px`;
  tooltip.style.top = `${Math.max(8, y)}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function niceScale(min, max, count = 5) {
  if (min === max) {
    min -= 10;
    max += 10;
  }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo, hi, ticks };
}

/**
 * @param {HTMLElement} container
 * @param {{ xs: number[], series: Array<{ name, color, dashed, points: Map<number, number>, ref?: boolean }>,
 *           xLabel: (x) => string, digits?: number }} spec
 */
function lineChart(container, spec) {
  container.replaceChildren();
  const { xs, series } = spec;
  if (!xs.length || !series.length) return;

  const W = Math.max(280, Math.round(container.clientWidth || 600));
  const H = Math.round(Math.min(340, Math.max(220, W * 0.42)));
  const narrow = W < 520;
  const m = { t: 12, r: narrow ? 12 : 80, b: 26, l: 40 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;

  const xMin = xs[0];
  const xMax = xs.at(-1);
  const all = series.flatMap((s) => [...s.points.values()]);
  const y = niceScale(Math.min(...all), Math.max(...all));
  const sx = (x) => m.l + (xMax === xMin ? pw / 2 : ((x - xMin) / (xMax - xMin)) * pw);
  const sy = (v) => m.t + ph - ((v - y.lo) / (y.hi - y.lo)) * ph;

  const root = svg('svg', {
    viewBox: `0 0 ${W} ${H}`,
    width: W,
    height: H,
    role: 'img',
    tabindex: 0,
    'aria-label': series.map((s) => s.name).join(', '),
  });

  // griglia e assi
  for (const v of y.ticks) {
    root.append(svg('line', { class: 'gridline', x1: m.l, x2: m.l + pw, y1: sy(v), y2: sy(v) }));
    root.append(svg('text', { x: m.l - 6, y: sy(v) + 4, 'text-anchor': 'end' }, fmt(v)));
  }
  root.append(svg('line', { class: 'baseline', x1: m.l, x2: m.l + pw, y1: m.t + ph, y2: m.t + ph }));
  const every = Math.max(1, Math.ceil(xs.length / Math.max(2, Math.floor(pw / 56))));
  xs.forEach((x, i) => {
    if (i % every !== 0 && i !== xs.length - 1) return;
    if (i !== xs.length - 1 && xs.length - 1 - i < every / 2) return;
    root.append(svg('text', { x: sx(x), y: H - 6, 'text-anchor': 'middle' }, spec.xLabel(x)));
  });

  // linee: si interrompono quando un giocatore salta dei puzzle
  const ordered = [...series].sort((a, b) => (b.ref ? 1 : 0) - (a.ref ? 1 : 0));
  for (const s of ordered) {
    const pts = [...s.points.entries()].sort((a, b) => a[0] - b[0]);
    const segments = [];
    let seg = [];
    for (const [x, v] of pts) {
      const prev = seg.at(-1);
      if (prev && xs.indexOf(x) - xs.indexOf(prev[0]) > 1) {
        segments.push(seg);
        seg = [];
      }
      seg.push([x, v]);
    }
    if (seg.length) segments.push(seg);
    const style = `stroke:${s.color}${s.dashed ? ';stroke-dasharray:6 4' : ''}`;
    for (const sg of segments) {
      if (sg.length === 1) {
        root.append(
          svg('circle', { class: 'dot', cx: sx(sg[0][0]), cy: sy(sg[0][1]), r: 4, style: `fill:${s.color}` }),
        );
      } else {
        const d = sg.map(([x, v], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(v).toFixed(1)}`).join('');
        root.append(svg('path', { class: `series${s.ref ? ' ref' : ''}`, d, style }));
      }
    }
    const lastPt = pts.at(-1);
    if (lastPt && !s.ref) {
      root.append(
        svg('circle', { class: 'dot', cx: sx(lastPt[0]), cy: sy(lastPt[1]), r: 4, style: `fill:${s.color}` }),
      );
    }
  }

  // etichette a fine linea, solo se non si sovrappongono (prima i giocatori, poi la media)
  if (!narrow) {
    const placed = [];
    for (const s of [...series].sort((a, b) => (a.ref ? 1 : 0) - (b.ref ? 1 : 0))) {
      const v = s.points.get(xMax);
      if (v === undefined) continue;
      const ly = sy(v);
      if (placed.some((p) => Math.abs(p - ly) < 14)) continue;
      placed.push(ly);
      const name = s.name.length > 11 ? `${s.name.slice(0, 10)}…` : s.name;
      root.append(svg('text', { class: 'end-label', x: m.l + pw + 8, y: ly + 4 }, name));
    }
  }

  // livello interattivo: mirino verticale + tooltip con tutti i valori
  const cross = svg('line', { class: 'crosshair', y1: m.t, y2: m.t + ph, visibility: 'hidden' });
  const marks = svg('g');
  root.append(cross, marks);
  const hit = svg('rect', { class: 'hit', x: m.l - 8, y: m.t, width: pw + 16, height: ph });
  root.append(hit);

  let current = -1;
  const showAt = (i, clientX, clientY) => {
    current = i;
    const x = xs[i];
    cross.setAttribute('x1', sx(x));
    cross.setAttribute('x2', sx(x));
    cross.setAttribute('visibility', 'visible');
    marks.replaceChildren();
    const rows = [];
    for (const s of series) {
      const v = s.points.get(x);
      if (v === undefined) continue;
      marks.append(svg('circle', { class: 'dot', cx: sx(x), cy: sy(v), r: 4, style: `fill:${s.color}` }));
      rows.push({
        value: fmt(v, spec.digits ?? 0),
        label: s.name,
        color: s.color,
        dashed: s.dashed,
        v,
        ref: s.ref,
      });
    }
    rows.sort((a, b) => (a.ref ? 1 : 0) - (b.ref ? 1 : 0) || b.v - a.v);
    showTooltip(spec.xLabel(x, true), rows, clientX, clientY);
  };
  const hide = () => {
    current = -1;
    cross.setAttribute('visibility', 'hidden');
    marks.replaceChildren();
    hideTooltip();
  };
  const nearest = (clientX) => {
    const rect = root.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < xs.length; i++) if (Math.abs(sx(xs[i]) - px) < Math.abs(sx(xs[best]) - px)) best = i;
    return best;
  };
  hit.addEventListener('pointermove', (e) => showAt(nearest(e.clientX), e.clientX, e.clientY));
  hit.addEventListener('pointerdown', (e) => showAt(nearest(e.clientX), e.clientX, e.clientY));
  hit.addEventListener('pointerleave', hide);
  root.addEventListener('blur', hide);
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i =
      current < 0
        ? xs.length - 1
        : Math.min(xs.length - 1, Math.max(0, current + (e.key === 'ArrowLeft' ? -1 : 1)));
    const rect = root.getBoundingClientRect();
    showAt(i, rect.left + (sx(xs[i]) / W) * rect.width, rect.top + m.t);
  });

  container.append(root);
}

function puzzleLabel(model) {
  return (x, long) => {
    if (!long) return `#${x}`;
    const date = model.puzzles.get(x)?.date;
    return date ? `#${x} · ${fmtDate(date)}` : `#${x}`;
  };
}

function groupSeries(model, xs) {
  const values = model.puzzleList.map((x) => model.puzzles.get(x).avg);
  const vals = state.trendMode === 'avg' ? rolling(values) : values;
  const byPuzzle = new Map(model.puzzleList.map((x, i) => [x, vals[i]]));
  return {
    name: t('groupAvg'),
    color: 'var(--ref)',
    ref: true,
    points: new Map(xs.map((x) => [x, byPuzzle.get(x)])),
  };
}

function playerSeries(model, name, range) {
  const list = model.byPlayer.get(name);
  const vals = state.trendMode === 'avg' ? rolling(list.map((r) => r.score)) : list.map((r) => r.score);
  const points = new Map();
  list.forEach((r, i) => {
    if (r.puzzle >= range.from && r.puzzle <= range.to) points.set(r.puzzle, vals[i]);
  });
  const c = model.colors.get(name);
  return { name, color: c.color, dashed: c.dashed, points };
}

function renderTrend(model, range) {
  const stats = playerStats(model, range);
  const active = new Set(stats.map((s) => s.name));
  if (!state.selected) {
    const threshold = minGames(model, range);
    state.selected = new Set(
      sortStats(stats, { key: 'avg', dir: 'desc' }, threshold)
        .slice(0, 3)
        .map((s) => s.name),
    );
  }

  const chips = $('#trend-players');
  chips.replaceChildren(
    ...model.players
      .filter((p) => active.has(p))
      .map((name) => {
        const c = model.colors.get(name);
        return el(
          'button',
          {
            type: 'button',
            class: 'chip',
            'aria-pressed': state.selected.has(name) ? 'true' : 'false',
            onclick: () => {
              if (state.selected.has(name)) state.selected.delete(name);
              else state.selected.add(name);
              renderTrend(model, range);
            },
          },
          el('span', { class: `key${c.dashed ? ' dashed' : ''}`, style: `color:${c.color}` }),
          name,
        );
      }),
    legendItem(t('groupAvg'), 'var(--ref)'),
  );

  for (const b of document.querySelectorAll('#trend-mode button')) {
    b.setAttribute('aria-pressed', String(b.dataset.mode === state.trendMode));
  }

  const container = $('#trend-chart');
  const xs = model.puzzleList.filter((p) => p >= range.from && p <= range.to);
  const chosen = [...state.selected].filter((n) => active.has(n));
  if (!chosen.length) {
    container.replaceChildren(el('div', { class: 'empty' }, t('noSelection')));
    return;
  }
  lineChart(container, {
    xs,
    series: [groupSeries(model, xs), ...chosen.map((n) => playerSeries(model, n, range))],
    xLabel: puzzleLabel(model),
    digits: state.trendMode === 'avg' ? 1 : 0,
  });
}

// ---------------------------------------------------------------------------
// Testa a testa

function renderH2H(model, range) {
  const threshold = minGames(model, range);
  const order = sortStats(playerStats(model, range), { key: 'avg', dir: 'desc' }, threshold).map(
    (s) => s.name,
  );
  const idx = new Map(order.map((n, i) => [n, i]));
  const n = order.length;
  const w = Array.from({ length: n }, () => new Array(n).fill(0));
  const d = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const p of model.puzzleList) {
    if (p < range.from || p > range.to) continue;
    const rs = model.puzzles.get(p).results;
    for (let a = 0; a < rs.length; a++) {
      for (let b = a + 1; b < rs.length; b++) {
        const i = idx.get(rs[a].player);
        const j = idx.get(rs[b].player);
        if (rs[a].score > rs[b].score) w[i][j]++;
        else if (rs[a].score < rs[b].score) w[j][i]++;
        else {
          d[i][j]++;
          d[j][i]++;
        }
      }
    }
  }

  const head = el(
    'tr',
    {},
    el('th', {}),
    order.map((name) => el('th', { scope: 'col', title: name }, el('span', {}, name))),
  );
  const body = order.map((rowName, i) =>
    el(
      'tr',
      {},
      el('th', { scope: 'row' }, rowName),
      order.map((colName, j) => {
        if (i === j) return el('td', {}, el('div', { class: 'self' }, '·'));
        const wins = w[i][j];
        const losses = w[j][i];
        const draws = d[i][j];
        const games = wins + losses;
        if (!games && !draws) return el('td', {}, el('div', { class: 'self' }, '–'));
        const share = games ? wins / games : 0.5;
        const strength = Math.round(Math.abs(share - 0.5) * 2 * 80);
        const hue = share >= 0.5 ? 'var(--div-pos)' : 'var(--div-neg)';
        const tip = t('h2hTip', { a: rowName, b: colName, w: wins, l: losses, d: draws });
        const show = (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          showTooltip(tip, [], e.clientX ?? r.right, e.clientY ?? r.bottom);
        };
        return el(
          'td',
          {},
          el(
            'div',
            {
              tabindex: 0,
              'aria-label': tip,
              style: `background:color-mix(in oklab, ${hue} ${strength}%, var(--div-mid))`,
              onpointermove: show,
              onpointerleave: hideTooltip,
              onfocus: show,
              onblur: hideTooltip,
            },
            // su schermi stretti il numero può andare a capo dopo il trattino
            el('span', {}, `${wins}–`, el('wbr'), losses),
          ),
        );
      }),
    ),
  );
  $('#h2h').replaceChildren(el('thead', {}, head), el('tbody', {}, body));
}

// ---------------------------------------------------------------------------
// Scheda giocatore

function openPlayer(model, name) {
  const dialog = $('#player-dialog');
  const all = { from: -Infinity, to: Infinity };
  const s = playerStats(model, all).find((x) => x.name === name);
  if (!s) return;
  $('#pd-title').textContent = name;
  $('#pd-tiles').replaceChildren(
    tile(t('colGames'), fmt(s.games)),
    tile(t('colAvg'), fmt(s.avg, 1)),
    tile(t('colBest'), fmt(s.best.score), `#${s.best.puzzle}`),
    tile(t('tileWorst'), fmt(s.worst.score), `#${s.worst.puzzle}`),
    tile(t('colWins'), fmt(s.wins)),
    tile(t('tilePodiums'), fmt(s.podiums), MEDALS.map((m, i) => `${m} ${fmt(s.podium[i])}`).join(' · ')),
    tile(
      t('colStreak'),
      `${fmt(s.streak)}${s.streak ? ' 🔥' : ''}`,
      `${t('tileStreakBest')}: ${fmt(s.bestStreak)}`,
    ),
  );

  const list = model.byPlayer.get(name);
  const rows = [...list].reverse().map((r) => {
    const p = model.puzzles.get(r.puzzle);
    return el(
      'tr',
      {},
      el('td', { class: 'left' }, `#${r.puzzle}`),
      el('td', { class: 'left' }, fmtDate(p.date)),
      el('td', {}, fmt(r.score)),
      el('td', {}, `${p.rank.get(name)}/${p.results.length}`),
      el('td', { class: 'grid-cell' }, r.grid ?? ''),
    );
  });
  $('#pd-history').replaceChildren(
    el(
      'thead',
      {},
      el(
        'tr',
        {},
        el('th', { class: 'left' }, t('colPuzzle')),
        el('th', { class: 'left' }, t('colDate')),
        el('th', {}, t('colScore')),
        el('th', {}, t('colRank')),
        el('th', { class: 'left' }, t('colGrid')),
      ),
    ),
    el('tbody', {}, rows),
  );

  const c = model.colors.get(name);
  $('#pd-legend').replaceChildren(
    legendItem(name, c.color, c.dashed),
    legendItem(t('groupAvg'), 'var(--ref)'),
  );

  if (!dialog.open) dialog.showModal();
  const xs = model.puzzleList.filter((p) => p >= list[0].puzzle);
  const savedMode = state.trendMode;
  state.trendMode = 'score';
  lineChart($('#pd-chart'), {
    xs,
    series: [groupSeries(model, xs), playerSeries(model, name, all)],
    xLabel: puzzleLabel(model),
  });
  state.trendMode = savedMode;
}

// ---------------------------------------------------------------------------
// Pagina

let model = null;

function applyStaticTexts() {
  document.documentElement.lang = state.lang;
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  for (const node of document.querySelectorAll('[data-i18n-label]'))
    node.setAttribute('aria-label', t(node.dataset.i18nLabel));
  $('#lang').value = state.lang;
  if (state.status) setStatus(state.status.key, state.status.vars);
}

function renderAll() {
  applyStaticTexts();
  if (!model) return;
  const range = periodRange(model, state.period);
  for (const b of document.querySelectorAll('#period button')) {
    b.setAttribute('aria-pressed', String(b.dataset.period === state.period));
  }
  if (model.updatedAt) {
    const time = new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(model.updatedAt),
    );
    $('#updated').textContent = t('updated', { time });
  }
  renderDay(model);
  renderTiles(model, range);
  renderLeaderboard(model, range);
  renderTrend(model, range);
  renderH2H(model, range);
}

function setStatus(key, vars) {
  state.status = key ? { key, vars } : null;
  $('#status').textContent = key ? t(key, vars) : '';
}

function bindControls() {
  $('#lang').addEventListener('change', (e) => {
    state.lang = e.target.value;
    prefs.set('lang', state.lang);
    renderAll();
  });
  $('#day-prev').addEventListener('click', () => {
    const i = model.puzzleList.indexOf(state.dayPuzzle);
    if (i > 0) state.dayPuzzle = model.puzzleList[i - 1];
    renderDay(model);
  });
  $('#day-next').addEventListener('click', () => {
    const i = model.puzzleList.indexOf(state.dayPuzzle);
    if (i < model.puzzleList.length - 1) state.dayPuzzle = model.puzzleList[i + 1];
    renderDay(model);
  });
  for (const b of document.querySelectorAll('#period button')) {
    b.addEventListener('click', () => {
      state.period = b.dataset.period;
      state.selected = null;
      prefs.set('period', state.period);
      renderAll();
    });
  }
  for (const b of document.querySelectorAll('#trend-mode button')) {
    b.addEventListener('click', () => {
      state.trendMode = b.dataset.mode;
      prefs.set('trendMode', state.trendMode);
      renderTrend(model, periodRange(model, state.period));
    });
  }
  let lastWidth = window.innerWidth;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!model || window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      renderTrend(model, periodRange(model, state.period));
    }, 150);
  });
  window.addEventListener('scroll', hideTooltip, { passive: true });
}

// Dati inventati per ?demo
function demoData() {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  const people = [
    ['Nils', 268, 1],
    ['Daniel', 262, 1],
    ['Nic', 255, 1],
    ['Flu', 249, 5],
    ['Jonas', 243, 1],
    ['Anna', 240, 52],
    ['Fuldup', 236, 10],
    ['Elia', 228, 20],
    ['Mattia', 251, 1],
  ];
  const icons = ['🦐', '🦐', '🦐', '🐟', '⚪', '🔴', '⬛'];
  const results = [];
  const start = Date.UTC(2026, 6, 16);
  for (let puzzle = 1; puzzle <= 80; puzzle++) {
    const date = new Date(start + (puzzle - 1) * 864e5).toISOString().slice(0, 10);
    const difficulty = gauss() * 25;
    for (const [player, mean, from] of people) {
      if (puzzle < from || rand() < 0.15) continue;
      const score = Math.max(60, Math.round(mean + difficulty + gauss() * 35));
      const grid = Array.from({ length: 7 }, () => icons[Math.floor(rand() * icons.length)]).join('');
      results.push({
        puzzle,
        player,
        score,
        date,
        ts: start / 1000 + puzzle * 86400 + Math.floor(rand() * 50000),
        grid,
      });
    }
  }
  return { version: 1, updatedAt: new Date().toISOString(), results };
}

async function loadNames() {
  try {
    const res = await fetch(`data/names.json?t=${Date.now()}`, { cache: 'no-store' });
    return res.ok ? nameMap(await res.json()) : new Map();
  } catch {
    return new Map(); // senza names.json si usano i nomi di WhatsApp
  }
}

async function main() {
  applyStaticTexts();
  bindControls();
  setStatus('loading');
  let data;
  let names = new Map();
  try {
    if (state.demo) {
      data = demoData();
    } else {
      const namesLoaded = loadNames();
      const res = await fetch(`data/stats.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
      names = await namesLoaded;
    }
  } catch (err) {
    setStatus('error', { msg: err.message });
    return;
  }
  model = prepare(data, names);
  if (!model.results.length) {
    setStatus('empty');
    return;
  }
  setStatus(state.demo ? 'demo' : null);
  $('#content').hidden = false;
  renderAll();
}

main();
