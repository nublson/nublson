# MCP Server + Server Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A real read-only MCP server at `/api/mcp` (Streamable HTTP) with five tools over the site's Notion content, plus truthful discovery files at `/.well-known/mcp/server-card.json` and `/.well-known/mcp.json`.

**Architecture:** `mcp-handler` v2 (stateless, path-agnostic Web handler) mounted at `src/app/api/mcp/route.ts`. Tool logic that is testable lives as pure functions in `src/utils/mcp-content.ts`; the route only fetches Notion data (existing service layer) and delegates. Discovery is static JSON in `public/.well-known/` plus updates to `src/utils/agents-discovery.ts`.

**Tech Stack:** `mcp-handler@^2`, `@modelcontextprotocol/server@^2`, `zod@^4` (all new deps), Next.js App Router, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-02-mcp-server-design.md`

## Global Constraints

- Branch: `feature/mcp-server` (already created). Never commit to `develop`.
- Server identity: name `nublson.com`, version `1.0.0`.
- All five tools are read-only; tool failures return MCP tool results with `isError: true`, never unhandled exceptions.
- Pure helpers only in `src/utils/mcp-content.ts` (no Notion/network calls) — coverage includes `src/utils/**`, excludes `src/app/**`.
- `mcp-handler` 2.x API (verified against npm 2026-08-02): `createMcpHandler(initialize, options)`; `server.registerTool(name, {title, description, inputSchema: z.object(...)}, handler)`; no basePath/redis/maxDuration options; mount route at the desired path directly.
- All commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Pure MCP content helpers (`mcp-content.ts`)

**Files:**
- Create: `src/utils/mcp-content.ts`
- Test: `src/utils/mcp-content.test.ts`

**Interfaces:**
- Consumes: `PostMetadata`, `PageMetadata` types from `@/utils/formatter`.
- Produces (used by Task 3):

```ts
export type PostToolItem = {
  title: string;
  slug: string;
  url: string;
  description?: string;
  publishedDate?: string;
  category?: string;
};

export function postToolItem(post: PostMetadata, baseUrl: string, pathPrefix: "/blog" | "/work"): PostToolItem;
export function searchPosts(items: PostToolItem[], query: string): PostToolItem[];
export function groupGears(gears: PostMetadata[]): { category: string; items: { title: string; url?: string; description?: string }[] }[];
export function profileFromHero(hero: PageMetadata, social: { label: string; url: string }[], baseUrl: string): {
  name: string; description?: string; role?: string; location?: string; url: string;
  social: { name: string; url: string }[];
};
```

Behavior rules:
- `postToolItem`: `url` = `${baseUrl}${pathPrefix}/${post.slug}`; `description`/`category` become `undefined` when empty string; `publishedDate` passes through `post.published_date` or `undefined` when empty.
- `searchPosts`: trims the query; empty/whitespace query → `[]`; case-insensitive substring match against title, description, and category.
- `groupGears`: groups by `post.category` preserving first-seen category order; empty category → `"Other"`; item `url` = `post.path || undefined`; `description` omitted when empty.
- `profileFromHero`: `name` = hero.title; `description`/`role`/`location` `undefined` when empty; `url` = baseUrl; `social` keeps only entries whose url starts with `https://`, mapped to `{name: label, url}`.

- [ ] **Step 1: Write the failing tests**

Create `src/utils/mcp-content.test.ts`:

```ts
import type { PageMetadata, PostMetadata } from "@/utils/formatter";
import { describe, expect, it } from "vitest";
import {
  groupGears,
  postToolItem,
  profileFromHero,
  searchPosts,
  type PostToolItem,
} from "./mcp-content";

function post(overrides: Partial<PostMetadata>): PostMetadata {
  return {
    id: "id",
    title: "",
    slug: "",
    description: "",
    published_date: "",
    updated_date: "",
    path: "",
    source: "",
    category: "",
    author: "",
    ...overrides,
  };
}

describe("postToolItem", () => {
  it("builds an item with absolute url and all fields", () => {
    const item = postToolItem(
      post({
        title: "Hello",
        slug: "hello",
        description: "Intro.",
        published_date: "2025-09-19",
        category: "Design",
      }),
      "https://nublson.com",
      "/blog",
    );

    expect(item).toEqual({
      title: "Hello",
      slug: "hello",
      url: "https://nublson.com/blog/hello",
      description: "Intro.",
      publishedDate: "2025-09-19",
      category: "Design",
    });
  });

  it("drops empty optional fields", () => {
    const item = postToolItem(
      post({ title: "Bare", slug: "bare" }),
      "https://nublson.com",
      "/work",
    );

    expect(item).toEqual({
      title: "Bare",
      slug: "bare",
      url: "https://nublson.com/work/bare",
      description: undefined,
      publishedDate: undefined,
      category: undefined,
    });
  });
});

describe("searchPosts", () => {
  const items: PostToolItem[] = [
    {
      title: "Design Systems",
      slug: "design-systems",
      url: "u1",
      description: "Tokens and components.",
      category: "Design",
    },
    {
      title: "Next.js Caching",
      slug: "nextjs-caching",
      url: "u2",
      description: "ISR deep dive.",
      category: "Engineering",
    },
  ];

  it("matches case-insensitively across title, description and category", () => {
    expect(searchPosts(items, "design")).toHaveLength(1);
    expect(searchPosts(items, "TOKENS")).toHaveLength(1);
    expect(searchPosts(items, "engineering")).toHaveLength(1);
  });

  it("returns empty for empty or whitespace queries", () => {
    expect(searchPosts(items, "")).toEqual([]);
    expect(searchPosts(items, "   ")).toEqual([]);
  });

  it("returns empty when nothing matches", () => {
    expect(searchPosts(items, "quantum")).toEqual([]);
  });
});

describe("groupGears", () => {
  it("groups by category preserving first-seen order", () => {
    const groups = groupGears([
      post({ title: "Keyboard", category: "Desk", path: "https://x.com/kb" }),
      post({ title: "Camera", category: "Video", path: "https://x.com/cam" }),
      post({ title: "Mic", category: "Video", path: "https://x.com/mic" }),
    ]);

    expect(groups.map((g) => g.category)).toEqual(["Desk", "Video"]);
    expect(groups[1]?.items.map((i) => i.title)).toEqual(["Camera", "Mic"]);
  });

  it("falls back to Other and omits empty urls/descriptions", () => {
    const groups = groupGears([post({ title: "Mystery" })]);

    expect(groups).toEqual([
      {
        category: "Other",
        items: [{ title: "Mystery", url: undefined, description: undefined }],
      },
    ]);
  });
});

describe("profileFromHero", () => {
  const hero: PageMetadata = {
    id: "id",
    title: "Nubelson Fernandes",
    slug: "nubelson-fernandes",
    description: "Designer and developer.",
    modified_date: undefined,
    role: "Product Designer",
    location: "Lisbon, Portugal",
  };

  it("builds the profile with https-only social links", () => {
    const profile = profileFromHero(
      hero,
      [
        { label: "GitHub", url: "https://github.com/nublson" },
        { label: "Local", url: "http://localhost:3000" },
      ],
      "https://nublson.com",
    );

    expect(profile).toEqual({
      name: "Nubelson Fernandes",
      description: "Designer and developer.",
      role: "Product Designer",
      location: "Lisbon, Portugal",
      url: "https://nublson.com",
      social: [{ name: "GitHub", url: "https://github.com/nublson" }],
    });
  });

  it("drops empty optional fields", () => {
    const profile = profileFromHero(
      { ...hero, description: "", role: undefined, location: undefined },
      [],
      "https://nublson.com",
    );

    expect(profile.description).toBeUndefined();
    expect(profile.role).toBeUndefined();
    expect(profile.location).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/mcp-content.test.ts`
Expected: FAIL — cannot resolve `./mcp-content`.

- [ ] **Step 3: Write the implementation**

Create `src/utils/mcp-content.ts`:

```ts
import type { PageMetadata, PostMetadata } from "@/utils/formatter";

export type PostToolItem = {
  title: string;
  slug: string;
  url: string;
  description?: string;
  publishedDate?: string;
  category?: string;
};

export type GearGroup = {
  category: string;
  items: { title: string; url?: string; description?: string }[];
};

export type Profile = {
  name: string;
  description?: string;
  role?: string;
  location?: string;
  url: string;
  social: { name: string; url: string }[];
};

export function postToolItem(
  post: PostMetadata,
  baseUrl: string,
  pathPrefix: "/blog" | "/work",
): PostToolItem {
  return {
    title: post.title,
    slug: post.slug,
    url: `${baseUrl}${pathPrefix}/${post.slug}`,
    description: post.description || undefined,
    publishedDate: post.published_date || undefined,
    category: post.category || undefined,
  };
}

export function searchPosts(
  items: PostToolItem[],
  query: string,
): PostToolItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return items.filter((item) =>
    [item.title, item.description, item.category].some((field) =>
      field?.toLowerCase().includes(needle),
    ),
  );
}

export function groupGears(gears: PostMetadata[]): GearGroup[] {
  const groups: GearGroup[] = [];

  for (const gear of gears) {
    const category = gear.category || "Other";
    let group = groups.find((g) => g.category === category);
    if (!group) {
      group = { category, items: [] };
      groups.push(group);
    }
    group.items.push({
      title: gear.title,
      url: gear.path || undefined,
      description: gear.description || undefined,
    });
  }

  return groups;
}

export function profileFromHero(
  hero: PageMetadata,
  social: { label: string; url: string }[],
  baseUrl: string,
): Profile {
  return {
    name: hero.title,
    description: hero.description || undefined,
    role: hero.role || undefined,
    location: hero.location || undefined,
    url: baseUrl,
    social: social
      .filter((item) => item.url.startsWith("https://"))
      .map((item) => ({ name: item.label, url: item.url })),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/utils/mcp-content.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/mcp-content.ts src/utils/mcp-content.test.ts
git commit -m "feat: add pure helpers for MCP content tools

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Agents discovery points at the server card and live endpoint

**Files:**
- Modify: `src/utils/agents-discovery.ts`
- Modify: `src/utils/agents-discovery.test.ts`

**Interfaces:**
- Produces: `AgentsDiscovery` gains `mcpEndpointUrl: string`; `mcpCardUrl` changes to `/.well-known/mcp/server-card.json`. `buildAgentsTxt` output gains an `MCP-Endpoint:` line directly under the `MCP:` line. `buildAgentsJson().mcp[0]` gains `endpoint` and `transport` fields. Task 4's server card and Task 5's verification rely on these URLs.

- [ ] **Step 1: Update the tests to the new contract (failing first)**

In `src/utils/agents-discovery.test.ts`, update the existing assertions and add new ones:

- Replace the existing `MCP:` assertion with:

```ts
    expect(txt).toContain(
      "MCP: https://nublson.com/.well-known/mcp/server-card.json",
    );
    expect(txt).toContain("MCP-Endpoint: https://nublson.com/api/mcp");
```

- In the agents.json test, add:

```ts
    expect(json.mcp[0]).toMatchObject({
      url: "https://nublson.com/.well-known/mcp/server-card.json",
      endpoint: "https://nublson.com/api/mcp",
      transport: "streamable-http",
    });
```

- If any other assertion references `/.well-known/mcp.json`, update it to the server-card URL.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/agents-discovery.test.ts`
Expected: FAIL on the changed assertions.

- [ ] **Step 3: Update `src/utils/agents-discovery.ts`**

- In `AgentsDiscovery` type: add `mcpEndpointUrl: string;` after `mcpCardUrl`.
- In `getAgentsDiscovery`: change `mcpCardUrl` to `` `${base}/.well-known/mcp/server-card.json` `` and add `mcpEndpointUrl: `${base}/api/mcp`,`.
- In `buildAgentsTxt` lines array: after the `MCP:` line add `` `MCP-Endpoint: ${discovery.mcpEndpointUrl}` ``.
- In `buildAgentsJson` `mcp` array entry: add `endpoint: discovery.mcpEndpointUrl,` and `transport: "streamable-http",` and update the description to `"MCP server card and Streamable HTTP endpoint exposing read-only content tools."`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/utils/agents-discovery.test.ts`
Expected: PASS.

- [ ] **Step 5: Full suite + lint + type-check, then commit**

Run: `pnpm test && pnpm lint && pnpm type-check`

```bash
git add src/utils/agents-discovery.ts src/utils/agents-discovery.test.ts
git commit -m "feat: advertise MCP server card and endpoint in agents discovery

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: MCP route with five tools

**Files:**
- Modify: `package.json` (+lockfile) via `pnpm add mcp-handler @modelcontextprotocol/server zod`
- Create: `src/app/api/mcp/route.ts`

**Interfaces:**
- Consumes: Task 1's helpers; `getDatabasePages`, `getDatabasePageBySlug`, `getPageBlocks`, `getPageData` from `@/services/notion`; `formatPageMetadata`, `formatPostMetadata` from `@/utils/formatter`; `postToMarkdown` from `@/utils/blocks-to-markdown`; `formatDateTimeIso` from `@/utils/formatter`; `social` from `@/data/social.json`.
- Produces: `POST /api/mcp` (and GET for protocol negotiation) serving MCP Streamable HTTP with tools `list_posts`, `get_post`, `list_gears`, `get_profile`, `search_posts`. Task 4's card documents these names; Task 5 calls them.

- [ ] **Step 1: Install dependencies**

Run: `pnpm add mcp-handler @modelcontextprotocol/server zod`
Expected: `mcp-handler@^2`, `@modelcontextprotocol/server@^2`, `zod@^4` in `package.json` dependencies.

- [ ] **Step 2: Write the route**

Create `src/app/api/mcp/route.ts`:

```ts
import social from "@/data/social.json";
import {
  getDatabasePageBySlug,
  getDatabasePages,
  getPageBlocks,
  getPageData,
} from "@/services/notion";
import { postToMarkdown } from "@/utils/blocks-to-markdown";
import {
  formatDateTimeIso,
  formatPageMetadata,
  formatPostMetadata,
} from "@/utils/formatter";
import {
  groupGears,
  postToolItem,
  profileFromHero,
  searchPosts,
  type PostToolItem,
} from "@/utils/mcp-content";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const MEDIA_BY_TYPE = { blog: "Blog", work: "Project" } as const;
const PATH_BY_TYPE = { blog: "/blog", work: "/work" } as const;

type PostType = keyof typeof MEDIA_BY_TYPE;

function baseUrl(): string {
  return process.env.BASE_URL!.replace(/\/$/, "");
}

function jsonResult(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function errorResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

async function fetchPostItems(type: PostType): Promise<PostToolItem[]> {
  const pages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    MEDIA_BY_TYPE[type],
    50,
  );
  return formatPostMetadata(pages).map((post) =>
    postToolItem(post, baseUrl(), PATH_BY_TYPE[type]),
  );
}

async function fetchAllPostItems(type?: PostType): Promise<PostToolItem[]> {
  if (type) return fetchPostItems(type);
  const [blog, work] = await Promise.all([
    fetchPostItems("blog"),
    fetchPostItems("work"),
  ]);
  return [...blog, ...work];
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_posts",
      {
        title: "List posts",
        description:
          "List published blog posts and work case studies with slugs, URLs, dates and descriptions. Omit type to get both.",
        inputSchema: z.object({
          type: z.enum(["blog", "work"]).optional(),
        }),
      },
      async ({ type }) => jsonResult(await fetchAllPostItems(type)),
    );

    server.registerTool(
      "get_post",
      {
        title: "Get post",
        description:
          "Fetch a single blog post or work case study as markdown by slug (use list_posts to find slugs).",
        inputSchema: z.object({
          type: z.enum(["blog", "work"]),
          slug: z.string().min(1),
        }),
      },
      async ({ type, slug }) => {
        const found = await getDatabasePageBySlug(
          process.env.NOTION_DATABASE_CONTENT_ID!,
          MEDIA_BY_TYPE[type],
          slug,
        );

        if (!found) {
          return errorResult(
            `No ${type} post found for slug "${slug}". Use list_posts to see available slugs.`,
          );
        }

        const blocks = await getPageBlocks(found.page.id);
        const markdown = postToMarkdown({
          title: found.metadata.title,
          description: found.metadata.description,
          publishedDate: formatDateTimeIso(found.metadata.published_date),
          author: found.metadata.author,
          category: found.metadata.category || undefined,
          blocks,
        });

        return { content: [{ type: "text" as const, text: markdown }] };
      },
    );

    server.registerTool(
      "list_gears",
      {
        title: "List gear",
        description:
          "List recommended tools and gear, grouped by category, with product links.",
        inputSchema: z.object({}),
      },
      async () => {
        const pages = await getDatabasePages(
          process.env.NOTION_DATABASE_GEARS_ID!,
          undefined,
          50,
          [
            { property: "Category", direction: "ascending" },
            { property: "State", direction: "descending" },
            { property: "Updated", direction: "ascending" },
          ],
          ["title", "Description", "Category", "Path"],
        );
        return jsonResult(groupGears(formatPostMetadata(pages)));
      },
    );

    server.registerTool(
      "get_profile",
      {
        title: "Get profile",
        description:
          "Get Nubelson Fernandes' profile: name, role, location, bio and social links.",
        inputSchema: z.object({}),
      },
      async () => {
        const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
        return jsonResult(
          profileFromHero(formatPageMetadata(page), social.media, baseUrl()),
        );
      },
    );

    server.registerTool(
      "search_posts",
      {
        title: "Search posts",
        description:
          "Case-insensitive search across post titles, descriptions and categories.",
        inputSchema: z.object({
          query: z.string().min(1),
        }),
      },
      async ({ query }) => {
        const matches = searchPosts(await fetchAllPostItems(), query);
        if (matches.length === 0) {
          return errorResult(
            `No posts matched "${query}". Try list_posts for the full index.`,
          );
        }
        return jsonResult(matches);
      },
    );
  },
  {
    serverInfo: { name: "nublson.com", version: "1.0.0" },
  },
);

export { handler as GET, handler as POST };
```

Note: if `serverInfo` is rejected by the installed version's types, check `node_modules/mcp-handler/dist/index.d.ts` for the exact options field (2.x merged SDK server options with `serverInfo`, `verboseLogs`, `onEvent`) and adjust — the server MUST identify as `nublson.com` / `1.0.0`.

- [ ] **Step 3: Verify with lint and type-check**

Run: `pnpm lint && pnpm type-check`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/app/api/mcp/route.ts
git commit -m "feat: add read-only MCP server with content tools

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Discovery files (server card + mcp.json)

**Files:**
- Create: `public/.well-known/mcp/server-card.json`
- Modify: `public/.well-known/mcp.json`

**Interfaces:**
- Consumes: tool names from Task 3, URLs matching Task 2's discovery values.
- Produces: static discovery JSON served at `/.well-known/mcp/server-card.json` and `/.well-known/mcp.json`.

- [ ] **Step 1: Create `public/.well-known/mcp/server-card.json`**

```json
{
  "name": "nublson.com",
  "serverInfo": {
    "name": "nublson.com",
    "title": "Nubelson Fernandes — Content MCP Server",
    "version": "1.0.0",
    "description": "Read-only MCP server exposing blog posts, work case studies, gear recommendations and profile info from nublson.com."
  },
  "transport": {
    "type": "streamable-http",
    "endpoint": "https://nublson.com/api/mcp"
  },
  "capabilities": {
    "tools": { "listChanged": false }
  },
  "tools": [
    { "name": "list_posts", "description": "List published blog posts and work case studies with slugs, URLs, dates and descriptions." },
    { "name": "get_post", "description": "Fetch a single blog post or work case study as markdown by slug." },
    { "name": "list_gears", "description": "List recommended tools and gear, grouped by category, with product links." },
    { "name": "get_profile", "description": "Get Nubelson Fernandes' profile: name, role, location, bio and social links." },
    { "name": "search_posts", "description": "Case-insensitive search across post titles, descriptions and categories." }
  ],
  "authentication": { "type": "none" },
  "website": "https://nublson.com"
}
```

- [ ] **Step 2: Update `public/.well-known/mcp.json`**

Replace the file's content with (keeps the resources block, adds server identity and transport):

```json
{
  "name": "nublson.com",
  "description": "Personal site and content source — blog and work case studies.",
  "url": "https://nublson.com",
  "serverInfo": {
    "name": "nublson.com",
    "version": "1.0.0"
  },
  "transport": {
    "type": "streamable-http",
    "endpoint": "https://nublson.com/api/mcp"
  },
  "serverCard": "https://nublson.com/.well-known/mcp/server-card.json",
  "capabilities": {
    "resources": true,
    "tools": true
  },
  "resources": [
    {
      "name": "Blog posts",
      "uriTemplate": "https://nublson.com/api/markdown/blog/{slug}"
    },
    {
      "name": "Work posts",
      "uriTemplate": "https://nublson.com/api/markdown/work/{slug}"
    }
  ]
}
```

- [ ] **Step 3: Validate JSON and commit**

Run: `python3 -m json.tool public/.well-known/mcp/server-card.json > /dev/null && python3 -m json.tool public/.well-known/mcp.json > /dev/null && echo OK`
Expected: `OK`.

```bash
git add public/.well-known/mcp/server-card.json public/.well-known/mcp.json
git commit -m "feat: publish MCP server card and enrich mcp.json

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: End-to-end verification

**Files:** none (verification only). Requires `.env.local` Notion credentials (present).

- [ ] **Step 1: Start `pnpm dev` (background), wait for ready**

- [ ] **Step 2: MCP protocol round-trip via curl**

Initialize (expect JSON response with serverInfo name `nublson.com`):

```bash
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'
```

tools/list (expect exactly 5 tools with the names from Task 3):

```bash
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'
```

tools/call for each tool (adjust a real slug from list_posts output):

```bash
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_posts","arguments":{}}}'
```

Repeat for `get_post` (real slug → markdown; fake slug → `isError: true`), `list_gears`, `get_profile`, `search_posts` (matching query → items; gibberish query → `isError: true`).

Note: if the server responds with `event:`/`data:` SSE framing, parse the `data:` line — both are valid Streamable HTTP responses.

- [ ] **Step 3: Discovery files reachable**

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3000/.well-known/mcp/server-card.json
curl -s http://localhost:3000/agents.txt
```

Expected: `200 application/json`, and agents.txt contains `MCP-Endpoint: http://localhost:3000/api/mcp`... note agents.txt uses BASE_URL so locally it prints the localhost origin — verify the two MCP lines are present.

- [ ] **Step 4: Kill dev server; run full checks**

Run: `pnpm test && pnpm lint && pnpm type-check && pnpm build`
Expected: all pass.

- [ ] **Step 5: Check off plan and commit doc updates**

```bash
git add docs/superpowers/plans/2026-08-02-mcp-server.md
git commit -m "docs: check off MCP server plan

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
