import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAliasMap } from './stats.js';

export const BOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const envFile = resolve(BOT_DIR, '.env');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
}

function loadAliases(file) {
  if (!existsSync(file)) return {};
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  const { _comment, ...aliases } = raw;
  return aliases;
}

export function loadConfig() {
  loadEnv();
  const env = process.env;
  const fromBot = (p) => resolve(BOT_DIR, p);

  const aliasesFile = fromBot(env.ALIASES_FILE || 'aliases.json');
  const aliases = loadAliases(aliasesFile);

  return {
    groupName: (env.GROUP_NAME || 'Krillion Daily').trim(),
    groupJid: env.GROUP_JID?.trim() || null,
    myName: env.MY_NAME?.trim() || null,
    timeZone: env.TIMEZONE || 'Europe/Zurich',

    githubToken: env.GITHUB_TOKEN?.trim() || null,
    githubRepo: env.GITHUB_REPO?.trim() || 'MattiaDipalma/krillion_stats',
    githubBranch: env.GITHUB_BRANCH?.trim() || 'main',
    statsPath: env.STATS_PATH?.trim() || 'docs/data/stats.json',
    localStatsFile: fromBot(env.LOCAL_STATS_FILE || '../docs/data/stats.json'),

    authDir: fromBot(env.AUTH_DIR || 'auth'),
    stateDir: fromBot(env.STATE_DIR || 'state'),
    flushDelayMs: Math.max(5, Number(env.FLUSH_DELAY_SECONDS) || 60) * 1000,
    pairingPhone: env.PAIRING_PHONE?.replace(/\D/g, '') || null,

    aliasesFile,
    aliases,
    aliasMap: buildAliasMap(aliases),
  };
}
