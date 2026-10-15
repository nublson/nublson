# Save with Purl — save to the visitor's own account

## Problem

The "Save with Purl" button on blog posts calls `/api/purl/links`, which forwards
to Purl with the site owner's `PURL_API_KEY`. Every visitor's click therefore
saves into the owner's library. It should save into the **visitor's** Purl
account, and the portfolio must hold no Purl credential tied to the owner.

## Goal and success criteria

- A visitor clicks "Save with Purl" on a post and the post lands in their own
  Purl library.
- The first save needs a one-time connect: redirect to Purl, sign in if needed,
  approve on Purl's existing "Allow access" page, return to the same post with
  the save completed.
- Every later save is one click, in place, no navigation.
- The portfolio contains no owner credential: `PURL_API_KEY` and its server
  proxy are removed.

## Decisions

- **OAuth 2.0 authorization code + PKCE (S256), public client, no secret**,
  using Purl's existing better-auth `mcp` OAuth server.
- **Full-page redirect**, not a popup. Only happens once per browser. Avoids
  popup blockers and `postMessage` plumbing, and works on mobile.
- **Browser-side calls to Purl.** The token lives in the visitor's
  `localStorage`; the portfolio has no server component for Purl any more.
- **Save-only scope** `links:save`, enforced by Purl on a dedicated endpoint.
  A leaked token can only add links.
- Purl's existing `/oauth/consent` page is the consent screen. It is always
  shown on first connect.

## Contract with Purl (built in the Purl repo, specified separately)

The portfolio depends on all of the following. Purl work is tracked in its own
spec, written after the portfolio work lands.

| Item | Value |
|---|---|
| Authorize endpoint | `GET {PURL}/api/auth/mcp/authorize` |
| Token endpoint | `POST {PURL}/api/auth/mcp/token` (form-encoded) |
| Client | fixed public client, id supplied as `NEXT_PUBLIC_PURL_CLIENT_ID`, `token_endpoint_auth_method=none`, PKCE required |
| Redirect URI | exactly `https://<site>/purl/callback` (plus `http://localhost:3000/purl/callback` for dev) |
| Scopes requested | `links:save offline_access` |
| Token endpoint CORS | must allow the portfolio origin(s) for `POST` with `Content-Type` (browser exchange) |
| Save endpoint | `POST {PURL}/api/v1/links/save`, body `{ "url": string }`, `Authorization: Bearer <access_token>`, CORS `*` or the portfolio origin |
| Save responses | `201` link JSON; `400` invalid URL; `401` missing/expired/revoked token; `403` wrong scope **or** `{ code: "LIMIT_REACHED" }`; other errors `{ error: string }` |
| Consent card | describes `links:save` as "Save links to your library" |

`403` is ambiguous (scope vs. limit), so the portfolio keys on the body:
`code === "LIMIT_REACHED"` is the limit; any other 403 is treated as a failed
connection and forces a reconnect.

## Portfolio design

### Modules (`src/lib/purl/`)

Each unit is browser-only, pure where possible, and independently testable.

- `config.ts` — reads `NEXT_PUBLIC_PURL_URL` (default `https://purl.live`) and
  `NEXT_PUBLIC_PURL_CLIENT_ID`; exposes endpoint URLs and the redirect URI
  (`${window.location.origin}/purl/callback`).
- `pkce.ts` — `createVerifier()`, `createChallenge(verifier)` (S256, Web
  Crypto, base64url), `createState()`.
- `storage.ts` — all storage access, every call wrapped in try/catch so private
  mode degrades to "not connected":
  - `localStorage` key `purl:tokens` → `{ accessToken, refreshToken?, expiresAt }`
  - `sessionStorage` key `purl:pending` → `{ state, verifier, returnPath, url }`
  - `sessionStorage` key `purl:result` → JSON `{ status: "saved" } | { status: "limit" } | { status: "error", message }`
    (one-shot, consumed on read)
- `oauth.ts` — `startConnect(url)` (builds pending record, redirects tab),
  `completeConnect(searchParams)` (validates `state`, exchanges code),
  `refreshTokens()`.
- `client.ts` — `saveLink(url)` → `"saved" | "limit"`; throws typed
  `PurlNotConnectedError` / `PurlRequestError`. Attaches the Bearer token,
  refreshes once on expiry or `401`, clears tokens when refresh fails.

### Flow

1. Click → `saveLink(location.href)`.
   - No tokens, or refresh fails → `startConnect(location.href)`: write
     `purl:pending`, redirect to the authorize URL with `response_type=code`,
     `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge`,
     `code_challenge_method=S256`.
2. Purl authenticates the visitor, shows the Allow access page, redirects to
   `/purl/callback?code=…&state=…` (or `?error=access_denied`).
3. `/purl/callback` (client page, `noindex`, shows a short "Connecting to
   Purl…" state):
   - read and delete `purl:pending`.
     - **Missing** (callback reloaded or opened directly): go to `/` silently
       and write **no** `purl:result`. `/` renders no `PostReactions`, so a
       stored result would go unread and surface later as a stale error on an
       unrelated post.
     - **`state` mismatch**: write `purl:result = error`, redirect to the
       stored `returnPath`.
   - `error` param (denied) → write `purl:result = error:Purl access was not
     allowed.`, redirect to `returnPath`.
   - exchange code (`grant_type=authorization_code`, `code_verifier`,
     `redirect_uri`, `client_id`) → store tokens.
   - `saveLink(pending.url)` → write `purl:result`, redirect to `returnPath`
     with `router.replace`.
4. On mount, `PostReactions` consumes `purl:result` and sets the button to
   `saved` / `error` using the existing state machine and timers, so the
   visitor sees "Saved on Purl" on return.

`returnPath` is validated to start with `/` and not `//` before redirecting
(no open redirect). Only same-origin relative paths are accepted.

### Changes to existing code

- `src/components/post-reactions.tsx`: `handleSaveToPurl` calls
  `saveLink` instead of `fetch("/api/purl/links")`; maps `PurlNotConnectedError`
  to the connect redirect; keeps the existing `PurlState`, timeout, copy and
  styling; adds the on-mount `purl:result` consumer.
- New `src/app/purl/callback/page.tsx` (+ `layout`/metadata with
  `robots: { index: false }`).
- Delete `src/services/purl.ts`, `src/services/purl.test.ts`,
  `src/app/api/purl/links/route.ts`.
- `.env.example`: remove `PURL_URL`, `PURL_API_KEY`; add
  `NEXT_PUBLIC_PURL_URL`, `NEXT_PUBLIC_PURL_CLIENT_ID`.
- Remove the "purl" mention from the MCP design doc's route list only if it
  refers to the deleted route (verify during implementation).

### Error handling

| Situation | Behaviour |
|---|---|
| No token / refresh failed / non-limit `403` | clear tokens, start connect |
| `403` + `LIMIT_REACHED` | button error: "Purl link limit reached. Remove a saved link to add more." |
| Network failure / 15 s timeout | existing messages |
| Consent denied | back on post, error "Purl access was not allowed." |
| Invalid `state` | back on the post, error via `purl:result` |
| Lost `purl:pending` (reloaded callback) | home page, silently, no result stored |
| Storage unavailable | treated as not connected; connect can still run but the callback cannot finish, so show the error rather than loop |

### Security notes

- No secret in the bundle; PKCE protects the code exchange.
- `state` is random per attempt, single-use, and deleted from storage as soon as the callback reads it.
- Tokens are save-only; worst case from XSS is spam links in one visitor's
  library, revocable from Purl's connected-apps list.
- `returnPath` is validated; the callback page is `noindex`.

## Testing

Vitest + jsdom, files beside source.

- `pkce.test.ts` — verifier length/charset, known S256 vector, state uniqueness.
- `storage.test.ts` — round-trips, one-shot `purl:result`, throwing storage.
- `oauth.test.ts` — authorize URL parameters, `state` mismatch rejection,
  `returnPath` validation, code exchange request shape, refresh.
- `client.test.ts` — Bearer header, refresh-then-retry on 401, limit vs scope
  `403`, not-connected path.
- `post-reactions` — button state on click, on `purl:result` at mount.
- The callback page is excluded from coverage like other routes; its logic
  lives in `oauth.ts`.

Verification against real Purl happens after the Purl-side work ships.

## Out of scope

- Any change in the Purl repository (delivered as a separate spec).
- Showing "already saved", folder selection, or a disconnect button on the
  portfolio. Revoking is done in Purl.
- Server-side session or proxying.

## Follow-up deliverable

When this work is finished, write a standalone spec for the Purl repository
covering: the public client registration, the `links:save` scope, the
`POST /api/v1/links/save` endpoint, CORS on the token endpoint, consent copy,
and tests.
