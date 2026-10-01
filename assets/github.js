// Direct writes to the repo from the browser.
//
// The key lives in this device's browser storage only. It is never written to
// the repo, so the public site never ships it. Each device gets its key pasted
// once, from the collapsible section at the bottom of the dashboard.
//
// Every save is one commit, even when it touches several files, built with the
// Git Data API: read the branch head, write a new tree on top of it, point the
// branch at the new commit. If something else committed in between (a Claude
// review, the health Shortcut), the branch update is refused and the whole
// thing reruns against the newer head, so nothing written elsewhere is lost.

const GH = (() => {
  const REPO   = 'Feirzen/bulk-manager';
  const BRANCH = 'main';
  const KEY    = 'bm.gh.token';
  const API    = 'https://api.github.com';

  const token = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const hasToken = () => !!token();
  const setToken = t => { try { localStorage.setItem(KEY, t.trim()); } catch (e) {} };
  const clearToken = () => { try { localStorage.removeItem(KEY); } catch (e) {} };

  // Plain-language errors. He should never have to decode a status code.
  function friendly(status, msg) {
    if (status === 401) return 'GitHub rejected the key. It may have expired. Paste a new one at the bottom of the dashboard.';
    if (status === 403 || status === 404) return "This key can't write to bulk-manager. It needs Contents set to Read and write on that repo.";
    if (status === 0) return "Couldn't reach GitHub. Nothing is lost, it's all still on this device. Try again in a sec.";
    return 'GitHub said: ' + (msg || ('error ' + status));
  }

  async function api(path, opts = {}, tok) {
    const t = tok || token();
    if (!t) { const e = new Error('No key on this device yet. Add one at the bottom of the dashboard.'); e.status = -1; throw e; }
    let r;
    try {
      r = await fetch(API + path, {
        method: opts.method || 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': 'Bearer ' + t,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(opts.body ? { 'Content-Type': 'application/json' } : {})
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined
      });
    } catch (e) {
      const err = new Error(friendly(0)); err.status = 0; throw err;
    }
    if (!r.ok) {
      let msg = '';
      try { msg = (await r.json()).message; } catch (e) {}
      const err = new Error(friendly(r.status, msg));
      err.status = r.status; err.raw = msg;
      throw err;
    }
    return r.status === 204 ? null : r.json();
  }

  function decode(b64) {
    const bin = atob(String(b64 || '').replace(/\s/g, ''));
    return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
  }

  // A file's text at a given commit, or null if it does not exist there yet.
  async function readText(path, ref) {
    try {
      const f = await api(`/repos/${REPO}/contents/${path}?ref=${ref || BRANCH}`);
      return decode(f.content);
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async function readJson(path, ref) {
    const t = await readText(path, ref);
    if (t == null) return null;
    try { return JSON.parse(t); } catch (e) { return null; }
  }

  // Checks a key before it is stored, so a typo fails here and not mid-workout.
  async function test(tok) {
    const repo = await api(`/repos/${REPO}`, {}, tok);
    const canWrite = !!(repo.permissions && (repo.permissions.push || repo.permissions.admin));
    return { canWrite };
  }

  // paths: files to read before writing. mutate(current) receives
  // { path: parsedJson | null } and returns { path: object | string } for every
  // file to write. Anything it leaves out is untouched.
  async function commit(message, paths, mutate) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const ref  = await api(`/repos/${REPO}/git/ref/heads/${BRANCH}`);
      const head = ref.object.sha;
      const base = await api(`/repos/${REPO}/git/commits/${head}`);

      const current = {};
      await Promise.all(paths.map(async p => { current[p] = await readJson(p, head); }));

      const out = await mutate(current);
      const entries = Object.entries(out).filter(([, v]) => v != null).map(([path, v]) => ({
        path, mode: '100644', type: 'blob',
        content: typeof v === 'string' ? v : JSON.stringify(v, null, 2) + '\n'
      }));
      if (!entries.length) return null;

      const tree = await api(`/repos/${REPO}/git/trees`, {
        method: 'POST', body: { base_tree: base.tree.sha, tree: entries }
      });
      const made = await api(`/repos/${REPO}/git/commits`, {
        method: 'POST', body: { message, tree: tree.sha, parents: [head] }
      });
      try {
        await api(`/repos/${REPO}/git/refs/heads/${BRANCH}`, {
          method: 'PATCH', body: { sha: made.sha, force: false }
        });
        return made.sha;
      } catch (e) {
        // 422 means the branch moved underneath us. Rebuild on the new head.
        if (e.status === 422 && attempt < 3) continue;
        throw e;
      }
    }
  }

  return { REPO, hasToken, setToken, clearToken, test, readJson, commit };
})();
