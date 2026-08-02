# Discovery Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Four agent-readiness deliverables on one branch: Content Signals in robots.txt, an RFC 9727 API catalog, an Agent Skills discovery index with a real skill and digest guard, and the auth.md heading fix.

**Architecture:** Two new pure builders (`robots-txt.ts`, `api-catalog.ts`) with route handlers replacing/adding text endpoints; static skill artifacts in `public/.well-known/agent-skills/` guarded by an integrity unit test; small updates to `auth.md` and `agents-discovery.ts`.

**Tech Stack:** Next.js App Router route handlers, Vitest, node:crypto/node:fs (test only).

**Spec:** `docs/superpowers/specs/2026-08-02-discovery-quick-wins-design.md`

## Global Constraints

- Branch: `feature/discovery-quick-wins` (already created). Never commit to `develop`.
- Content Signal (user decision): `search=yes, ai-input=yes, ai-train=yes`.
- robots.txt must keep today's exact semantics (wildcard allow, the 7 named AI bots, sitemap) plus the signal line.
- Builders are pure (no network/env access — `baseUrl` is a parameter); routes read `process.env.BASE_URL!`.
- Text/JSON routes: `Cache-Control: s-maxage=10, stale-while-revalidate=59`, `export const revalidate = 10`.
- All commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: robots.txt with Content Signals

**Files:**
- Create: `src/utils/robots-txt.ts`
- Test: `src/utils/robots-txt.test.ts`
- Create: `src/app/robots.txt/route.ts`
- Delete: `src/app/robots.ts`

**Interfaces:**
- Produces: `buildRobotsTxt(baseUrl: string): string`. Output groups: wildcard (`User-Agent: *` / `Allow: /` / `Content-Signal: …`), blank line, the 7 AI bot `User-Agent:` lines sharing one `Allow: /`, blank line, `Sitemap:` line, trailing newline.

- [ ] **Step 1: Write the failing tests**

Create `src/utils/robots-txt.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildRobotsTxt, CONTENT_SIGNAL } from "./robots-txt";

describe("buildRobotsTxt", () => {
  const txt = buildRobotsTxt("https://nublson.com");

  it("keeps the wildcard allow group with the Content-Signal line", () => {
    expect(txt).toContain(
      "User-Agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n",
    );
  });

  it("keeps the named AI bot allow group", () => {
    expect(txt).toContain(
      "User-Agent: GPTBot\nUser-Agent: ClaudeBot\nUser-Agent: PerplexityBot\nUser-Agent: anthropic-ai\nUser-Agent: Bytespider\nUser-Agent: Amazonbot\nUser-Agent: Meta-ExternalFetcher\nAllow: /\n",
    );
  });

  it("keeps the sitemap line and normalizes trailing slashes", () => {
    expect(txt).toContain("Sitemap: https://nublson.com/sitemap.xml");
    expect(buildRobotsTxt("https://nublson.com/")).toContain(
      "Sitemap: https://nublson.com/sitemap.xml",
    );
  });

  it("ends with a single trailing newline", () => {
    expect(txt.endsWith("\n")).toBe(true);
    expect(txt.endsWith("\n\n")).toBe(false);
  });

  it("exports the agreed content signal", () => {
    expect(CONTENT_SIGNAL).toBe("search=yes, ai-input=yes, ai-train=yes");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/robots-txt.test.ts`
Expected: FAIL — cannot resolve `./robots-txt`.

- [ ] **Step 3: Write the builder**

Create `src/utils/robots-txt.ts`:

```ts
const AI_BOT_USER_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "anthropic-ai",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalFetcher",
] as const;

export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

export function buildRobotsTxt(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");

  const lines = [
    "User-Agent: *",
    "Allow: /",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "",
    ...AI_BOT_USER_AGENTS.map((bot) => `User-Agent: ${bot}`),
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap.xml`,
  ];

  return `${lines.join("\n")}\n`;
}
```

- [ ] **Step 4: Replace the metadata route with a handler**

Delete `src/app/robots.ts` (`git rm src/app/robots.ts`). Create `src/app/robots.txt/route.ts`:

```ts
import { buildRobotsTxt } from "@/utils/robots-txt";

export const revalidate = 10;

export async function GET() {
  return new Response(buildRobotsTxt(process.env.BASE_URL!), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
    },
  });
}
```

- [ ] **Step 5: Run tests, lint, type-check**

Run: `pnpm vitest run src/utils/robots-txt.test.ts && pnpm test && pnpm lint && pnpm type-check`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/utils/robots-txt.ts src/utils/robots-txt.test.ts src/app/robots.txt/route.ts
git rm -q src/app/robots.ts 2>/dev/null || true
git commit -m "feat: declare Content Signals in robots.txt

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: API catalog route + OpenAPI description

**Files:**
- Create: `src/utils/api-catalog.ts`
- Test: `src/utils/api-catalog.test.ts`
- Create: `src/app/.well-known/api-catalog/route.ts`
- Create: `public/openapi.json`

**Interfaces:**
- Produces: `buildApiCatalog(baseUrl: string): ApiCatalog` where `ApiCatalog = { linkset: [...] }`; route serves it at `/.well-known/api-catalog` with `Content-Type: application/linkset+json`.

- [ ] **Step 1: Write the failing tests**

Create `src/utils/api-catalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildApiCatalog } from "./api-catalog";

describe("buildApiCatalog", () => {
  const catalog = buildApiCatalog("https://nublson.com");

  it("describes the markdown API with service-desc and service-doc", () => {
    expect(catalog.linkset[0]).toEqual({
      anchor: "https://nublson.com/api/markdown",
      "service-desc": [
        {
          href: "https://nublson.com/openapi.json",
          type: "application/openapi+json",
        },
      ],
      "service-doc": [
        { href: "https://nublson.com/llms.txt", type: "text/plain" },
      ],
    });
  });

  it("describes the MCP endpoint with its server card", () => {
    expect(catalog.linkset[1]).toEqual({
      anchor: "https://nublson.com/api/mcp",
      "service-desc": [
        {
          href: "https://nublson.com/.well-known/mcp/server-card.json",
          type: "application/json",
        },
      ],
      "service-doc": [
        { href: "https://nublson.com/agents.txt", type: "text/plain" },
      ],
    });
  });

  it("has exactly two entries and normalizes trailing slashes", () => {
    expect(catalog.linkset).toHaveLength(2);
    expect(buildApiCatalog("https://nublson.com/").linkset[0]?.anchor).toBe(
      "https://nublson.com/api/markdown",
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/api-catalog.test.ts`
Expected: FAIL — cannot resolve `./api-catalog`.

- [ ] **Step 3: Write the builder**

Create `src/utils/api-catalog.ts`:

```ts
type LinksetLink = {
  href: string;
  type?: string;
};

type LinksetEntry = {
  anchor: string;
  "service-desc"?: LinksetLink[];
  "service-doc"?: LinksetLink[];
};

export type ApiCatalog = {
  linkset: LinksetEntry[];
};

export function buildApiCatalog(baseUrl: string): ApiCatalog {
  const base = baseUrl.replace(/\/$/, "");

  return {
    linkset: [
      {
        anchor: `${base}/api/markdown`,
        "service-desc": [
          { href: `${base}/openapi.json`, type: "application/openapi+json" },
        ],
        "service-doc": [{ href: `${base}/llms.txt`, type: "text/plain" }],
      },
      {
        anchor: `${base}/api/mcp`,
        "service-desc": [
          {
            href: `${base}/.well-known/mcp/server-card.json`,
            type: "application/json",
          },
        ],
        "service-doc": [{ href: `${base}/agents.txt`, type: "text/plain" }],
      },
    ],
  };
}
```

- [ ] **Step 4: Write the route**

Create `src/app/.well-known/api-catalog/route.ts`:

```ts
import { buildApiCatalog } from "@/utils/api-catalog";

export const revalidate = 10;

export async function GET() {
  return new Response(
    JSON.stringify(buildApiCatalog(process.env.BASE_URL!), null, 2),
    {
      headers: {
        "Content-Type": "application/linkset+json",
        "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      },
    },
  );
}
```

- [ ] **Step 5: Verify Next serves the dot-directory route**

Start `pnpm dev` (background), then:

Run: `curl -s -D - -o /dev/null http://localhost:3000/.well-known/api-catalog | grep -i -E "^HTTP|content-type"`
Expected: `200` with `content-type: application/linkset+json`. Stop the dev server after.

**Fallback if 404** (Next ignoring the dot-directory): move the route file to `src/app/api/well-known/api-catalog/route.ts` (same content) and add this rewrite at the very top of the `proxy` function in `src/proxy.ts` (before the markdown negotiation block):

```ts
  if (request.nextUrl.pathname === "/.well-known/api-catalog") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/api/well-known/api-catalog";
    return withDiscoveryHeaders(request, NextResponse.rewrite(rewriteUrl));
  }
```

plus a proxy test in `src/proxy.test.ts`:

```ts
  it("rewrites the api-catalog well-known path", () => {
    const response = proxy(request("/.well-known/api-catalog"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/well-known/api-catalog",
    );
  });
```

Then re-run the curl check. Whichever variant ships, note it in your report.

- [ ] **Step 6: Create `public/openapi.json`**

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "nublson.com content API",
    "version": "1.0.0",
    "description": "Public read-only endpoints for blog posts, work case studies and site content. No authentication required."
  },
  "servers": [{ "url": "https://nublson.com" }],
  "paths": {
    "/api/markdown/{type}/{slug}": {
      "get": {
        "summary": "Fetch a post as markdown",
        "parameters": [
          {
            "name": "type",
            "in": "path",
            "required": true,
            "schema": { "type": "string", "enum": ["blog", "work"] }
          },
          {
            "name": "slug",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "The post as markdown with YAML frontmatter",
            "content": { "text/markdown": { "schema": { "type": "string" } } }
          },
          "404": { "description": "Unknown slug" }
        }
      }
    },
    "/api/markdown/pages/{page}": {
      "get": {
        "summary": "Fetch a static page as markdown",
        "parameters": [
          {
            "name": "page",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "enum": ["home", "about", "blog", "work", "gears"]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "The page as markdown",
            "content": { "text/markdown": { "schema": { "type": "string" } } }
          },
          "400": { "description": "Invalid page" }
        }
      }
    },
    "/llms.txt": {
      "get": {
        "summary": "Site overview and content index for LLMs",
        "responses": {
          "200": {
            "description": "Markdown-formatted index of all posts",
            "content": { "text/plain": { "schema": { "type": "string" } } }
          }
        }
      }
    },
    "/feed.xml": {
      "get": {
        "summary": "Combined RSS feed (blog + work)",
        "responses": {
          "200": {
            "description": "RSS 2.0 feed",
            "content": {
              "application/rss+xml": { "schema": { "type": "string" } }
            }
          }
        }
      }
    },
    "/blog/feed.xml": {
      "get": {
        "summary": "Blog RSS feed",
        "responses": {
          "200": {
            "description": "RSS 2.0 feed",
            "content": {
              "application/rss+xml": { "schema": { "type": "string" } }
            }
          }
        }
      }
    },
    "/work/feed.xml": {
      "get": {
        "summary": "Work RSS feed",
        "responses": {
          "200": {
            "description": "RSS 2.0 feed",
            "content": {
              "application/rss+xml": { "schema": { "type": "string" } }
            }
          }
        }
      }
    },
    "/api/mcp": {
      "post": {
        "summary": "MCP Streamable HTTP endpoint",
        "description": "Model Context Protocol server (JSON-RPC over HTTP). Tools: list_posts, get_post, list_gears, get_profile, search_posts. See /.well-known/mcp/server-card.json.",
        "responses": {
          "200": { "description": "JSON-RPC response (or SSE-framed stream)" }
        }
      }
    }
  }
}
```

- [ ] **Step 7: Validate, run checks, commit**

Run: `python3 -m json.tool public/openapi.json > /dev/null && pnpm test && pnpm lint && pnpm type-check`
Expected: all pass.

```bash
git add src/utils/api-catalog.ts src/utils/api-catalog.test.ts public/openapi.json src/app
git commit -m "feat: publish RFC 9727 API catalog with OpenAPI description

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

(If the fallback was used, also `git add src/proxy.ts src/proxy.test.ts`.)

---

### Task 3: Agent skill + discovery index with digest guard

**Files:**
- Create: `public/.well-known/agent-skills/nublson-content/SKILL.md`
- Create: `public/.well-known/agent-skills/index.json`
- Test: `src/utils/agent-skills-integrity.test.ts`

**Interfaces:**
- Produces: static artifacts at `/.well-known/agent-skills/index.json` and `/.well-known/agent-skills/nublson-content/SKILL.md`; the integrity test binds them. Task 4 points `agents-discovery` at the index URL.

- [ ] **Step 1: Write the integrity test first**

Create `src/utils/agent-skills-integrity.test.ts`:

```ts
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const skillsDir = path.join(process.cwd(), "public/.well-known/agent-skills");

type SkillEntry = {
  name: string;
  type: string;
  description: string;
  url: string;
  digest: string;
};

function loadIndex(): { $schema: string; skills: SkillEntry[] } {
  return JSON.parse(readFileSync(path.join(skillsDir, "index.json"), "utf8"));
}

describe("agent-skills discovery index", () => {
  it("declares the v0.2.0 schema and at least one skill", () => {
    const index = loadIndex();
    expect(index.$schema).toBe(
      "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    );
    expect(index.skills.length).toBeGreaterThan(0);
  });

  it("every entry is a valid skill-md skill with a matching digest", () => {
    for (const skill of loadIndex().skills) {
      expect(skill.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(skill.name.length).toBeLessThanOrEqual(64);
      expect(skill.type).toBe("skill-md");
      expect(skill.description.length).toBeLessThanOrEqual(1024);

      const relativePath = new URL(skill.url).pathname.replace(
        "/.well-known/agent-skills/",
        "",
      );
      const file = readFileSync(path.join(skillsDir, relativePath));

      const digest = createHash("sha256").update(file).digest("hex");
      expect(skill.digest).toBe(`sha256:${digest}`);

      const descriptionLine = file
        .toString("utf8")
        .match(/^description:\s*(.+)$/m);
      expect(descriptionLine?.[1]?.trim()).toBe(skill.description);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/utils/agent-skills-integrity.test.ts`
Expected: FAIL — `index.json` does not exist.

- [ ] **Step 3: Create the skill file**

Create `public/.well-known/agent-skills/nublson-content/SKILL.md` with EXACTLY this content:

```markdown
---
name: nublson-content
description: Read blog posts, work case studies, gear recommendations and profile info from nublson.com as clean markdown or via its MCP server.
---

# Reading nublson.com content

nublson.com is the personal site of Nubelson Fernandes — a designer and
developer publishing blog posts, work case studies and tool recommendations.
Everything is public; no authentication is required anywhere.

## Fastest paths

1. **Markdown negotiation (best for reading pages).** Request any page with
   `Accept: text/markdown` and the server returns markdown instead of HTML:
   `/`, `/about`, `/blog`, `/work`, `/gears`, `/blog/{slug}`, `/work/{slug}`.
   Responses include an `x-markdown-tokens` size-estimate header.
2. **Content index.** `https://nublson.com/llms.txt` lists every published
   blog post and work case study with absolute URLs and descriptions. Start
   here to find slugs.
3. **MCP server (best for tools-capable agents).** Streamable HTTP endpoint
   at `https://nublson.com/api/mcp` with five read-only tools: `list_posts`,
   `get_post`, `list_gears`, `get_profile`, `search_posts`. Server card:
   `https://nublson.com/.well-known/mcp/server-card.json`.

## Direct API routes

- `GET /api/markdown/blog/{slug}` and `GET /api/markdown/work/{slug}` —
  a post as markdown with YAML frontmatter (title, description, published,
  author, category).
- `GET /api/markdown/pages/{home|about|blog|work|gears}` — static pages as
  markdown.
- RSS: `/feed.xml` (combined), `/blog/feed.xml`, `/work/feed.xml`.
- OpenAPI description: `https://nublson.com/openapi.json`; API catalog:
  `https://nublson.com/.well-known/api-catalog`.

## Conventions

- Slugs are lowercase-hyphenated post titles; get canonical ones from
  `llms.txt`, `list_posts`, or the sitemap rather than guessing.
- Content is served from a CMS with ~10-second revalidation; repeated reads
  within a few seconds may return cached data.
- Usage preferences are declared in `robots.txt` via Content-Signal:
  search, AI input and AI training are all permitted.
```

- [ ] **Step 4: Compute the digest and create the index**

Run: `shasum -a 256 public/.well-known/agent-skills/nublson-content/SKILL.md`

Create `public/.well-known/agent-skills/index.json`, replacing `<HEX>` with the 64-char hash from above:

```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": [
    {
      "name": "nublson-content",
      "type": "skill-md",
      "description": "Read blog posts, work case studies, gear recommendations and profile info from nublson.com as clean markdown or via its MCP server.",
      "url": "https://nublson.com/.well-known/agent-skills/nublson-content/SKILL.md",
      "digest": "sha256:<HEX>"
    }
  ]
}
```

- [ ] **Step 5: Run the integrity test to verify it passes**

Run: `pnpm vitest run src/utils/agent-skills-integrity.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add public/.well-known/agent-skills src/utils/agent-skills-integrity.test.ts
git commit -m "feat: publish agent skills discovery index with digest guard

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: auth.md heading + discovery skills URL

**Files:**
- Modify: `public/auth.md`
- Modify: `src/utils/agents-discovery.ts`
- Modify: `src/utils/agents-discovery.test.ts`

**Interfaces:**
- Produces: `getAgentsDiscovery().skillsIndexUrl` becomes `${base}/.well-known/agent-skills/index.json`; auth.md H1 becomes `# Auth.md`. Legacy `public/.well-known/agent-skills.json` stays untouched.

- [ ] **Step 1: Update the discovery test (failing first)**

In `src/utils/agents-discovery.test.ts`, replace the `Skills:` assertion value with:

```ts
    expect(txt).toContain(
      "Skills: https://nublson.com/.well-known/agent-skills/index.json",
    );
```

If any other assertion references `/.well-known/agent-skills.json`, update it to the new URL.

- [ ] **Step 2: Run tests to verify the changed assertion fails**

Run: `pnpm vitest run src/utils/agents-discovery.test.ts`
Expected: FAIL on the Skills assertion.

- [ ] **Step 3: Update `src/utils/agents-discovery.ts`**

Change `skillsIndexUrl` in `getAgentsDiscovery` to:

```ts
    skillsIndexUrl: `${base}/.well-known/agent-skills/index.json`,
```

- [ ] **Step 4: Update `public/auth.md`**

Change the first line from `# Authentication` to `# Auth.md`. Everything else stays.

- [ ] **Step 5: Run checks and commit**

Run: `pnpm test && pnpm lint && pnpm type-check`
Expected: all pass.

```bash
git add public/auth.md src/utils/agents-discovery.ts src/utils/agents-discovery.test.ts
git commit -m "fix: auth.md heading and skills index discovery URL

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: End-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Start `pnpm dev` (background), wait for ready**

- [ ] **Step 2: Verify all four deliverables**

```bash
curl -s http://localhost:3000/robots.txt
curl -s -D - -o /dev/null http://localhost:3000/.well-known/api-catalog | grep -i -E "^HTTP|content-type"
curl -s http://localhost:3000/.well-known/api-catalog | python3 -m json.tool > /dev/null && echo CATALOG_JSON_OK
curl -s http://localhost:3000/openapi.json | python3 -m json.tool > /dev/null && echo OPENAPI_OK
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/.well-known/agent-skills/index.json
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/.well-known/agent-skills/nublson-content/SKILL.md
curl -s http://localhost:3000/auth.md | head -1
curl -s http://localhost:3000/agents.txt
```

Expected: robots.txt contains the Content-Signal line, both bot groups and the sitemap; api-catalog returns 200 `application/linkset+json` and valid JSON; openapi.json valid; both skills URLs return 200; auth.md first line is `# Auth.md`; agents.txt `Skills:` line points at `/.well-known/agent-skills/index.json`.

- [ ] **Step 3: Kill dev server; run full checks**

Run: `pnpm test && pnpm lint && pnpm type-check && pnpm build`
Expected: all pass.

- [ ] **Step 4: Check off plan and commit doc updates**

```bash
git add docs/superpowers/plans/2026-08-02-discovery-quick-wins.md
git commit -m "docs: check off discovery quick wins plan

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
