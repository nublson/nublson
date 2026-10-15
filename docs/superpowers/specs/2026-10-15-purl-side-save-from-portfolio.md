# Purl: accept save-only OAuth tokens from the portfolio

**Repo this applies to:** `purl` (purl.live). This document is self-contained so it can be worked on in isolation.
**Counterpart:** the portfolio side is implemented on branch `feature/purl-user-save` of the `nublson` repo (spec: `2026-10-15-purl-user-save-design.md`).

## Why

The portfolio's "Save with Purl" button must save a blog post into the **visitor's own** Purl library, in place, with no Purl credential on the portfolio. The portfolio does browser-side OAuth 2.0 authorization-code + PKCE against Purl, keeps a token in the visitor's `localStorage`, and calls Purl directly. Purl needs to support that flow safely.

## What the portfolio does (the contract Purl must satisfy)

| Step | Request |
|---|---|
| Authorize | `GET https://purl.live/api/auth/mcp/authorize?response_type=code&client_id=<ID>&redirect_uri=<site>/purl/callback&scope=links:save offline_access&state=…&code_challenge=…&code_challenge_method=S256` |
| Exchange | `POST /api/auth/mcp/token`, `application/x-www-form-urlencoded`: `grant_type=authorization_code`, `code`, `code_verifier`, `redirect_uri`, `client_id` (no secret). Called **from the browser**. |
| Refresh | same endpoint, `grant_type=refresh_token`, `refresh_token`, `client_id`. Browser. Portfolio treats `400/401` as "grant rejected → reconnect" and `5xx/429/network` as transient (keeps tokens). |
| Save | `POST /api/v1/links/save`, `Authorization: Bearer <access_token>`, JSON `{ "url": "<post url>" }`. Browser. |

Save responses the portfolio understands: `201` link JSON; `400 { error }` invalid URL; `401` missing/expired/revoked token; `403 { code: "LIMIT_REACHED" }` link limit (the **only** 403 treated as the limit); any other `403` or `401` makes the portfolio drop the token and reconnect.

## Requirements

### 1. Register the portfolio as a fixed public client
- Add an `oauthApplication` row (Prisma model `OauthApplication`): stable `clientId`, `type: "public"`, no `clientSecret`, `name` the visitor will recognise (e.g. "nublson.com"), `redirectUrls` exactly the callback URL(s): `https://<portfolio-origin>/purl/callback` and `http://localhost:3000/purl/callback` (comma-separated). No wildcards. Do it through a migration or seed script, not dynamic registration.
- Give the chosen `clientId` to the portfolio as `NEXT_PUBLIC_PURL_CLIENT_ID`.
- Verify the `mcp` plugin enforces PKCE (S256) for this client and accepts `token_endpoint_auth_method=none`. Discovery already advertises both.
- Note: discovery also advertises `registration_endpoint` (`/api/auth/mcp/register`). If open dynamic registration is not intended, that is a separate hardening item; do not rely on it for this client.

### 2. Add the `links:save` scope
- Register it with the OIDC/mcp plugin config in `src/lib/auth.ts` so authorize/token accept it and it appears in the token's stored scopes (`OauthAccessToken`). Add it to `scopes_supported` in discovery.
- `offline_access` must keep working for this client so a refresh token is issued and the refresh grant works without a secret.

### 3. New endpoint: `POST /api/v1/links/save`
- Bearer-only. Resolve the token with the same mechanism as `verifyOAuthToken` in `src/lib/mcp.ts` (`auth.api.getMcpSession`, plus the explicit expiry check that function documents as the only one).
- **Do not accept cookie sessions or API keys here.** The route is called cross-origin with CORS `*`; accepting cookies would open CSRF.
- Require `links:save` in the token's scopes. Missing scope → `403 { error, code: "insufficient_scope" }` (must differ from `LIMIT_REACHED`).
- Call `createLinkForUser(userId, url, …)` (`src/lib/links.ts`), then `broadcastLinksChanged(userId)` as `src/app/api/v1/links/route.ts` does. Map errors like that route: invalid URL `400`, `SaveLimitError` → `403 { code: "LIMIT_REACHED", feature }`.
- Use `addCors` / `corsPreflightResponse` from `src/app/api/v1/cors.ts` (already `*` with `Authorization, Content-Type`); export `OPTIONS`.
- The request passes through `src/proxy.ts`'s `/api/v1/` branch and its rate limiting. Confirm a non-API-key bearer is rate limited sensibly (falls back to the raw token or IP today).

### 4. **Isolate the save-only token from everything else (security-critical)**
Today `verifyOAuthToken` in `src/lib/mcp.ts` accepts **any** token issued by the `mcp` plugin and the MCP tools are "not gated by scope" (`src/lib/oauth-scopes.ts`). A `links:save` token must therefore not work on the MCP server, or the portfolio's token could list and delete the whole library.
- Make the MCP auth path reject tokens whose scopes include `links:save` (or, more robustly, require an explicit full-access marker for MCP and treat everything else as restricted). Existing connected MCP clients must keep working.
- Confirm no other route resolves an OAuth bearer into a session (`getSessionUser` / `/api/v1/*` accept cookies and API keys only today). Add a test that a `links:save` token gets `401/403` on `/api/mcp` and on `GET /api/v1/links`.

### 5. Honest consent screen
- `describeAccess` in `src/lib/oauth-scopes.ts` always lists the fixed "see / save / delete" access for every app. For a client whose requested scopes are only `links:save` (+ `offline_access`) the card must say only **"Save links to your library"** (and "Stay connected until you disconnect it" for `offline_access`). It must not list reading or deleting.
- Keep the existing behaviour (full list) for scope sets that do not include `links:save`.
- The consent page (`src/app/oauth/consent/page.tsx`) shows `client.name`; make sure the registered name reads well.

### 6. CORS on the token endpoint
- The browser calls `POST /api/auth/mcp/token` cross-origin, so it needs a CORS preflight response and `Access-Control-Allow-Origin` for the portfolio origin(s), `Access-Control-Allow-Headers: Content-Type`, `Access-Control-Allow-Methods: POST, OPTIONS`.
- Allow only the registered portfolio origins (env-driven allowlist, e.g. `OAUTH_CORS_ORIGINS`), never `*`, and only for the token endpoint. Implement in the `src/app/api/auth/[...all]` handler or `src/proxy.ts`, whichever already owns `/api/auth`.
- No credentials are sent, so `Allow-Credentials` stays off.

### 7. Sign-in resumes the authorize flow
A visitor who is not signed in to Purl is sent to `AUTH_LOGIN_PAGE` (`/`). Verify that after signing in (Google/Apple/etc., including a brand-new account) the flow resumes at the consent page and ends at the callback with `code` and the original `state`. Fix if it drops the authorize request.

### 8. Revocation and visibility
- The existing connected-apps list (`src/lib/connected-apps.ts`) must show this client and revoking it deletes the token and consent (it already deletes `oauthAccessToken` and `oauthConsent` for the client). After revocation the portfolio's next save must get `401`.

## Tests (Purl repo)
- Route: `POST /api/v1/links/save` happy path `201`; no/garbage token `401`; expired token `401`; token without `links:save` `403 insufficient_scope`; link limit `403 LIMIT_REACHED`; invalid URL `400`; cookie-only request `401`; `OPTIONS` preflight `204`.
- Isolation: `links:save` token rejected by the MCP handler and by `GET /api/v1/links`.
- `describeAccess(["links:save", "offline_access"])` lists only the save item and the stay-connected item; other scope sets unchanged.
- Token endpoint CORS: allowed origin echoed, unknown origin not.
- Manual end to end with the portfolio dev server: signed-out visitor, signed-in visitor, denied consent, revoked connection, expired access token with valid refresh.

## Out of scope
- Any portfolio change; folders, listing or deleting links from the portfolio; hardening of open dynamic client registration (note it separately).

## Open questions for the Purl owner
- Is rotating refresh tokens with reuse detection enabled? Two portfolio tabs refreshing at once could invalidate each other's token; the portfolio does not coordinate across tabs.
- Which portfolio origin(s) are final? Vercel preview URLs cannot be registered, so previews cannot complete the flow.
