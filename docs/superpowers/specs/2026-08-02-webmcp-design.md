# WebMCP Tools — Design

**Date:** 2026-08-02
**Status:** Approved
**Context:** Item 8 of the agent-readiness plan. isitagentready.com's WebMCP check loads the homepage and reports "No tools registered via navigator.modelContext". WebMCP is an emerging browser API (webmachinelearning/webmcp) letting pages expose client-side tools to browser-embedded AI agents.

## Goal

On page load, the site registers three read-only tools with the browser's model-context API when it exists, with zero effect (and zero console noise) in browsers without the API. The scanner's WebMCP check passes after deploy.

## API-in-flux constraint (drives the design)

Verified 2026-08-02: the WebMCP explainer currently shows `document.modelContext.registerTool({...})`, while Chrome's implementation and the scanner probe `navigator.modelContext` / `provideContext()`. Registration is therefore defensive and dual-shape:

1. Surface: `navigator.modelContext ?? document.modelContext`; if neither exists, do nothing.
2. Method: prefer `provideContext({ tools })` when present, else call `registerTool(tool)` per tool.
3. Everything wrapped in try/catch — a future API change can never break the site.

Minimal local TS types (`ModelContextTool`, `ModelContextLike`) rather than the `webmcp-types` package, which targets a single draft shape.

## Components

### `src/utils/webmcp-tools.ts` (pure, unit-tested)

`getWebmcpTools(fetcher: typeof fetch): ModelContextTool[]` returning three tools whose names mirror the MCP server:

| Tool | Input schema | Behavior |
|---|---|---|
| `list_posts` | `{}` | `fetcher("/llms.txt")` → return body text (already a titled, linked index) |
| `search_posts` | `{ query: string }` (required) | fetch `/llms.txt`, return lines matching the query case-insensitively; friendly "no matches" text otherwise |
| `get_post` | `{ type: "blog"\|"work", slug: string }` (both required) | fetch `/api/markdown/{type}/{slug}`; return markdown; on 404 return friendly "unknown slug, use list_posts" text |

Handlers return WebMCP tool results (`{ content: [{ type: "text", text }] }`). Network failures are caught and returned as text messages, never thrown. Relative URLs — the page's own origin serves everything.

### `src/components/webmcp-provider.tsx` (`"use client"`)

Renders `null`. `useEffect` on mount: run the defensive registration exactly once (module-level guard so React strict-mode double-invoke doesn't double-register). No dependencies beyond React.

### Mount point

`src/app/layout.tsx` — rendered once site-wide (scanner probes the homepage; real agents may land anywhere).

### Docs

CLAUDE.md client-component list gains `webmcp-provider` (sixth client component).

## Testing

- `src/utils/webmcp-tools.test.ts`: all three handlers with a mocked fetcher — success, search no-match, get_post 404, fetch rejection; input schema shapes.
- `src/components/webmcp-provider.test.tsx` (Testing Library): registration via `provideContext` when available; fallback to per-tool `registerTool`; clean no-op when no API exists; single registration across re-renders.
- E2E: `pnpm dev` + real browser — homepage loads with no console errors; `pnpm build` passes.

## Out of scope

Write-action tools, declarative `<form>` tools, service-worker tool registration, the `webmcp-types` dependency.

## Success criteria

isitagentready.com's WebMCP check passes on rescan after deploy; browsers without the API see no behavioral or console difference.
