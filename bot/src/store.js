// Dove vengono salvate le statistiche:
//  - GitHubStore: aggiorna docs/data/stats.json direttamente nel repository via API
//  - LocalStore:  scrive il file su disco (utile per test o se fai commit a mano)

import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname } from 'node:path';
import { emptyData, mergeResults, parseData, serialize, describeChanges } from './stats.js';

export class LocalStore {
  constructor(path) {
    this.path = path;
    this.name = `file ${path}`;
  }

  async load() {
    try {
      return parseData(await readFile(this.path, 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') return emptyData();
      throw err;
    }
  }

  async merge(incoming, { aliasMap } = {}) {
    const result = mergeResults(await this.load(), incoming, { aliasMap });
    if (result.changed) {
      await mkdir(dirname(this.path), { recursive: true });
      const tmp = `${this.path}.tmp`;
      await writeFile(tmp, serialize(result.data));
      await rename(tmp, this.path);
    }
    return result;
  }
}

export class GitHubStore {
  /**
   * @param {{ token: string, repo: string, branch?: string, path: string, fetch?: typeof fetch }} opts
   */
  constructor({ token, repo, branch = 'main', path, fetch: fetchImpl = globalThis.fetch }) {
    if (!token) throw new Error('GITHUB_TOKEN mancante');
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo ?? '')) throw new Error(`GITHUB_REPO non valido: "${repo}"`);
    this.token = token;
    this.repo = repo;
    this.branch = branch;
    this.path = path.replace(/^\/+/, '');
    this.fetch = fetchImpl;
    this.name = `github.com/${repo} (${branch}:${this.path})`;
  }

  url() {
    const path = this.path.split('/').map(encodeURIComponent).join('/');
    return `https://api.github.com/repos/${this.repo}/contents/${path}`;
  }

  headers(accept = 'application/vnd.github+json') {
    return {
      Accept: accept,
      Authorization: `Bearer ${this.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'krillion-stats-bot',
    };
  }

  async request(url, init = {}, { allow404 = false } = {}) {
    const res = await this.fetch(url, init);
    if (!res.ok && !(allow404 && res.status === 404)) {
      const body = await res.text().catch(() => '');
      const err = new Error(`GitHub API ${init.method ?? 'GET'} ${res.status}: ${body.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    return res;
  }

  /** @returns {Promise<{ data: object, sha: string | null }>} */
  async loadWithSha() {
    const ref = `?ref=${encodeURIComponent(this.branch)}`;
    const res = await this.request(this.url() + ref, { headers: this.headers() }, { allow404: true });
    // file non ancora creato (se è il token o il repo a non andare, il PUT fallirà)
    if (res.status === 404) return { data: emptyData(), sha: null };
    const meta = await res.json();
    let text;
    if (meta.encoding === 'base64' && meta.content) {
      text = Buffer.from(meta.content, 'base64').toString('utf8');
    } else {
      // file > 1 MB: l'API non include il contenuto, va scaricato "raw"
      const raw = await this.request(this.url() + ref, {
        headers: this.headers('application/vnd.github.raw+json'),
      });
      text = await raw.text();
    }
    return { data: parseData(text), sha: meta.sha };
  }

  async load() {
    return (await this.loadWithSha()).data;
  }

  async merge(incoming, { aliasMap } = {}) {
    for (let attempt = 1; ; attempt++) {
      const { data, sha } = await this.loadWithSha();
      const result = mergeResults(data, incoming, { aliasMap });
      if (!result.changed) return result;

      const body = {
        message: describeChanges(result.added, result.updated),
        content: Buffer.from(serialize(result.data), 'utf8').toString('base64'),
        branch: this.branch,
        ...(sha ? { sha } : {}),
      };
      try {
        await this.request(this.url(), {
          method: 'PUT',
          headers: { ...this.headers(), 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return result;
      } catch (err) {
        // 409/422: il file è cambiato nel frattempo (sha vecchio) → ricarica e riprova
        if ((err.status === 409 || err.status === 422) && attempt < 4) continue;
        throw err;
      }
    }
  }
}

export function createStore(config) {
  if (config.githubToken) {
    return new GitHubStore({
      token: config.githubToken,
      repo: config.githubRepo,
      branch: config.githubBranch,
      path: config.statsPath,
    });
  }
  return new LocalStore(config.localStatsFile);
}
