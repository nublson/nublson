# Discovery Quick Wins — Design

**Date:** 2026-08-02
**Status:** Approved
**Context:** Items 3–6 of the agent-readiness plan, bundled into one branch (`feature/discovery-quick-wins`). Four independent isitagentready.com checks: Agent Skills index (404), auth.md heading (wrong H1), Content Signals (absent from robots.txt), API Catalog (404).

## Goal

Four scanner checks flip to passing with truthful, useful artifacts: a real agent skill with integrity digest, a correct auth.md, declared AI content-usage preferences, and an RFC 9727 API catalog describing the site's actual APIs.

## Deliverable 1 — auth.md heading (item 4)

`public/auth.md`: change the H1 from `# Authentication` to `# Auth.md`. Body text unchanged. (Scanner requires an H1 containing "Auth.md".)

## Deliverable 2 — Content Signals in robots.txt (item 5)

User decision (2026-08-02): **fully permissive** — `search=yes, ai-input=yes, ai-train=yes`, consistent with the robots.txt that already allows all AI bots.

Next's typed `MetadataRoute.Robots` API cannot emit `Content-Signal` directives, so:

- Delete `src/app/robots.ts`.
- New pure builder `buildRobotsTxt(baseUrl)` in `src/utils/robots-txt.ts` producing today's exact content (wildcard allow, the 7 named AI bots allow group, sitemap line) **plus** `Content-Signal: search=yes, ai-input=yes, ai-train=yes` inside the wildcard group.
- New route `src/app/robots.txt/route.ts` serving it as `text/plain` with the standard cache headers (`s-maxage=10, stale-while-revalidate=59`) and `revalidate = 10` for parity with other text routes.

## Deliverable 3 — API Catalog, RFC 9727 (item 6)

- New pure builder `buildApiCatalog(baseUrl)` in `src/utils/api-catalog.ts` returning a linkset object:
  - Entry anchored at `${base}/api/markdown` with `service-desc` → `${base}/openapi.json` (type `application/openapi+json`), `service-doc` → `${base}/llms.txt` (type `text/plain`).
  - Entry anchored at `${base}/api/mcp` with `service-desc` → `${base}/.well-known/mcp/server-card.json` (type `application/json`), `service-doc` → `${base}/agents.txt` (type `text/plain`).
  - No `status` relation — the site has no health endpoint, and the catalog stays honest.
- New route `src/app/.well-known/api-catalog/route.ts` serving it with `Content-Type: application/linkset+json` (a static `public/` file cannot set that media type). Implementation verifies Next 15 serves routes under a dot-directory in `app/`; if it does not, fallback is a proxy rewrite from `/.well-known/api-catalog` to a standard `/api/` route — same JSON, same headers.
- New static `public/openapi.json`: minimal OpenAPI 3.1 document (info, servers) describing the real public GET endpoints: `/api/markdown/{type}/{slug}`, `/api/markdown/pages/{page}`, `/feed.xml`, `/blog/feed.xml`, `/work/feed.xml`, `/llms.txt`, and `/api/mcp` (POST, MCP Streamable HTTP — described, not schema'd). No invented endpoints.

## Deliverable 4 — Agent Skills index, Discovery RFC v0.2.0 (item 3)

Schema verified against cloudflare/agent-skills-discovery-rfc on 2026-08-02.

- New skill file `public/.well-known/agent-skills/nublson-content/SKILL.md`: YAML frontmatter (`name: nublson-content`, `description: <how/when to read nublson.com content>`), body under ~1500 words teaching an agent the site's read surfaces: markdown negotiation (`Accept: text/markdown` on any page), `llms.txt` index, the MCP endpoint (`/api/mcp`, five tools), RSS feeds, and the markdown API routes. Name conforms to the Agent Skills naming rules (lowercase alphanumeric + hyphens).
- New index `public/.well-known/agent-skills/index.json`:
  - `$schema`: `https://schemas.agentskills.io/discovery/0.2.0/schema.json`
  - `skills`: one entry — `name: "nublson-content"`, `type: "skill-md"`, `description` (matching the frontmatter), absolute `url` `https://nublson.com/.well-known/agent-skills/nublson-content/SKILL.md`, `digest`: `sha256:<64 lowercase hex>` of the SKILL.md bytes.
- **Digest drift guard:** `src/utils/agent-skills-integrity.test.ts` reads both public files with `node:fs`, recomputes the SHA-256 with `node:crypto`, and asserts it equals the recorded digest, asserts the frontmatter/index descriptions match, and validates the name pattern. Editing SKILL.md without updating the index fails CI.
- `src/utils/agents-discovery.ts` (+ tests): `skillsIndexUrl` → `${base}/.well-known/agent-skills/index.json`. Legacy `public/.well-known/agent-skills.json` stays untouched for backward compatibility.

## Testing

- Unit: `robots-txt.test.ts`, `api-catalog.test.ts`, `agent-skills-integrity.test.ts`, updated `agents-discovery.test.ts`.
- E2E (dev server): `curl /robots.txt` (Content-Signal line + all previous content), `curl -D - /.well-known/api-catalog` (200, `application/linkset+json`), `curl /openapi.json` (valid JSON), `curl /.well-known/agent-skills/index.json` and the SKILL.md URL (200), `curl /auth.md` (H1 is `# Auth.md`).
- `pnpm test && pnpm lint && pnpm type-check && pnpm build` all pass.

## Out of scope

OAuth discovery (item 7 — intentionally skipped; site has no auth), WebMCP (item 8), DNS-AID (item 9), archive-type skills, status/health endpoints.

## Success criteria

After deploy, the isitagentready.com checks "Agent Skills index", "Auth.md agent registration", "Content Signals in robots.txt", and "API Catalog" all pass on rescan, with robots.txt otherwise byte-equivalent in meaning to today's.
