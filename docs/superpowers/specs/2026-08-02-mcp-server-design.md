# MCP Server + Server Card — Design

**Date:** 2026-08-02
**Status:** Approved
**Context:** Item 2 of the agent-readiness plan. isitagentready.com fails the "MCP Server Card" check: `/.well-known/mcp/server-card.json` is 404 and `/.well-known/mcp.json` lacks the fields the scanner requires. Rather than publishing a card for a server that doesn't exist, we ship a real read-only MCP server and describe it truthfully.

## Goal

Agents can connect to `https://nublson.com/api/mcp` (MCP Streamable HTTP transport) and browse/read the site's content through tools. Discovery files at `/.well-known/mcp/server-card.json` and `/.well-known/mcp.json` describe the server accurately, and the scanner's MCP Server Card check passes.

## Architecture

**Approach chosen:** `mcp-handler` (Vercel's official MCP adapter) mounted as an App Router route in this app. Stateless Streamable HTTP only — no Redis, no sessions, no auth (site is fully public). Rejected alternatives: hand-rolled JSON-RPC on `@modelcontextprotocol/sdk` (re-implements what mcp-handler provides) and a standalone MCP deployment (needless infra for a read-only server).

**New dependencies:** `mcp-handler`, `zod` (tool input schemas).

### Route: `src/app/api/[transport]/route.ts`

`createMcpHandler(initialize, serverOptions, { basePath: "/api" })` exported as `GET` and `POST`. The live endpoint is `/api/mcp`. Existing static `/api/*` routes (markdown, reactions, revalidate, purl) take precedence over the dynamic `[transport]` segment. SSE transport is not supported (requires Redis); Streamable HTTP is the default modern transport.

Server identity: name `nublson.com`, version `1.0.0`.

### Tools (all read-only)

| Tool | Input (zod) | Output | Data source |
|---|---|---|---|
| `list_posts` | `{ type?: "blog" \| "work" }` | JSON array `{title, slug, url, description, publishedDate, category}` | `getDatabasePages(CONTENT, media, 50)` + `formatPostMetadata` (both types when `type` omitted) |
| `get_post` | `{ type: "blog" \| "work", slug: string }` | Full article as markdown text | `getDatabasePageBySlug` + `getPageBlocks` + `postToMarkdown` (same path as `/api/markdown/[type]/[slug]`) |
| `list_gears` | `{}` | JSON array grouped by category `{category, items: [{title, url, description}]}` | `getDatabasePages(GEARS, …)` with the gears sorts/filterProperties + `formatPostMetadata` |
| `get_profile` | `{}` | JSON `{name, description, role, location, url, social: [{name, url}]}` | `getPageData(NOTION_PAGE_HOME_ID)` + `formatPageMetadata` + `src/data/social.json` |
| `search_posts` | `{ query: string }` | Same shape as `list_posts`, filtered | Both post lists filtered by pure `searchPosts()` util |

Error handling: unknown slug or empty search returns a normal MCP tool result with `isError: true` and a helpful message (never an unhandled 500). Invalid input is rejected by zod schemas at the adapter layer.

### Pure helpers: `src/utils/mcp-content.ts`

Coverage includes `src/utils/**`, excludes `src/app/**` and services. Everything testable lives here as pure functions taking already-fetched data:

- `postToolItem(post, baseUrl)` → `{title, slug, url, description, publishedDate, category}`
- `searchPosts(items, query)` → case-insensitive substring match over title/description/category; trimmed query; empty query returns `[]`
- `groupGears(gears)` → `[{category, items}]` (category fallback `"Other"`, empty paths omitted from items' `url`)
- `profileFromHero(hero, social, baseUrl)` → profile JSON (https-only social links, same filter as the homepage JSON-LD)

### Discovery files

- **New** `public/.well-known/mcp/server-card.json` (static, absolute URLs like the other `public/.well-known` files): `$schema` (SEP-1649 draft), `name`, `serverInfo: {name, title, version, description}`, `transport: {type: "streamable-http", endpoint: "https://nublson.com/api/mcp"}`, `capabilities: {tools: {}}`, `tools`: five `{name, description}` summaries, `authentication: {type: "none"}`, `website`.
- **Update** `public/.well-known/mcp.json`: add the same `serverInfo` and `transport` blocks; keep the existing `resources` block (both `name` and `serverInfo.name` present → satisfies the scanner regardless of which field it reads).
- **Update** `src/utils/agents-discovery.ts` (+ tests): `mcpCardUrl` → `/.well-known/mcp/server-card.json`, new `mcpEndpointUrl` → `/api/mcp`; `agents.txt` gains an `MCP-Endpoint:` line; `agents.json` `mcp` entry carries both card URL and endpoint.

## Testing

- Unit tests: `src/utils/mcp-content.test.ts` (all four helpers, edge cases: empty query, no-category gear, missing role/location) and updated `src/utils/agents-discovery.test.ts`.
- End-to-end (manual, dev server): JSON-RPC curls to `/api/mcp` — `initialize`, `tools/list` (expect 5 tools), one `tools/call` per tool including an unknown-slug error case; `curl /.well-known/mcp/server-card.json` returns 200 JSON.
- `pnpm test && pnpm lint && pnpm type-check && pnpm build` all pass.

## Out of scope

Write tools (reactions), auth/OAuth, SSE transport, MCP resources/prompts capabilities, dynamic generation of the server card.

## Success criteria

An MCP client (e.g. Claude Code via `claude mcp add --transport http nublson https://nublson.com/api/mcp`) can list and call all five tools in production, and the isitagentready.com "MCP Server Card" check passes on rescan.
