# HANDOFF — 9xTechnology Digital Executive Hub (Phase 1)

> Session handoff for the next agent. Read `AGENTS.md` first (engineering rules),
> then this file. Nothing below duplicates code — follow the paths.
> Status date: 2026-09-22. **Nothing has been committed yet** (branch `master`, only commit is the Create Next App scaffold).

---

## 1. Decisions made this session (binding)

| Decision | Why |
| --- | --- |
| **Stay on Next.js 16.3 / React 19.2 / Tailwind 4 / bun** — do NOT migrate to Vite / React 18 as AGENTS.md §4 describes. | User explicitly: "continue with the latest version, don't downgrade". |
| **Code lives in private folders under `app/`** (`_components`, `_hooks`, `_lib`, `_config`, `_theme`, `_styles`), not `src/`. | User chose this layout. Imports use `@/app/_…` (tsconfig `@/*` → `./*`). |
| **No `vite-plugin-pwa` / Serwist.** Manifest via `app/manifest.ts`; offline via hand-written `public/sw.js`. | Zero-dependency; Next 16 uses Turbopack. |
| **Tokens in Tailwind v4 `@theme`** (`app/globals.css`) mirrored in `app/_theme/tokens.ts`; default palette cleared (`--color-*: initial`) so only brand tokens exist. | Tailwind v4 has no `tailwind.config.ts`. A test enforces the two stay in sync. |
| **Env vars are `NEXT_PUBLIC_DEMO_PASSWORD` and `NEXT_PUBLIC_SITE_URL` (see `.env.example`), not `VITE_*`. | Next.js env convention. |
| **Brand is 9xTechnology**: All references, icons, and logos switched to `public/9xTechnology/`, and all legacy `MoneyplantFX` assets removed per user request. | Rebranding to 9xTechnology requested by stakeholder. |
| Do **not** delete/move user files without asking (auto-mode blocked deletions; user rejected a move). Icons stay in `public/MoneyplantFX/`. | User preference. |
| Before writing Next-specific code, check `node_modules/next/dist/docs/` — this Next version has breaking changes (e.g. `next/image` `priority` → `preload`). | Original scaffold AGENTS.md rule. |

AGENTS.md still says Vite/React 18/`src/` — it is **out of date on stack & structure**; updating it is an open question for the user (don't edit without approval, §67).

---

## 2. What was built
### Components — `app/_components/`
`AppBar` (`#header-brand-logo-mark` target, visual-only bell), `NodesStatusPill` (static), `CorporateIdentity`, `ProfileCard` (next/image `preload` + eager + high priority; initials fallback when portrait file missing), `TelegramCard`, `AppStoreHub`, `CrmCard` (primary orange / secondary RESTRICTED), `DemoSandbox` + `CredentialField` (masked password, `aria-pressed` eye, per-field copy, "Request from CTO" fallback hides copy/toggle), `QrTile` (qrcode.react SVG, `role="img"`, unavailable tile for TODO/unsafe URLs), `ExternalAction` (link or disabled "Coming soon" — never `#`), `CopyButton`, `SaveContactButton`, `InstallPwaButton`, `LegalFooter`, `Toast` (context provider, `aria-live="polite"`, 2000 ms, safe-area), `HeroReveal`, `LogoMark` (inline SVG), `SurfaceCard`, `ServiceWorkerRegister` (prod only), `LuxuryPreloader`.

### Cinematic preloader — how it works (non-obvious)
1. **Decision is made once, pre-paint,** by `introBootScript` in `app/_lib/intro.ts` (inlined in `<head>`): adds `html.lux-active` (play) or `html.lux-skip`. Rules: reduced-motion → skip; `?intro=1`/`?preview=1` → play; first visit this session (`sessionStorage` key `mpfx_intro_seen`) → play. This avoids SSR flash; the React component just reads the class.
2. `LuxuryPreloader` phases `idle → counting → fadeUi → revealed → done` (timings exported as constants). At `revealed` it measures the flyer + `#header-brand-logo-mark` with `getBoundingClientRect()` and sets a transform; missing target → fade out. At `done` it removes `lux-active` in a layout effect in the same commit it unmounts → no duplicate-logo flash.
3. Safety timeout + Skip button; scroll locked via `html.lux-active { overflow:hidden }`.
4. Reveal state shared through a tiny external store `app/_lib/reveal.ts` (`useSyncExternalStore` in `HeroReveal`).
5. Styles: `app/_styles/luxury-preloader.css` (curtains `scaleX(0)` with `cubic-bezier(0.77,0,0.175,1)`, text masks `translateY(120%)→0`, hero bg scale). Animations use `backwards` fill so they don't override the inline flight transform.

### Lib — `app/_lib/`
`url.ts` (`resolvePublicUrl`: https only, rejects token/jwt/session/auth params, credentials-in-URL), `clipboard.ts` (Clipboard API → textarea/execCommand fallback), `credentials.ts` (payload; omits password line if unavailable), `vcard.ts` (`buildVCard`; `public/hemant.vcf` must equal its output — tested), `intro.ts`, `reveal.ts`, `preload.ts` (server-only: `publicAssetOrNull` so a missing portrait isn't preloaded as a 404).

### Hooks — `app/_hooks/`
`useClipboard` (1.5 s copied flag + toast / failure toast), `usePwaInstall` (`beforeinstallprompt` deferred, `appinstalled`, standalone + iOS detection → iOS hint).

### PWA / static
- `app/manifest.ts` → `/manifest.webmanifest` (name/short_name/description/standalone/start_url/scope/theme from config + tokens; icons from `public/MoneyplantFX/`).
- `public/sw.js`: precaches shell + scrapes `/_next/static/*` from cached HTML; navigations network-first → cached `/`; static assets cache-first; ignores non-GET, cross-origin, `/api/`. Bump `VERSION` to invalidate.
- `next.config.ts`: headers for `/sw.js` (no-cache, CSP) and `/hemant.vcf` (`text/vcard`).
- `public/hemant.vcf` (name/org/title/Telegram only), `public/img/logo-mpfx.svg`, `app/favicon.ico` replaced with brand favicon.

### Tooling
- `package.json` scripts: `dev, build, start, lint, typecheck, test, test:watch, test:e2e, format, format:check`.
- Added deps: `qrcode.react`, `lucide-react`; dev: `vitest`, `@vitejs/plugin-react`, `jsdom`, Testing Library (react/dom/jest-dom/user-event), `@playwright/test`, `prettier`, `eslint-config-prettier`.
- `vitest.config.mts` (+ `tests/setup.ts`), `playwright.config.ts` (390×844, builds + starts on port 3100 with a fake demo password), `eslint.config.mjs` (next + prettier), `.prettierrc` (printWidth 110), `.prettierignore`, `.env.example`, `.gitignore` additions.

### Tests — `tests/`
- `tests/lib/` — url safety, clipboard (API/fallback/failure), credentials, vCard file sync, token sync, config has no fake/auth URLs, intro boot script (first visit, session skip, `?intro=1`, `?preview=1`, reduced motion, blocked storage).
- `tests/hooks/` — useClipboard, usePwaInstall.
- `tests/components/` — Toast, CredentialField, DemoSandbox (env-stubbed), QrTile, SaveContactButton, LuxuryPreloader (phases, flight math, missing target, forceShow, skip, safety timeout, timer cleanup). Note: advance fake timers **one phase per `act()`** — effects flush between acts.
- `tests/e2e/smoke.spec.ts` — full first-session flow, session skip, `?intro=1`, reduced motion, no horizontal overflow at 360/370/390/414/430. Clipboard assertion normalizes CRLF (Windows).

### Last verified state
`bun run lint` ✔ · `bunx tsc --noEmit` ✔ · `bun run test` 48/48 ✔ · `bun run build` ✔ · `bunx playwright test` 9/9 ✔.
Screenshots confirmed intro, mid-flight landing in AppBar, and final card at 390 px.

---

## 3. Not done / known gaps

- **Lighthouse not run** — `npx lighthouse@latest` failed (`ETARGET tldts-core@^7.4.14` registry issue). Perf ≥ 90 / A11y ≥ 95 unverified. Retry later or use Chrome DevTools Lighthouse manually against `bun run build && bun run start`.
- Offline mode and real-device PWA install not manually tested (SW only registers in production).
- `docs/PRD.md` does not exist in the repo.
- `public/MoneyplantFX/site.webmanifest` is now unused (superseded by `app/manifest.ts`); awaiting user OK to delete.
- Final report per AGENTS §68 was delivered in chat; no commit made — ask before committing (branch off `master` first).

## 4. Open questions for the user
1. Update AGENTS.md stack/structure sections to Next 16 + `app/_*` layout?
2. Where is `docs/PRD.md`?
3. Keep the purple `public/moneyplant-og.png` or produce the Sapphire/blue OG image AGENTS §44 describes?
4. Admin copy "route routing" — typo? (kept verbatim)
5. Delete `public/MoneyplantFX/site.webmanifest`?
6. Production domain for `NEXT_PUBLIC_SITE_URL`?

## 5. Stakeholder URLs, Credentials, 9xTechnology Rebrand & Clean Purge (2026-09-22)
- Rebranded completely from MoneyPlantFX to **9xTechnology** across all titles, copy, metadata, and legal text.
- Executive identity: **Hemant — CTO @ 9xTechnology**.
- Brand icons & favicons: switched to `public/9xTechnology/` assets (`favicon.ico`, `16x16`, `32x32`, `apple-touch-icon`, `192x192`, `512x512`).
- LogoMark: renders 9xTechnology logo squircle in AppBar and preloader animation flight.
- Custom luxury 1200×630 OG image generated at `public/9xtechnology-og.png` with gold 9xTechnology emblem, glowing rim portrait, telemetry badges, and title.
- Legacy assets completely deleted: `public/MoneyplantFX/`, `public/moneyplant-og.png`, `public/img/logo-mpfx.svg`.
- Zero occurrences of `moneyplant` or `mpfx` across all codebase files, tests, package names, and service worker.
- Telegram handle: `adamken0007` (`https://t.me/adamken0007`).
- App Store: `https://apps.apple.com/us/app/global-apex-markets/id6773324199`.
- Google Play: `https://play.google.com/store/apps/details?id=com.ninextechnology.globalapexmarkets`.
- Client Portal: `https://wallet.fxcapital24.com` (demo creds: `demouser@gmail.com` / `Demouser@123`).
- Admin Dashboard: `https://admin.fxcapital24.com` (demo creds: `GlobalApexAdmin` / `GlobalApex@123`).
- Demo Sandbox: Account ID `77777`, Password `Test@12345` (`NEXT_PUBLIC_DEMO_PASSWORD`), Server `9xTechnology-Demo01`.
- Executive Portrait: `public/img/HemantPhoto.png` configured and centered in `ProfileCard.tsx`.
- All test suites passing (50/50 unit tests, 9/9 Playwright tests, 0 TS/ESLint errors, clean Next.js 16 build).

---

## 6. Suggested skills

- **`run`** — launch the app (`bun run build && bun run start`) and visually confirm changes / the intro at 390 px.
- **`claude-in-chrome`** (or `anthropic-skills:chrome-browser`) — run Lighthouse from DevTools, test PWA install and offline mode in a real browser, since the CLI Lighthouse install is blocked.
- **`code-review`** — review the full uncommitted diff before the first commit.
- **`security-review`** — confirm no credentials/tokens leak into URLs, QR codes, the SW cache or the bundle.
- **`simplify`** — quality pass over `app/_components` once features settle.
- **`artifact-design`** / **`Artifact` quickstart (`design`)** — if asked to design the replacement OG image (AGENTS §44).
- **`init`** — only if the user approves rewriting AGENTS.md/CLAUDE.md to reflect the Next.js stack.

## 7. Useful commands
```bash
bun install
bun run dev
bun run lint && bunx tsc --noEmit && bun run test && bun run build
bunx playwright test          # builds + serves on :3100 automatically
```
