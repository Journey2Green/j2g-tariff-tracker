# Pre-Publish Security Review — tariff-dashboard

**Project:** `/home/user/workspace/tariff-dashboard`
**Context:** Static single-page dashboard (vanilla HTML/CSS/JS, locally-bundled Chart.js). Visualises public NERSA/municipal electricity tariff data and runs client-side calculators. No backend, no database, no user data collected, no auth, no API keys/secrets. Public/client-facing (Journey2Green).

## Security Review Results

### BLOCK (must fix before publishing)
None.

### WARN (inform user, let them decide)
None.

### PASS
- **Dependency Audit (Check 1):** N/A — no `package.json` or `requirements.txt`; project has zero installed dependencies. Only third-party code is a locally-bundled copy of **Chart.js v4.4.3** (`chart.umd.min.js`), a current, non-EOL release with no known critical CVEs at this version.
- **Hardcoded Secrets (Check 2):** No API keys, tokens, private keys, or passwords found in any source file. No `.env` files present. No secrets found in git history either.
- **Common Vulnerability Patterns (Check 3):** Found 7 uses of `innerHTML` in `app.js` (lines 163, 174, 240, 241, 299, 309, 590). All were manually reviewed — each renders only hardcoded static data arrays defined in the same file (`STATUS`, `METROS`, `IBT`, `HISTORY`, `SOURCES`) or numeric values computed from client-side calculator math (formatted via `Math.round`, `.toFixed()`, `toLocaleString`). No path exists for user-controlled or URL/storage-derived strings to reach `innerHTML`: all `<input>` elements in `index.html` are `type="range"`, `type="number"`, or `type="radio"` (numeric/enum only, no free text), and the app contains no `location.hash`, `location.search`, `URLSearchParams`, `document.cookie`, or `localStorage`/`sessionStorage` reads that could reflect attacker-controlled content. No `eval`, `new Function`, or `document.write` usage. Not exploitable — this is standard static-template rendering, not XSS.
- **Open CORS / Missing Auth (Check 4):** No matches — the app makes no network calls at all (no `fetch`, `XMLHttpRequest`, or `axios` usage found); it is fully static with no backend or API endpoints, so CORS/auth is not applicable.

## Summary

**No BLOCK or WARN findings.** This is a clean, fully static, dependency-free (aside from one current, locally-bundled Chart.js) client-side dashboard with no secrets, no network calls, no reflected/injectable input paths, and no auth surface. Safe to publish as-is.

One minor housekeeping note (not a security finding): the project directory contains a `.git/` folder. This won't be part of the published static site content, but if the publish process ever copies the whole directory, `.git/` should be excluded — git history was checked and contains no secrets, so there is no urgency.
