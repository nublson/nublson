# Site-wide Markdown Negotiation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every HTML page (`/`, `/about`, `/blog`, `/work`, `/gears`) returns markdown when a client sends `Accept: text/markdown`, matching what the existing `/blog/[slug]` and `/work/[slug]` negotiation already does.

**Architecture:** A new pure builder module (`src/utils/pages-to-markdown.ts`) renders markdown from already-fetched data. A new route (`/api/markdown/pages/[page]`) assembles Notion data (same service calls the HTML components use) and calls the builders. The proxy (`src/proxy.ts`) rewrites the five static paths to the new route when the Accept header asks for markdown, and adds `Vary: Accept` on all negotiated paths.

**Tech Stack:** Next.js App Router middleware (proxy), Notion service layer (`src/services/notion.tsx`), Vitest.

**Spec:** `docs/superpowers/specs/2026-08-02-sitewide-markdown-negotiation-design.md`

## Global Constraints

- Branch: work happens on `feature/sitewide-markdown-negotiation` (already created). Never commit to `develop`.
- Markdown responses: `Content-Type: text/markdown; charset=utf-8`, `Cache-Control: s-maxage=10, stale-while-revalidate=59`, `Vary: Accept`, `x-markdown-tokens` header.
- Builders must be pure (no Notion/network calls) — coverage includes `src/utils/**` and `src/proxy.ts`, excludes `src/app/**` and `src/services/**`.
- Existing `/api/markdown/[type]/[slug]` route stays untouched.
- All commits end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Markdown page builders (`pages-to-markdown.ts`)

**Files:**
- Create: `src/utils/pages-to-markdown.ts`
- Test: `src/utils/pages-to-markdown.test.ts`

**Interfaces:**
- Consumes: `blocksToMarkdown(blocks)` from `src/utils/blocks-to-markdown` is NOT called here — callers pre-render blocks and pass the markdown string as `body`.
- Produces (used by Task 3):

```ts
export type MarkdownHero = {
  title: string;
  description: string;
  role?: string;
  location?: string;
};

export type MarkdownPostLink = {
  title: string;
  url: string;
  description?: string;
  publishedDate?: string; // ISO 8601
};

export type MarkdownSection = {
  heading: string;
  posts: MarkdownPostLink[];
};

export function pageToMarkdown(input: {
  hero: MarkdownHero;
  body?: string; // pre-rendered markdown (e.g. blocksToMarkdown output)
  sections?: MarkdownSection[];
}): string;

export function estimateMarkdownTokens(markdown: string): number; // ceil(length / 4)
```

Output shape of `pageToMarkdown`:

```markdown
# {hero.title}

> {hero.description}

{hero.role} — {hero.location}

{body}

## {section.heading}

- [{post.title}]({post.url}) ({publishedDate date part}): {description}
```

Rules: the `>` line only if description is non-empty; the role line only if `role` or `location` present (joined with ` — ` when both); empty sections (no posts) are omitted entirely; date rendered as the `YYYY-MM-DD` prefix of `publishedDate`; description suffix only when present; output always ends with a single trailing newline.

- [x] **Step 1: Write the failing tests**

Create `src/utils/pages-to-markdown.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  estimateMarkdownTokens,
  pageToMarkdown,
} from "./pages-to-markdown";

describe("pageToMarkdown", () => {
  it("renders hero with title, description, role and location", () => {
    const markdown = pageToMarkdown({
      hero: {
        title: "Nubelson Fernandes",
        description: "Designer and developer.",
        role: "Product Designer",
        location: "Lisbon, Portugal",
      },
    });

    expect(markdown).toBe(
      "# Nubelson Fernandes\n\n> Designer and developer.\n\nProduct Designer — Lisbon, Portugal\n",
    );
  });

  it("omits description quote and role line when absent", () => {
    const markdown = pageToMarkdown({
      hero: { title: "Blog", description: "" },
    });

    expect(markdown).toBe("# Blog\n");
  });

  it("renders body markdown after the hero", () => {
    const markdown = pageToMarkdown({
      hero: { title: "About", description: "Who I am." },
      body: "I design things.\n\nI build things.",
    });

    expect(markdown).toBe(
      "# About\n\n> Who I am.\n\nI design things.\n\nI build things.\n",
    );
  });

  it("renders sections with linked posts, dates and descriptions", () => {
    const markdown = pageToMarkdown({
      hero: { title: "Blog", description: "Writing." },
      sections: [
        {
          heading: "Latest Posts",
          posts: [
            {
              title: "Hello World",
              url: "https://nublson.com/blog/hello-world",
              description: "An intro.",
              publishedDate: "2025-09-19T00:00:00Z",
            },
            {
              title: "No Extras",
              url: "https://nublson.com/blog/no-extras",
            },
          ],
        },
      ],
    });

    expect(markdown).toBe(
      "# Blog\n\n> Writing.\n\n## Latest Posts\n\n" +
        "- [Hello World](https://nublson.com/blog/hello-world) (2025-09-19): An intro.\n" +
        "- [No Extras](https://nublson.com/blog/no-extras)\n",
    );
  });

  it("omits sections that have no posts", () => {
    const markdown = pageToMarkdown({
      hero: { title: "Home", description: "Hi." },
      sections: [{ heading: "Empty", posts: [] }],
    });

    expect(markdown).toBe("# Home\n\n> Hi.\n");
  });
});

describe("estimateMarkdownTokens", () => {
  it("estimates ceil(chars / 4)", () => {
    expect(estimateMarkdownTokens("abcd")).toBe(1);
    expect(estimateMarkdownTokens("abcde")).toBe(2);
    expect(estimateMarkdownTokens("")).toBe(0);
  });
});
```

- [x] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/pages-to-markdown.test.ts`
Expected: FAIL — cannot resolve `./pages-to-markdown`.

- [x] **Step 3: Write the implementation**

Create `src/utils/pages-to-markdown.ts`:

```ts
export type MarkdownHero = {
  title: string;
  description: string;
  role?: string;
  location?: string;
};

export type MarkdownPostLink = {
  title: string;
  url: string;
  description?: string;
  publishedDate?: string;
};

export type MarkdownSection = {
  heading: string;
  posts: MarkdownPostLink[];
};

function postLine(post: MarkdownPostLink): string {
  const date = post.publishedDate ? ` (${post.publishedDate.slice(0, 10)})` : "";
  const description = post.description ? `: ${post.description}` : "";
  return `- [${post.title}](${post.url})${date}${description}`;
}

export function pageToMarkdown({
  hero,
  body,
  sections = [],
}: {
  hero: MarkdownHero;
  body?: string;
  sections?: MarkdownSection[];
}): string {
  const parts: string[] = [`# ${hero.title}`];

  if (hero.description) parts.push(`> ${hero.description}`);

  const byline = [hero.role, hero.location].filter(Boolean).join(" — ");
  if (byline) parts.push(byline);

  if (body) parts.push(body.trim());

  for (const section of sections) {
    if (section.posts.length === 0) continue;
    parts.push(`## ${section.heading}`);
    parts.push(section.posts.map(postLine).join("\n"));
  }

  return `${parts.join("\n\n")}\n`;
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}
```

- [x] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/utils/pages-to-markdown.test.ts`
Expected: PASS (6 tests).

- [x] **Step 5: Commit**

```bash
git add src/utils/pages-to-markdown.ts src/utils/pages-to-markdown.test.ts
git commit -m "feat: add markdown builders for static pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Proxy rewrites for static pages + `Vary: Accept`

**Files:**
- Modify: `src/proxy.ts`
- Test: `src/proxy.test.ts` (new)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: rewrites `/` → `/api/markdown/pages/home`, `/about` → `/api/markdown/pages/about`, `/blog` → `/api/markdown/pages/blog`, `/work` → `/api/markdown/pages/work`, `/gears` → `/api/markdown/pages/gears` when `Accept: text/markdown`. Task 3 must serve those paths. All negotiated paths (the five above plus `/blog/[slug]`, `/work/[slug]`) get `Vary: Accept` on every response, markdown or HTML.

- [x] **Step 1: Write the failing tests**

Create `src/proxy.test.ts`:

```ts
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function request(path: string, accept?: string): NextRequest {
  return new NextRequest(`https://nublson.com${path}`, {
    headers: accept ? { accept } : {},
  });
}

function rewriteTarget(response: Response): string | null {
  return response.headers.get("x-middleware-rewrite");
}

describe("proxy markdown negotiation", () => {
  it.each([
    ["/", "home"],
    ["/about", "about"],
    ["/blog", "blog"],
    ["/work", "work"],
    ["/gears", "gears"],
  ])("rewrites %s to pages/%s for text/markdown", (path, page) => {
    const response = proxy(request(path, "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      `https://nublson.com/api/markdown/pages/${page}`,
    );
  });

  it("rewrites blog post paths to the post markdown route", () => {
    const response = proxy(request("/blog/my-post", "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/blog/my-post",
    );
  });

  it("rewrites work post paths to the post markdown route", () => {
    const response = proxy(request("/work/my-project", "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/work/my-project",
    );
  });

  it("accepts markdown among multiple Accept values", () => {
    const response = proxy(request("/", "text/markdown, text/html;q=0.9"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/pages/home",
    );
  });

  it("does not rewrite HTML requests", () => {
    const response = proxy(request("/", "text/html"));
    expect(rewriteTarget(response)).toBeNull();
  });

  it("does not rewrite unknown paths even for markdown requests", () => {
    const response = proxy(request("/nonexistent", "text/markdown"));
    expect(rewriteTarget(response)).toBeNull();
  });

  it("sets Vary: Accept on negotiated paths for HTML responses", () => {
    const response = proxy(request("/", "text/html"));
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("sets Vary: Accept on post paths", () => {
    const response = proxy(request("/blog/my-post", "text/html"));
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("does not set Vary on non-negotiated paths", () => {
    const response = proxy(request("/feed.xml", "text/html"));
    expect(response.headers.get("vary")).toBeNull();
  });

  it("keeps discovery Link headers on every response", () => {
    const response = proxy(request("/", "text/html"));
    expect(response.headers.get("link")).toContain(
      'rel="sitemap"',
    );
  });
});
```

Note: if importing `next/server` fails under the default jsdom environment, add `// @vitest-environment node` as the first line of the test file.

- [x] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/proxy.test.ts`
Expected: FAIL — the five static-page rewrites return `null` (current proxy only rewrites post paths) and `vary` is not set.

- [x] **Step 3: Update `src/proxy.ts`**

Replace the `proxy` function (keep `acceptsMarkdown` and `withDiscoveryHeaders` as-is) and add the path map. The two duplicated blog/work match blocks collapse into one:

```ts
const PAGE_MARKDOWN_PATHS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/blog": "blog",
  "/work": "work",
  "/gears": "gears",
};

const POST_PATH_PATTERN = /^\/(blog|work)\/([^/]+)$/;

function markdownRewritePath(pathname: string): string | null {
  const page = PAGE_MARKDOWN_PATHS[pathname];
  if (page) return `/api/markdown/pages/${page}`;

  const postMatch = pathname.match(POST_PATH_PATTERN);
  if (postMatch) return `/api/markdown/${postMatch[1]}/${postMatch[2]}`;

  return null;
}

function isNegotiatedPath(pathname: string): boolean {
  return pathname in PAGE_MARKDOWN_PATHS || POST_PATH_PATTERN.test(pathname);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response: NextResponse | undefined;

  if (acceptsMarkdown(request)) {
    const rewritePath = markdownRewritePath(pathname);
    if (rewritePath) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = rewritePath;
      response = NextResponse.rewrite(rewriteUrl);
    }
  }

  response ??= NextResponse.next();

  if (isNegotiatedPath(pathname)) {
    response.headers.set("Vary", "Accept");
  }

  return withDiscoveryHeaders(request, response);
}
```

- [x] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/proxy.test.ts`
Expected: PASS (12 tests).

- [x] **Step 5: Run the full suite, lint, and type-check**

Run: `pnpm test && pnpm lint && pnpm type-check`
Expected: all pass (no other test touches the proxy).

- [x] **Step 6: Commit**

```bash
git add src/proxy.ts src/proxy.test.ts
git commit -m "feat: negotiate markdown for static pages in proxy

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Markdown route for static pages

**Files:**
- Create: `src/app/api/markdown/pages/[page]/route.ts`

**Interfaces:**
- Consumes:
  - `pageToMarkdown`, `estimateMarkdownTokens`, `MarkdownPostLink`, `MarkdownSection` from `@/utils/pages-to-markdown` (Task 1).
  - `getPageData(pageId)`, `getPageBlocks(pageId)`, `getDatabasePages(databaseId, media?, limit?, sorts?, filterProperties?)` from `@/services/notion`.
  - `formatPageMetadata`, `formatPostMetadata`, `formatDateTimeIso`, and type `PostMetadata` from `@/utils/formatter`.
  - `blocksToMarkdown` from `@/utils/blocks-to-markdown`.
- Produces: `GET /api/markdown/pages/{home|about|blog|work|gears}` → `200 text/markdown`; anything else → `400` JSON. This is the rewrite target Task 2 depends on.

Data per page mirrors the HTML components exactly:

| Page | Hero (`getPageData`) | Body blocks (`getPageBlocks`) | Sections (`getDatabasePages`) |
|---|---|---|---|
| home | `NOTION_PAGE_HOME_ID` | — | "Latest Projects": `(CONTENT, "Project", 3)`; "Latest Posts": `(CONTENT, "Blog", 4)` |
| about | `NOTION_PAGE_ABOUT_ID` | `NOTION_PAGE_ABOUT_ID` | — |
| blog | `NOTION_PAGE_BLOG_ID` | — | "Latest Posts": `(CONTENT, "Blog", 20)` |
| work | `NOTION_PAGE_WORK_ID` | `NOTION_PAGE_WORK_ID` | "Latest Projects": `(CONTENT, "Project", 20)` |
| gears | `NOTION_PAGE_GEARS_ID` | `NOTION_PAGE_GEARS_ID` | one section per gear category (see code) |

- [x] **Step 1: Write the route**

Create `src/app/api/markdown/pages/[page]/route.ts`:

```ts
import {
  getDatabasePages,
  getPageBlocks,
  getPageData,
} from "@/services/notion";
import { blocksToMarkdown } from "@/utils/blocks-to-markdown";
import {
  formatDateTimeIso,
  formatPageMetadata,
  formatPostMetadata,
  type PostMetadata,
} from "@/utils/formatter";
import {
  estimateMarkdownTokens,
  pageToMarkdown,
  type MarkdownPostLink,
  type MarkdownSection,
} from "@/utils/pages-to-markdown";
import { NextResponse } from "next/server";

export const revalidate = 10;

const PAGES = ["home", "about", "blog", "work", "gears"] as const;

type MarkdownPage = (typeof PAGES)[number];

function isMarkdownPage(value: string): value is MarkdownPage {
  return (PAGES as readonly string[]).includes(value);
}

function toPostLinks(
  posts: PostMetadata[],
  base: string,
  pathPrefix: "/blog" | "/work",
): MarkdownPostLink[] {
  return posts.map((post) => ({
    title: post.title,
    url: `${base}${pathPrefix}/${post.slug}`,
    description: post.description || undefined,
    publishedDate: post.published_date
      ? formatDateTimeIso(post.published_date)
      : undefined,
  }));
}

function gearSections(gears: PostMetadata[]): MarkdownSection[] {
  const categories = [...new Set(gears.map((gear) => gear.category))];
  return categories.map((category) => ({
    heading: category || "Other",
    posts: gears
      .filter((gear) => gear.category === category)
      .map((gear) => ({
        title: gear.title,
        url: gear.path,
        description: gear.description || undefined,
      })),
  }));
}

async function heroFor(pageId: string) {
  return formatPageMetadata(await getPageData(pageId));
}

async function bodyFor(pageId: string): Promise<string> {
  return blocksToMarkdown(await getPageBlocks(pageId));
}

async function buildPageMarkdown(
  page: MarkdownPage,
  base: string,
): Promise<string> {
  const contentDb = process.env.NOTION_DATABASE_CONTENT_ID!;

  switch (page) {
    case "home": {
      const [hero, projectPages, blogPages] = await Promise.all([
        heroFor(process.env.NOTION_PAGE_HOME_ID!),
        getDatabasePages(contentDb, "Project", 3),
        getDatabasePages(contentDb, "Blog", 4),
      ]);
      return pageToMarkdown({
        hero,
        sections: [
          {
            heading: "Latest Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/work"),
          },
          {
            heading: "Latest Posts",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/blog"),
          },
        ],
      });
    }
    case "about": {
      const pageId = process.env.NOTION_PAGE_ABOUT_ID!;
      const [hero, body] = await Promise.all([heroFor(pageId), bodyFor(pageId)]);
      return pageToMarkdown({ hero, body });
    }
    case "blog": {
      const [hero, blogPages] = await Promise.all([
        heroFor(process.env.NOTION_PAGE_BLOG_ID!),
        getDatabasePages(contentDb, "Blog", 20),
      ]);
      return pageToMarkdown({
        hero,
        sections: [
          {
            heading: "Latest Posts",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/blog"),
          },
        ],
      });
    }
    case "work": {
      const pageId = process.env.NOTION_PAGE_WORK_ID!;
      const [hero, body, projectPages] = await Promise.all([
        heroFor(pageId),
        bodyFor(pageId),
        getDatabasePages(contentDb, "Project", 20),
      ]);
      return pageToMarkdown({
        hero,
        body,
        sections: [
          {
            heading: "Latest Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/work"),
          },
        ],
      });
    }
    case "gears": {
      const pageId = process.env.NOTION_PAGE_GEARS_ID!;
      const [hero, body, gearPages] = await Promise.all([
        heroFor(pageId),
        bodyFor(pageId),
        getDatabasePages(
          process.env.NOTION_DATABASE_GEARS_ID!,
          undefined,
          50,
          [
            { property: "Category", direction: "ascending" },
            { property: "State", direction: "descending" },
            { property: "Updated", direction: "ascending" },
          ],
          ["title", "Description", "Category", "Path"],
        ),
      ]);
      return pageToMarkdown({
        hero,
        body,
        sections: gearSections(formatPostMetadata(gearPages)),
      });
    }
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;

  if (!isMarkdownPage(page)) {
    return NextResponse.json({ message: "Invalid page" }, { status: 400 });
  }

  const base = process.env.BASE_URL!.replace(/\/$/, "");
  const markdown = await buildPageMarkdown(page, base);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      Vary: "Accept",
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
    },
  });
}
```

Note: `getDatabasePages` sorts/filterProperties parameter shapes come from the gears usage in `src/app/_components/gears-category.tsx` — copy exactly. `gear.path` is the external product URL (Notion `Path` property).

- [x] **Step 2: Verify with lint and type-check**

Run: `pnpm lint && pnpm type-check`
Expected: both pass. (Route files are excluded from unit coverage; behavior is verified in Task 4.)

- [x] **Step 3: Commit**

```bash
git add "src/app/api/markdown/pages/[page]/route.ts"
git commit -m "feat: add markdown route for static pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: End-to-end verification

**Files:** none (verification only). Requires `.env` with real Notion credentials (already present locally).

- [x] **Step 1: Start the dev server**

Run: `pnpm dev` (background).

- [x] **Step 2: Verify markdown negotiation on every page**

```bash
for path in / /about /blog /work /gears /blog/some-real-slug; do
  echo "== $path"
  curl -s -o /dev/null -D - -H "Accept: text/markdown" "http://localhost:3000$path" | grep -i -E "^HTTP|content-type|vary|x-markdown-tokens"
done
```

Expected: every path returns `200` with `content-type: text/markdown; charset=utf-8`, `vary: Accept`, and `x-markdown-tokens` on the five static pages. (Get a real slug from `curl -s http://localhost:3000/llms.txt`.)

- [x] **Step 3: Verify markdown content looks right**

Run: `curl -s -H "Accept: text/markdown" http://localhost:3000/ | head -30`
Expected: `# <name>` hero, `## Latest Projects`, `## Latest Posts` with valid links.

- [x] **Step 4: Verify HTML is unaffected**

```bash
curl -s -o /dev/null -D - -H "Accept: text/html" http://localhost:3000/ | grep -i -E "^HTTP|content-type|vary"
```

Expected: `200`, `content-type: text/html`, `vary: Accept` present.

- [x] **Step 5: Full check suite**

Run: `pnpm test && pnpm lint && pnpm type-check && pnpm build`
Expected: all pass (build needs the Notion credentials from `.env`).

- [x] **Step 6: Mark plan checkboxes done and commit any doc updates**

```bash
git add docs/superpowers/plans/2026-08-02-sitewide-markdown-negotiation.md
git commit -m "docs: check off markdown negotiation plan

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
