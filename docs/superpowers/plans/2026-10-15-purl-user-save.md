# Save with Purl to the Visitor's Account Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make "Save with Purl" save into the visitor's own Purl library via browser-side OAuth (PKCE), and remove the owner's API key and server proxy.

**Architecture:** Small browser-only modules in `src/lib/purl/` (config, PKCE, storage, OAuth flow, save client). The first click redirects the tab to Purl's authorize endpoint; `/purl/callback` exchanges the code, stores tokens in `localStorage`, saves the pending post, and returns to it. Later clicks call Purl directly with a Bearer token. Purl-side work is out of scope.

**Tech Stack:** Next.js App Router (React 19, TypeScript strict), Web Crypto, Vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-10-15-purl-user-save-design.md`

## Global Constraints

- Authorize `GET {PURL}/api/auth/mcp/authorize`; token `POST {PURL}/api/auth/mcp/token` (form-encoded); save `POST {PURL}/api/v1/links/save` body `{ "url": string }`, header `Authorization: Bearer <access_token>`.
- Scopes requested: `links:save offline_access`. PKCE method `S256`. Public client, no secret.
- Env: `NEXT_PUBLIC_PURL_URL` (default `https://purl.live`), `NEXT_PUBLIC_PURL_CLIENT_ID`. `PURL_URL` and `PURL_API_KEY` are removed everywhere.
- Redirect URI is exactly `${window.location.origin}/purl/callback`.
- Storage keys: `localStorage` `purl:tokens`; `sessionStorage` `purl:pending` and `purl:result`. Every storage call is wrapped in try/catch.
- `403` with body `code === "LIMIT_REACHED"` is the link limit; any other `403` or a `401` means reconnect.
- Limit message (verbatim): `Purl link limit reached. Remove a saved link to add more.`
- Existing messages kept verbatim: `Couldn't save to Purl. Check your connection and try again.` and `Couldn't save to Purl. The request timed out — try again.` Request timeout is 15 s. Denied-consent message: `Purl access was not allowed.`
- `returnPath` must start with `/` and not `//`; otherwise use `/`.
- Content-block and server components stay free of client hooks; only `src/app/purl/callback/page.tsx` and `post-reactions.tsx` are client code touched.
- Tests live beside source as `*.test.ts(x)`. Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Work on branch `feature/purl-user-save`; PRs target `develop`.

## Review Focus

- `returnPath` such as `//evil.com` or `https://evil.com/x` in the stored pending record: redirect to `/`, never off-site (Task 3).
- Callback opened twice or reloaded (pending record already consumed): no crash, no redirect loop, an error result and a return to `/` (Task 3).
- `localStorage`/`sessionStorage` throwing (Safari private mode): saving reports a clear error instead of redirecting into a connect loop (Tasks 2 and 4).
- Access token past `expiresAt`, and refresh failing: refresh first, and if that fails clear tokens and reconnect (Task 4).
- `NEXT_PUBLIC_PURL_CLIENT_ID` unset in an environment: button shows an error, does not redirect to a broken authorize URL (Task 4).

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/purl/config.ts` | env-derived URLs, scopes, redirect URI |
| `src/lib/purl/pkce.ts` | verifier, S256 challenge, state |
| `src/lib/purl/storage.ts` | tokens, pending record, one-shot result; safe against throwing storage |
| `src/lib/purl/oauth.ts` | `startConnect`, `completeConnect`, `refreshTokens`, `safeReturnPath` |
| `src/lib/purl/client.ts` | `saveLink` (typed errors) and `saveToPurl` (UI-facing outcome) |
| `src/app/purl/callback/page.tsx` | client page that finishes the connect flow |
| `src/components/post-reactions.tsx` | calls `saveToPurl`, consumes `purl:result` on mount |

Deleted: `src/services/purl.ts`, `src/services/purl.test.ts`, `src/app/api/purl/links/route.ts`.

---

### Task 1: Config and PKCE helpers

**Files:**
- Create: `src/lib/purl/config.ts`, `src/lib/purl/pkce.ts`
- Test: `src/lib/purl/pkce.test.ts`, `src/lib/purl/config.test.ts`

**Interfaces:**
- Produces:
  - `getPurlConfig(): { baseUrl: string; clientId: string | null; authorizeUrl: string; tokenUrl: string; saveUrl: string; scope: string; redirectUri: string }` (`baseUrl` has no trailing slash; `redirectUri` uses `window.location.origin`)
  - `createVerifier(): string`, `createChallenge(verifier: string): Promise<string>`, `createState(): string`

- [ ] **Step 1: Write failing tests**
  - `pkce.test.ts`: `createChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")` resolves to `"E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"` (RFC 7636 vector); `createVerifier()` matches `/^[A-Za-z0-9\-._~]{43,128}$/`; two `createState()` calls differ and match `/^[A-Za-z0-9_-]{16,}$/`.
  - `config.test.ts`: with `NEXT_PUBLIC_PURL_URL` unset, `baseUrl` is `https://purl.live`; with `https://x.test/` set, `tokenUrl` is `https://x.test/api/auth/mcp/token`; `saveUrl` ends `/api/v1/links/save`; `scope` is `links:save offline_access`; `clientId` is `null` when the env var is unset.
- [ ] **Step 2: Run** `pnpm vitest run src/lib/purl` — expected FAIL (modules missing).
- [ ] **Step 3: Implement** both files to the interfaces above. PKCE uses `crypto.getRandomValues` and `crypto.subtle.digest("SHA-256")` with base64url (no padding). If jsdom lacks `crypto.subtle`, set it from `node:crypto` `webcrypto` in `src/test/setup.ts`.
- [ ] **Step 4: Run** `pnpm vitest run src/lib/purl` — expected PASS.
- [ ] **Step 5: Commit** `feat: add Purl OAuth config and PKCE helpers`

---

### Task 2: Safe storage

**Files:**
- Create: `src/lib/purl/storage.ts`
- Test: `src/lib/purl/storage.test.ts`

**Interfaces:**
- Produces:
  - `type PurlTokens = { accessToken: string; refreshToken?: string; expiresAt: number }` (`expiresAt` epoch ms)
  - `type PurlPending = { state: string; verifier: string; returnPath: string; url: string }`
  - `type PurlResult = { status: "saved" } | { status: "limit" } | { status: "error"; message: string }`
  - `getTokens(): PurlTokens | null`, `setTokens(t: PurlTokens): boolean`, `clearTokens(): void`
  - `setPending(p: PurlPending): boolean`, `takePending(): PurlPending | null` (reads then deletes)
  - `setResult(r: PurlResult): void`, `takeResult(): PurlResult | null` (reads then deletes)
  - Setters that persist return/behave safely when storage throws; getters return `null`.

- [ ] **Step 1: Write failing tests** — round trip for each record; `takePending()` and `takeResult()` return the value once then `null`; corrupt JSON in `purl:tokens` yields `null`; with `Storage.prototype.setItem` stubbed to throw, `setTokens` and `setPending` return `false` and no exception escapes; with `getItem` throwing, getters return `null`.
- [ ] **Step 2: Run** `pnpm vitest run src/lib/purl/storage.test.ts` — expected FAIL.
- [ ] **Step 3: Implement** with one private `safe` helper wrapping each access in try/catch and validating shape on read.
- [ ] **Step 4: Run** same command — expected PASS.
- [ ] **Step 5: Commit** `feat: add Purl token and pending-flow storage`

---

### Task 3: OAuth flow

**Files:**
- Create: `src/lib/purl/oauth.ts`
- Test: `src/lib/purl/oauth.test.ts`

**Interfaces:**
- Consumes: Task 1 (`getPurlConfig`, `createVerifier`, `createChallenge`, `createState`), Task 2 (`setPending`, `takePending`, `setTokens`, `getTokens`, `clearTokens`)
- Produces:
  - `class PurlConnectError extends Error { returnPath: string }`
  - `safeReturnPath(path: string | undefined): string`
  - `buildAuthorizeUrl(args: { state: string; challenge: string }): string`
  - `startConnect(url: string): Promise<boolean>` — stores pending (`returnPath` = current `pathname + search`), sets `window.location.assign(authorizeUrl)`; resolves `false` without redirecting when `clientId` is null or `setPending` fails
  - `completeConnect(params: URLSearchParams): Promise<{ returnPath: string; url: string }>` — throws `PurlConnectError` (carrying a safe `returnPath`, message `Purl access was not allowed.` for `error=access_denied`)
  - `refreshTokens(): Promise<PurlTokens | null>` — uses the stored refresh token; stores and returns new tokens, `null` on any failure

- [ ] **Step 1: Write failing tests** (mock `fetch`, `window.location.assign`)
  - `buildAuthorizeUrl` contains `response_type=code`, `client_id`, `redirect_uri`, `scope=links%3Asave+offline_access` (or `%20`), `state`, `code_challenge`, `code_challenge_method=S256`.
  - `startConnect` stores a pending record whose `returnPath` equals the current path and calls `assign` once; with `clientId` null it returns `false` and never calls `assign`.
  - `completeConnect`: success posts form-encoded `grant_type=authorization_code`, `code`, `code_verifier`, `redirect_uri`, `client_id` to `tokenUrl`, stores tokens with `expiresAt ≈ now + expires_in*1000`, returns `{ returnPath, url }`; state mismatch throws `PurlConnectError`; `error=access_denied` throws with message `Purl access was not allowed.` and the stored `returnPath`; **missing pending record** (second call) throws with `returnPath` `/`; token endpoint non-2xx throws.
  - `safeReturnPath`: `"/blog/a?x=1"` stays; `"//evil.com"`, `"https://evil.com"`, `undefined`, `""` become `"/"`.
  - `refreshTokens` returns `null` and leaves nothing half-written on non-2xx.
- [ ] **Step 2: Run** `pnpm vitest run src/lib/purl/oauth.test.ts` — expected FAIL.
- [ ] **Step 3: Implement** to the signatures; send token requests with `Content-Type: application/x-www-form-urlencoded`; always route the stored `returnPath` through `safeReturnPath`.
- [ ] **Step 4: Run** same command — expected PASS.
- [ ] **Step 5: Commit** `feat: add Purl OAuth connect and refresh flow`

---

### Task 4: Save client

**Files:**
- Create: `src/lib/purl/client.ts`
- Test: `src/lib/purl/client.test.ts`

**Interfaces:**
- Consumes: Task 2 storage, Task 3 (`startConnect`, `refreshTokens`), Task 1 config
- Produces:
  - `type PurlSaveOutcome = { status: "saved" } | { status: "limit" } | { status: "redirecting" } | { status: "error"; message: string }`
  - `saveLink(url: string, signal?: AbortSignal): Promise<"saved" | "limit">` — throws `PurlNotConnectedError` when there are no usable tokens or after a `401`/non-limit `403`, `PurlRequestError(message)` for other failures
  - `saveToPurl(url: string): Promise<PurlSaveOutcome>` — wraps `saveLink` with the 15 s timeout, starts the connect flow on `PurlNotConnectedError` (`redirecting`), maps errors to the verbatim messages in Global Constraints

- [ ] **Step 1: Write failing tests**
  - `saveLink` sends `POST saveUrl` with `Authorization: Bearer <token>` and JSON `{ url }`; `201` resolves `"saved"`.
  - `403` + `{ code: "LIMIT_REACHED" }` resolves `"limit"`; `403` without it, and `401`, throw `PurlNotConnectedError` and clear tokens after a failed refresh.
  - Expired `expiresAt`: `refreshTokens` is called before the request; if it returns `null`, `PurlNotConnectedError` is thrown without calling the save endpoint.
  - `401` with a valid refresh: refreshes once and retries once, then resolves `"saved"`.
  - `saveToPurl`: not connected → calls `startConnect` and returns `redirecting`; `startConnect` resolving `false` → `error` with the connection message; limit → `{ status: "limit" }`; fetch rejecting → connection-error message; aborted at 15 s → timeout message (use fake timers).
  - Storage throwing on every access → `error`, `startConnect` result `false`, no loop.
- [ ] **Step 2: Run** `pnpm vitest run src/lib/purl/client.test.ts` — expected FAIL.
- [ ] **Step 3: Implement** to the signatures; refresh-and-retry at most once.
- [ ] **Step 4: Run** `pnpm vitest run src/lib/purl` — expected PASS.
- [ ] **Step 5: Commit** `feat: add Purl save client`

---

### Task 5: Callback page

**Files:**
- Create: `src/app/purl/callback/page.tsx`

**Interfaces:**
- Consumes: Task 3 `completeConnect`, `PurlConnectError`; Task 4 `saveToPurl`; Task 2 `setResult`

- [ ] **Step 1: Implement** a `"use client"` page exporting `metadata`-equivalent `robots: noindex` through a sibling `layout.tsx` (client pages cannot export metadata). On mount, once (guard against React strict-mode double effect with a ref): call `completeConnect(new URLSearchParams(location.search))`; on success call `saveToPurl(url)` and `setResult` (`saved`, `limit`, or `error`; map `redirecting` to `error`); on `PurlConnectError` `setResult({ status: "error", message })`. Finish with `router.replace(returnPath)`. Render a short `Connecting to Purl…` message using `Typography`.
- [ ] **Step 2: Verify** `pnpm type-check && pnpm lint` — expected clean.
- [ ] **Step 3: Commit** `feat: add Purl OAuth callback page`

---

### Task 6: Wire the button and remove the proxy

**Files:**
- Modify: `src/components/post-reactions.tsx` (`handleSaveToPurl` and mount effect), `.env.example`
- Delete: `src/services/purl.ts`, `src/services/purl.test.ts`, `src/app/api/purl/links/route.ts`
- Modify (if it lists the deleted route): `docs/superpowers/specs/2026-08-02-mcp-server-design.md`

**Interfaces:**
- Consumes: Task 4 `saveToPurl`, `PurlSaveOutcome`; Task 2 `takeResult`

- [ ] **Step 1: Replace the body of `handleSaveToPurl`** so it calls `saveToPurl(window.location.href)` and maps the outcome onto the existing `purlState`/`purlError` and reset timers: `saved` → `saved`; `limit` → `error` with the limit message; `error` → `error` with its message; `redirecting` → leave `saving` (the page is leaving). Remove the old `fetch`, `AbortController` and timeout code.
- [ ] **Step 2: Add a mount `useEffect`** that calls `takeResult()` once and applies the same mapping, so a visitor returning from the callback sees "Saved on Purl" or the error.
- [ ] **Step 3: Delete** the three proxy files; in `.env.example` replace the Purl block with `NEXT_PUBLIC_PURL_URL=https://purl.live` and `NEXT_PUBLIC_PURL_CLIENT_ID=` and update its comment; check the MCP spec mention and edit only if it refers to the deleted route.
- [ ] **Step 4: Verify** `pnpm lint && pnpm type-check && pnpm test` — expected all pass; `rg -n "PURL_API_KEY|api/purl|services/purl" src .env.example` — expected no matches.
- [ ] **Step 5: Manual check** with `pnpm dev` and `NEXT_PUBLIC_PURL_CLIENT_ID` set: clicking the button redirects to `https://purl.live/api/auth/mcp/authorize?...` with the expected parameters. The full round trip needs the Purl-side work and is verified after it ships.
- [ ] **Step 6: Commit** `feat: save to the visitor's own Purl account` and push is left to the user.

---

## Follow-up

After this branch is complete, write the standalone Purl-repo spec described at the end of the design spec (public client, `links:save` scope, `POST /api/v1/links/save`, token-endpoint CORS, consent copy, tests).
