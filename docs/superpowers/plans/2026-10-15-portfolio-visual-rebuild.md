# Portfolio Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild nublson.com's look as a quiet, text-first design engineer portfolio (640px column, Inter + Newsreader, neutral tokens, icon project rows, one post-list style) without changing routes, data flow or features.

**Architecture:** Re-skin in place. Design tokens and the `Typography` scale change first, then the shared building blocks (`Header`, `Footer`, `SectionHeader`/`SectionWrapper`, `ProjectItem`, new `PostList`, `Hero`) are rewritten so every page picks them up. Two small data additions feed the UI: a Notion page `icon` on `PostMetadata` (served through the existing image proxy) and date helpers for the post lists.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (`@theme inline` tokens in `src/app/globals.css`), shadcn/Radix, `next/font/google`, `@remixicon/react`, Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-15-portfolio-visual-rebuild-design.md`
**Approved mockup:** https://claude.ai/artifact/PeTjoxQ2hoVqGzZLcxDWz3 (version 4)

## Global Constraints

- Column: `.wrapper` is `max-w-[672px] mx-auto px-4` (640px content + 16px gutters).
- Light tokens: background `#fafafa`, foreground `#171717`, body gray `#525252`, subtle gray `#a3a3a3`, hairline `#ebebeb`, tile `#f0f0f0` with `#e5e5e5` ring, hover fill `#f2f2f2`.
- Dark tokens: background `#111111`, foreground `#ededed`, body gray `#a1a1a1`, subtle gray `#707070`, hairline `#222222`, tile `#1a1a1a` with `#2a2a2a` ring, hover fill `#1a1a1a`.
- Tokens are written in oklch in `globals.css`; shadcn token names are kept; `--subtle-foreground` is new.
- Body/UI type: Inter, 14px / 22px, `font-feature-settings: "cv11", "ss01"`, tabular numerals on dates.
- Display type: Newsreader weight 500, only for the Home name, page titles (20px / 26px) and article titles (28px / 34px, 24px / 30px under `md`).
- Article body: 15px / 26px, max 64ch; in-body headings are sans, 15px, weight 600.
- Geist Sans is removed; Geist Mono stays for code.
- No accent color. Hovers animate `color`/`background-color` only, 150ms, `var(--ease-out)`. No scale except existing reaction press.
- Entrance: top-level page blocks fade in from `translateY(6px)` + `blur(2px)`, 500ms, `var(--ease-out)`, 60ms stagger, CSS only.
- `prefers-reduced-motion` disables entrance and transitions (existing global rule in `globals.css` stays).
- Routes, Notion queries/caching, `generateMetadata`, JSON-LD, RSS, OG images, markdown negotiation, agent files, reactions/views/audio APIs and the Purl flow do not change.
- The floating reactions pill (`src/components/post-reactions.tsx`) keeps its position and behavior; only tokens change it. Its placement is an open item for a later session.
- Content blocks stay Server Components; no client hooks are added to them.
- Package manager is `pnpm`. Tests: `pnpm vitest run <file>`; full gates: `pnpm lint`, `pnpm type-check`, `pnpm test`.
- Branch: `claude/portfolio-visual-rebuild-e0e863`, PR targets `develop`. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. A Notion publish date with a timezone offset (`2026-01-01T00:30:00.000+01:00`) must show the author's calendar day (`01/01`), not the visitor's (which could be `31/12`) — pinned in Task 2.
2. A post with no publish date must render (empty date, grouped under `—` on the archive) instead of crashing the Writing page — pinned in Task 2 and Task 7.
3. A Notion page whose icon is Notion's built-in `type: "icon"` (no URL) or is missing must fall back to the cover crop, then a monogram — pinned in Task 3 and Task 6.
4. Any link in Notion rich text to a profile domain with or without `www.` (e.g. `https://www.github.com/x`) must get the favicon; malformed URLs must not throw — pinned in Task 4.
5. Short lists showing an older post must include the year (`12/12/25`) so dates are never ambiguous around January — pinned in Task 2 and Task 7.

---

### Task 1: Tokens, fonts, global CSS and type scale

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/typography.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind color `subtle-foreground` (`text-subtle-foreground`), `font-heading` = Newsreader, `font-sans` = Inter, `font-mono` = Geist Mono; `.wrapper`, `.article-layout` (with entrance stagger), `.tile`, `.thumbnail`; `Typography` variants `h1` (article title), `h2` (page title/name), `h3` (in-body heading), `h4`, sizes `regular` (14px body gray), `article` (15px body gray), `small` (13px subtle), `xs`.

- [ ] **Step 1: Replace fonts in `src/app/layout.tsx`**

Replace the font imports and constants:

```tsx
import { Geist_Mono, Inter, Newsreader } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Change the `<html>` className to:

```tsx
className={`${inter.variable} ${newsreader.variable} ${geistMono.variable} h-full antialiased`}
```

Change the `<main>` className to (slug pages render the article, the reactions pill and "More posts" as siblings inside `<main>`, so `<main>` keeps a gap):

```tsx
className="flex-1 wrapper flex flex-col items-start justify-start gap-14 max-md:gap-12 outline-none"
```

- [ ] **Step 2: Update `@theme inline` font and color entries in `src/app/globals.css`**

In the `@theme inline` block replace the three font lines with:

```css
  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-newsreader);
```

and add, next to `--color-muted-foreground`:

```css
  --color-subtle-foreground: var(--subtle-foreground);
```

- [ ] **Step 3: Replace the `:root` and `.dark` color values in `src/app/globals.css`**

Keep `--ease-out`, `--radius` and the chart/sidebar tokens as they are. Set these tokens (add `--subtle-foreground`):

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --background: oklch(0.985 0 0);          /* #fafafa */
  --foreground: oklch(0.205 0 0);          /* #171717 */
  --card: oklch(0.955 0 0);                /* tile #f0f0f0 */
  --card-foreground: oklch(0.205 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.205 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.961 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.961 0 0);               /* hover fill #f2f2f2 */
  --muted-foreground: oklch(0.439 0 0);    /* body gray #525252 */
  --subtle-foreground: oklch(0.708 0 0);   /* labels, dates #a3a3a3 */
  --accent: oklch(0.961 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.94 0 0);               /* hairline #ebebeb */
  --input: oklch(0.922 0 0);               /* tile ring #e5e5e5 */
  --ring: oklch(0.708 0 0);
  /* chart, radius and sidebar tokens unchanged */
}

.dark {
  --background: oklch(0.178 0 0);          /* #111111 */
  --foreground: oklch(0.946 0 0);          /* #ededed */
  --card: oklch(0.218 0 0);                /* #1a1a1a */
  --card-foreground: oklch(0.946 0 0);
  --popover: oklch(0.218 0 0);
  --popover-foreground: oklch(0.946 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.218 0 0);
  --secondary-foreground: oklch(0.946 0 0);
  --muted: oklch(0.218 0 0);
  --muted-foreground: oklch(0.7 0 0);      /* #a1a1a1 */
  --subtle-foreground: oklch(0.553 0 0);   /* #707070 */
  --accent: oklch(0.218 0 0);
  --accent-foreground: oklch(0.946 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(0.248 0 0);              /* #222222 */
  --input: oklch(0.27 0 0);                /* #2a2a2a */
  --ring: oklch(0.553 0 0);
  /* chart and sidebar tokens unchanged */
}
```

- [ ] **Step 4: Update base styles and utilities in `src/app/globals.css`**

Replace the `body { font-family: var(--font-sans); }` rule with:

```css
body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.006em;
  font-feature-settings: "cv11", "ss01";
}
```

Replace `.wrapper`, `.thumbnail`, `.list-content`, `.link` and `.article-layout` with:

```css
.wrapper {
  @apply w-full max-w-[672px] mx-auto px-4;
}

.thumbnail {
  @apply w-full h-auto object-cover rounded-[10px];
}

.list-content {
  @apply w-full pl-5 [&>li]:mt-1.5;
}

.link {
  @apply text-subtle-foreground transition-colors duration-150 ease-(--ease-out) hover:text-foreground;
}

/* Small square tile for project icons. */
.tile {
  @apply grid size-5 shrink-0 place-items-center overflow-hidden rounded-[5px] bg-card shadow-[inset_0_0_0_1px_var(--input)];
}

.article-layout {
  @apply w-full flex flex-col items-start justify-start gap-14 max-md:gap-12;
}

/* Entrance: top-level page blocks rise in, 60ms apart. CSS only, so it runs without JS. */
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(6px);
    filter: blur(2px);
  }
}

.article-layout > * {
  animation: page-enter 500ms var(--ease-out) both;
}
.article-layout > :nth-child(2) { animation-delay: 60ms; }
.article-layout > :nth-child(3) { animation-delay: 120ms; }
.article-layout > :nth-child(4) { animation-delay: 180ms; }
.article-layout > :nth-child(5) { animation-delay: 240ms; }
.article-layout > :nth-child(n + 6) { animation-delay: 300ms; }
```

- [ ] **Step 5: Rewrite the variants in `src/components/typography.tsx`**

Replace the `typographyVariants` definition and add `"article"` to `TypographySize`:

```tsx
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "font-heading text-2xl leading-[30px] md:text-[28px] md:leading-[34px] font-medium tracking-[-0.015em] text-foreground text-balance",
      h2: "font-heading text-xl leading-[26px] font-medium tracking-[-0.01em] text-foreground text-balance",
      h3: "text-[15px] leading-[26px] font-semibold tracking-[-0.01em] text-foreground",
      h4: "text-sm leading-[22px] font-semibold text-foreground",
    },
    size: {
      regular: "text-sm leading-[22px] text-muted-foreground",
      article: "text-[15px] leading-[26px] text-muted-foreground",
      small: "text-[13px] leading-5 text-subtle-foreground",
      xs: "text-xs leading-4 text-subtle-foreground",
    },
  },
});
```

```tsx
type TypographySize = "regular" | "article" | "small" | "xs";
```

- [ ] **Step 6: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: all pass (no behavior changed; the type scale is consumed in later tasks).

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/typography.tsx
git commit -m "feat: add rebuild design tokens, fonts and type scale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Post date helpers and year grouping

**Files:**
- Modify: `src/utils/formatter.ts`
- Test: `src/utils/formatter.test.ts`

**Interfaces:**
- Consumes: `PostMetadata` (existing).
- Produces:
  - `formatPostDayMonth(date: string): string` → `"25/06"`, `""` when unparseable.
  - `formatPostDateCompact(date: string, currentYear?: number): string` → `"25/06"` in `currentYear`, `"12/12/25"` otherwise, `""` when unparseable. `currentYear` defaults to `new Date().getFullYear()`.
  - `type PostYearGroup = { year: string; posts: PostMetadata[] }`
  - `groupPostsByYear(posts: PostMetadata[]): PostYearGroup[]` — keeps input order, groups by the date string's year, undated posts under `year: ""`.

- [ ] **Step 1: Write the failing tests** (append to `src/utils/formatter.test.ts`, and add the three new names to its import list)

```ts
describe("formatPostDayMonth", () => {
  it("formats a plain date as dd/mm", () => {
    expect(formatPostDayMonth("2026-06-25")).toBe("25/06");
  });

  it("uses the calendar day written in the Notion string, ignoring timezone", () => {
    expect(formatPostDayMonth("2026-01-01T00:30:00.000+01:00")).toBe("01/01");
  });

  it("returns an empty string for an empty or invalid date", () => {
    expect(formatPostDayMonth("")).toBe("");
    expect(formatPostDayMonth("not a date")).toBe("");
  });
});

describe("formatPostDateCompact", () => {
  it("omits the year for the current year", () => {
    expect(formatPostDateCompact("2026-06-25T15:20:00.000+01:00", 2026)).toBe(
      "25/06",
    );
  });

  it("adds a two-digit year for other years", () => {
    expect(formatPostDateCompact("2025-12-12", 2026)).toBe("12/12/25");
  });

  it("returns an empty string for an empty date", () => {
    expect(formatPostDateCompact("", 2026)).toBe("");
  });
});

describe("groupPostsByYear", () => {
  const post = (id: string, published_date: string) =>
    ({ id, published_date }) as unknown as Parameters<
      typeof groupPostsByYear
    >[0][number];

  it("groups posts by year and keeps input order", () => {
    const groups = groupPostsByYear([
      post("a", "2026-06-25"),
      post("b", "2026-05-28"),
      post("c", "2025-12-12"),
    ]);
    expect(groups.map((g) => g.year)).toEqual(["2026", "2025"]);
    expect(groups[0].posts.map((p) => p.id)).toEqual(["a", "b"]);
    expect(groups[1].posts.map((p) => p.id)).toEqual(["c"]);
  });

  it("puts undated posts in a group with an empty year", () => {
    const groups = groupPostsByYear([post("a", "2026-06-25"), post("b", "")]);
    expect(groups.map((g) => g.year)).toEqual(["2026", ""]);
  });

  it("returns no groups for no posts", () => {
    expect(groupPostsByYear([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/formatter.test.ts`
Expected: FAIL, the three functions are not exported.

- [ ] **Step 3: Implement** (add to `src/utils/formatter.ts`, after `formatPostDateFull`)

```ts
/**
 * Calendar date parts read straight from the Notion string, so the
 * visitor's timezone can never move a post to another day.
 */
function notionDateParts(
  date: string,
): { year: string; month: string; day: string } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  return match ? { year: match[1], month: match[2], day: match[3] } : null;
}

/** e.g. "25/06" — archive rows, where the year is shown in its own column */
export const formatPostDayMonth = (date: string): string => {
  const parts = notionDateParts(date);
  return parts ? `${parts.day}/${parts.month}` : "";
};

/** e.g. "25/06" this year, "12/12/25" otherwise — short post lists */
export const formatPostDateCompact = (
  date: string,
  currentYear: number = new Date().getFullYear(),
): string => {
  const parts = notionDateParts(date);
  if (!parts) return "";
  const dayMonth = `${parts.day}/${parts.month}`;
  return Number(parts.year) === currentYear
    ? dayMonth
    : `${dayMonth}/${parts.year.slice(2)}`;
};

export type PostYearGroup = { year: string; posts: PostMetadata[] };

/** Groups already-sorted posts by publish year; undated posts get `year: ""`. */
export function groupPostsByYear(posts: PostMetadata[]): PostYearGroup[] {
  const groups: PostYearGroup[] = [];
  for (const post of posts) {
    const year = notionDateParts(post.published_date)?.year ?? "";
    const group = groups.find((g) => g.year === year);
    if (group) group.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/utils/formatter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/formatter.ts src/utils/formatter.test.ts
git commit -m "feat: add compact post date helpers and year grouping

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Notion page icon on post metadata

**Files:**
- Modify: `src/lib/notion-image.ts`
- Modify: `src/lib/notion-image.test.ts`
- Modify: `src/utils/formatter.ts`
- Modify: `src/utils/formatter.test.ts`
- Modify: `src/services/notion.tsx:377-402` (`resolveNotionImageUpstream`)

**Interfaces:**
- Consumes: `buildNotionImageProxyUrl` (existing).
- Produces:
  - `NotionImageResource = "cover" | "block" | "icon"`.
  - `type PostIcon = { type: "emoji"; value: string } | { type: "image"; src: string }` exported from `src/utils/formatter.ts`.
  - `formatPageIcon(page: PageObjectResponse): PostIcon | undefined`.
  - `PostMetadata.icon?: PostIcon`, filled by `formatPostMetadata`.
  - `/api/notion-image?resource=icon&id=<pageId>` resolves a page's uploaded icon.

- [ ] **Step 1: Write the failing tests**

In `src/lib/notion-image.test.ts`, replace the `isNotionImageResource` describe block:

```ts
describe("isNotionImageResource", () => {
  it("accepts cover, block and icon only", () => {
    expect(isNotionImageResource("cover")).toBe(true);
    expect(isNotionImageResource("block")).toBe(true);
    expect(isNotionImageResource("icon")).toBe(true);
    expect(isNotionImageResource("file")).toBe(false);
  });
});
```

Append to `src/utils/formatter.test.ts` (add `formatPageIcon` to its imports):

```ts
describe("formatPageIcon", () => {
  it("returns an emoji icon", () => {
    expect(
      formatPageIcon(makePage({ icon: { type: "emoji", emoji: "🪶" } })),
    ).toEqual({ type: "emoji", value: "🪶" });
  });

  it("uses external icon URLs directly", () => {
    expect(
      formatPageIcon(
        makePage({
          icon: { type: "external", external: { url: "https://x.dev/i.png" } },
        }),
      ),
    ).toEqual({ type: "image", src: "https://x.dev/i.png" });
  });

  it("proxies uploaded file icons because Notion file URLs expire", () => {
    expect(
      formatPageIcon(
        makePage({
          icon: { type: "file", file: { url: "https://s3/x", expiry_time: "" } },
        }),
      ),
    ).toEqual({
      type: "image",
      src: "/api/notion-image?resource=icon&id=page-1&v=2024-09-19T12%3A00%3A00.000Z",
    });
  });

  it("proxies custom emoji icons", () => {
    expect(
      formatPageIcon(
        makePage({
          icon: {
            type: "custom_emoji",
            custom_emoji: { id: "e", name: "purl", url: "https://s3/e.png" },
          },
        }),
      )?.type,
    ).toBe("image");
  });

  it("returns undefined for Notion built-in icons and missing icons", () => {
    expect(
      formatPageIcon(
        makePage({ icon: { type: "icon", icon: { name: "x", color: "gray" } } }),
      ),
    ).toBeUndefined();
    expect(formatPageIcon(makePage({ icon: null }))).toBeUndefined();
  });

  it("is included in formatPostMetadata", () => {
    const [post] = formatPostMetadata([
      makePage({ icon: { type: "emoji", emoji: "🪶" } }),
    ]);
    expect(post.icon).toEqual({ type: "emoji", value: "🪶" });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/lib/notion-image.test.ts src/utils/formatter.test.ts`
Expected: FAIL (`icon` is not a resource; `formatPageIcon` is not exported).

- [ ] **Step 3: Implement the proxy resource** in `src/lib/notion-image.ts`

```ts
export type NotionImageResource = "cover" | "block" | "icon";
```

```ts
export function isNotionImageResource(
  value: string,
): value is NotionImageResource {
  return value === "cover" || value === "block" || value === "icon";
}
```

- [ ] **Step 4: Implement `formatPageIcon`** in `src/utils/formatter.ts`

Add after `formatCoverThumbnail`:

```ts
export type PostIcon =
  | { type: "emoji"; value: string }
  | { type: "image"; src: string };

/** Notion page icon. Uploaded files and custom emoji go through the proxy because their URLs expire. */
export function formatPageIcon(page: PageObjectResponse): PostIcon | undefined {
  const icon = page.icon;
  if (!icon) return undefined;
  switch (icon.type) {
    case "emoji":
      return { type: "emoji", value: icon.emoji };
    case "external":
      return { type: "image", src: icon.external.url };
    case "file":
    case "custom_emoji":
      return {
        type: "image",
        src: buildNotionImageProxyUrl({
          resource: "icon",
          id: page.id,
          v: page.last_edited_time,
        }),
      };
    default:
      return undefined;
  }
}
```

Add `icon?: PostIcon;` to the `PostMetadata` type (after `blurDataURL`), and `icon: formatPageIcon(page),` to the object returned in `formatPostMetadata` (after `thumbnail,`).

- [ ] **Step 5: Resolve icons in the proxy** — in `src/services/notion.tsx`, inside `resolveNotionImageUpstream`, add before the `const block = ...` line:

```ts
  if (resource === "icon") {
    const page = await api.pages.retrieve({ page_id: id });
    if (!isFullPage(page) || !page.icon) {
      throw new Error(`Icon not found for page ${id}`);
    }
    switch (page.icon.type) {
      case "file":
        return { url: page.icon.file.url };
      case "external":
        return { url: page.icon.external.url };
      case "custom_emoji":
        return { url: page.icon.custom_emoji.url };
      default:
        throw new Error(`Icon for page ${id} has no image`);
    }
  }
```

- [ ] **Step 6: Run tests and type-check**

Run: `pnpm vitest run src/lib/notion-image.test.ts src/utils/formatter.test.ts && pnpm type-check`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/notion-image.ts src/lib/notion-image.test.ts src/utils/formatter.ts src/utils/formatter.test.ts src/services/notion.tsx
git commit -m "feat: read Notion page icons into post metadata

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Social profiles and favicon links

**Files:**
- Create: `src/utils/social-profiles.ts`
- Create: `src/utils/social-profiles.test.ts`
- Create: `src/components/favicon-link.tsx`
- Create: `src/components/favicon-link.test.tsx`
- Modify: `src/components/content-blocks/rich-text.tsx` (`renderRichTextNode`)

**Interfaces:**
- Consumes: `src/data/social.json` (`media: { label, icon, url }[]`).
- Produces:
  - `type SocialProfile = { label: string; url: string }`
  - `socialProfiles: SocialProfile[]`
  - `findSocialProfile(url: string): SocialProfile | null` (matches hostname, ignores `www.`)
  - `socialHandle(url: string): string` (`"@nublson"`)
  - `<SocialIcon label className? />`, `<FaviconLink href label children? className? ...anchorProps />`

- [ ] **Step 1: Write the failing tests**

`src/utils/social-profiles.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  findSocialProfile,
  socialHandle,
  socialProfiles,
} from "./social-profiles";

describe("findSocialProfile", () => {
  it("matches a profile by hostname", () => {
    expect(findSocialProfile("https://github.com/nublson/purl")?.label).toBe(
      "GitHub",
    );
  });

  it("ignores www. and letter case", () => {
    expect(findSocialProfile("https://WWW.GitHub.com/x")?.label).toBe("GitHub");
    expect(findSocialProfile("https://youtube.com/@nublson")?.label).toBe(
      "YouTube",
    );
  });

  it("returns null for unknown or malformed URLs", () => {
    expect(findSocialProfile("https://example.com")).toBeNull();
    expect(findSocialProfile("not a url")).toBeNull();
  });
});

describe("socialHandle", () => {
  it("returns the last path segment as an @handle", () => {
    expect(socialHandle("https://www.youtube.com/@nublson")).toBe("@nublson");
    expect(socialHandle("https://github.com/nublson")).toBe("@nublson");
  });
});

describe("socialProfiles", () => {
  it("lists every profile from social.json", () => {
    expect(socialProfiles.map((p) => p.label)).toEqual([
      "Instagram",
      "YouTube",
      "GitHub",
    ]);
  });
});
```

`src/components/favicon-link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRichTextNode } from "./content-blocks/rich-text";
import { FaviconLink } from "./favicon-link";

describe("FaviconLink", () => {
  it("renders the icon before the label and opens in a new tab", () => {
    render(<FaviconLink href="https://github.com/nublson" label="GitHub" />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.querySelector("svg")).not.toBeNull();
  });
});

describe("renderRichTextNode favicons", () => {
  it("adds a favicon to links that point at a known profile", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "my code",
          href: "https://github.com/nublson",
        })}
      </p>,
    );
    expect(
      screen.getByRole("link", { name: /my code/ }).querySelector("svg"),
    ).not.toBeNull();
  });

  it("keeps plain underlined links for other domains", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "docs",
          href: "https://example.com",
        })}
      </p>,
    );
    const link = screen.getByRole("link", { name: "docs" });
    expect(link.querySelector("svg")).toBeNull();
    expect(link.className).toContain("underline");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/utils/social-profiles.test.ts src/components/favicon-link.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `src/utils/social-profiles.ts`**

```ts
import social from "@/data/social.json";

export type SocialProfile = { label: string; url: string };

export const socialProfiles: SocialProfile[] = social.media.map(
  ({ label, url }) => ({ label, url }),
);

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** The profile whose domain matches `url`, so any link to it can show its favicon. */
export function findSocialProfile(url: string): SocialProfile | null {
  const host = hostOf(url);
  if (!host) return null;
  return socialProfiles.find((profile) => hostOf(profile.url) === host) ?? null;
}

/** "@nublson" from a profile URL. */
export function socialHandle(url: string): string {
  const segment = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
  return `@${segment.replace(/^@/, "")}`;
}
```

- [ ] **Step 4: Implement `src/components/favicon-link.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { RiGithubFill, RiInstagramLine, RiYoutubeFill } from "@remixicon/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type IconComponent = typeof RiGithubFill;

const SOCIAL_ICONS: Record<string, { Icon: IconComponent; className: string }> =
  {
    GitHub: { Icon: RiGithubFill, className: "text-foreground" },
    YouTube: { Icon: RiYoutubeFill, className: "text-[#ff0033]" },
    Instagram: { Icon: RiInstagramLine, className: "text-[#e1306c]" },
  };

export function SocialIcon({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const entry = SOCIAL_ICONS[label];
  if (!entry) return null;
  return (
    <entry.Icon
      aria-hidden
      className={cn(
        "inline-block size-[13px] shrink-0 align-[-2px]",
        entry.className,
        className,
      )}
    />
  );
}

type FaviconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  label: string;
  children?: ReactNode;
};

/** External profile link shown as "[favicon] Label". */
export function FaviconLink({
  href,
  label,
  children,
  className,
  ...props
}: FaviconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={cn(
        "font-medium whitespace-nowrap text-foreground transition-opacity duration-150 ease-(--ease-out) hover:opacity-70",
        className,
      )}
    >
      <SocialIcon label={label} className="mr-[5px]" />
      {children ?? label}
    </a>
  );
}
```

- [ ] **Step 5: Use favicon links in rich text** — in `src/components/content-blocks/rich-text.tsx` add imports:

```tsx
import { FaviconLink } from "@/components/favicon-link";
import { findSocialProfile } from "@/utils/social-profiles";
```

In `renderRichTextNode`, replace the final `return ( <a ...> ... </a> );` with:

```tsx
  const profile = findSocialProfile(link);
  if (profile) {
    return (
      <FaviconLink
        key={key}
        href={link}
        label={profile.label}
        target={resolvedLinkAttributes?.target ?? "_blank"}
        rel={resolvedLinkAttributes?.rel ?? "noopener noreferrer"}
      >
        {styledText}
      </FaviconLink>
    );
  }

  return (
    <a
      key={key}
      href={link}
      className="text-foreground underline decoration-input underline-offset-[3px] transition-colors duration-150 ease-(--ease-out) hover:decoration-foreground"
      target={resolvedLinkAttributes?.target ?? "_blank"}
      rel={resolvedLinkAttributes?.rel}
      aria-label={rawText}
    >
      {styledText}
    </a>
  );
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm vitest run src/utils/social-profiles.test.ts src/components/favicon-link.test.tsx && pnpm type-check`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/utils/social-profiles.ts src/utils/social-profiles.test.ts src/components/favicon-link.tsx src/components/favicon-link.test.tsx src/components/content-blocks/rich-text.tsx
git commit -m "feat: show favicons on links to social profiles

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Header, footer and section primitives

**Files:**
- Modify: `src/components/header.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/components/navigation-list.tsx`
- Modify: `src/data/navigation.json`
- Modify: `src/components/section-header.tsx`
- Modify: `src/components/section-wrapper.tsx`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: `SectionWrapper({ title, path?, id, children, className? })` renders a muted label row ("Title" left, "All" right when `path`) above `children`, gap 14px. Later tasks put lists inside it.

- [ ] **Step 1: Header** — replace the JSX in `src/components/header.tsx`:

```tsx
    <header className="wrapper flex items-center justify-between gap-4 pt-8 pb-14 max-md:pt-6 max-md:pb-12">
      <Link href="/" aria-label="Go to homepage" className="shrink-0 rounded-sm">
        <Image
          src="/logo.svg"
          alt=""
          width={24}
          height={24}
          className="dark:invert"
          loading="eager"
        />
      </Link>

      <ThemeToggle />
    </header>
```

- [ ] **Step 2: Theme toggle size** — in `src/components/theme-toggle.tsx`, on both `<Button>` elements change `size="icon"` to `size="icon-sm"` and add `text-subtle-foreground hover:text-foreground` to their `className` (the mounted one becomes `"relative cursor-pointer text-subtle-foreground hover:text-foreground"`). Change the `icon` constant's `size-4` to `size-[15px]`.

- [ ] **Step 3: Footer and navigation**

`src/data/navigation.json` footer gains RSS:

```json
{
  "header": [],
  "footer": [
    { "label": "About", "path": "/about" },
    { "label": "Gears", "path": "/gears" },
    { "label": "Agents", "path": "/agents.txt" },
    { "label": "RSS", "path": "/feed.xml" }
  ]
}
```

`src/components/footer.tsx` body:

```tsx
import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper mt-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-10 text-sm text-subtle-foreground">
      <span>© {currentYear} Nubelson Fernandes</span>
      <nav aria-label="Footer navigation">
        <NavigationList items={navigation.footer} />
      </nav>
    </footer>
  );
};
```

In `src/components/navigation-list.tsx`, change the `<ul>` class to `"flex flex-wrap items-center gap-4"` and replace the `<Typography ...>` wrapper with a plain `<li>` (remove the `Typography` import):

```tsx
          <li
            key={item.label}
            className={cn(
              "text-sm text-subtle-foreground transition-colors duration-150 ease-(--ease-out) hover:text-foreground",
              isActive && "text-foreground",
              className,
            )}
          >
            {content}
          </li>
```

- [ ] **Step 4: Section header and wrapper**

`src/components/section-header.tsx`:

```tsx
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  /** When set, labels this region for assistive tech (pairs with `section` `aria-labelledby`). */
  titleId?: string;
}

export function SectionHeader({ title, href, titleId }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-baseline justify-between gap-4">
      <h2 id={titleId} className="text-sm font-normal text-subtle-foreground">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          aria-label={`View all ${title}`}
          className="text-sm text-subtle-foreground transition-colors duration-150 ease-(--ease-out) hover:text-foreground"
        >
          All
        </Link>
      )}
    </div>
  );
}
```

In `src/components/section-wrapper.tsx`, change the section class to:

```tsx
        "flex w-full flex-col items-stretch justify-start gap-3.5",
```

- [ ] **Step 5: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/header.tsx src/components/theme-toggle.tsx src/components/footer.tsx src/components/navigation-list.tsx src/data/navigation.json src/components/section-header.tsx src/components/section-wrapper.tsx
git commit -m "feat: restyle header, footer and section labels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Project icon rows (Home, Projects, Gears)

**Files:**
- Create: `src/components/project-icon.tsx`
- Create: `src/components/project-icon.test.tsx`
- Modify: `src/components/project-item.tsx`
- Modify: `src/sections/projects.tsx`
- Modify: `src/sections/gears.tsx`
- Modify: `src/components/skeletons/projects-section-skeleton.tsx`
- Modify: `src/app/_components/home-projects.tsx`, `src/app/_components/work-projects.tsx`, `src/app/_components/gears-category.tsx`
- Modify: `src/app/(home)/page.tsx`, `src/app/projects/(index)/page.tsx`, `src/app/gears/(index)/page.tsx` (skeleton props)

**Interfaces:**
- Consumes: `PostMetadata.icon` (Task 3), `.tile` (Task 1), `SectionWrapper` (Task 5).
- Produces: `<ProjectIcon post className? />`, `<ProjectItem post />` row, `ProjectsSection({ title, href?, id, posts })`, `GearsSection({ title, href?, id, posts })`, `ProjectsSectionSkeleton({ rowCount?, showViewAll? })`.

- [ ] **Step 1: Write the failing test** `src/components/project-icon.test.tsx`

```tsx
import type { PostMetadata } from "@/utils/formatter";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectIcon } from "./project-icon";

const base = { id: "1", title: "Quiver" } as PostMetadata;

describe("ProjectIcon", () => {
  it("renders an emoji icon", () => {
    const { container } = render(
      <ProjectIcon post={{ ...base, icon: { type: "emoji", value: "🪶" } }} />,
    );
    expect(container.textContent).toBe("🪶");
  });

  it("renders an image icon", () => {
    const { container } = render(
      <ProjectIcon
        post={{ ...base, icon: { type: "image", src: "https://x.dev/i.png" } }}
      />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://x.dev/i.png",
    );
  });

  it("falls back to the cover thumbnail", () => {
    const { container } = render(
      <ProjectIcon post={{ ...base, thumbnail: "https://x.dev/cover.png" }} />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "https://x.dev/cover.png",
    );
  });

  it("falls back to a monogram when there is no icon or cover", () => {
    const { container } = render(<ProjectIcon post={base} />);
    expect(container.textContent).toBe("Q");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/project-icon.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `src/components/project-icon.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { PostMetadata } from "@/utils/formatter";
import Image from "next/image";

/** 20px tile: Notion page icon, else a crop of the cover, else the first letter. */
export function ProjectIcon({
  post,
  className,
}: {
  post: Pick<PostMetadata, "title" | "icon" | "thumbnail">;
  className?: string;
}) {
  if (post.icon?.type === "emoji") {
    return (
      <span aria-hidden className={cn("tile text-xs leading-none", className)}>
        {post.icon.value}
      </span>
    );
  }

  const src = post.icon?.type === "image" ? post.icon.src : post.thumbnail;
  if (src) {
    return (
      <span aria-hidden className={cn("tile", className)}>
        <Image
          src={src}
          alt=""
          width={40}
          height={40}
          unoptimized
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "tile text-[10px] font-medium text-subtle-foreground",
        className,
      )}
    >
      {post.title.charAt(0).toUpperCase()}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/project-icon.test.tsx`
Expected: PASS

- [ ] **Step 5: Rewrite `src/components/project-item.tsx`**

```tsx
import type { PostMetadata } from "@/utils/formatter";
import { ProjectIcon } from "./project-icon";

export function ProjectItem({ post }: { post: PostMetadata }) {
  return (
    <span className="group/row grid grid-cols-[20px_1fr] gap-x-3 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted">
      <ProjectIcon post={post} className="mt-px" />
      <span className="min-w-0 font-medium text-foreground">{post.title}</span>
      <span className="col-start-2 min-w-0 line-clamp-1 text-subtle-foreground transition-colors duration-150 ease-(--ease-out) group-hover/row:text-muted-foreground">
        {post.description}
      </span>
    </span>
  );
}
```

- [ ] **Step 6: Rewrite the sections**

`src/sections/projects.tsx`:

```tsx
import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";
import Link from "next/link";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
}

export default function ProjectsSection({
  title,
  href,
  id,
  posts,
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <ul className="-mx-2.5 flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/projects/${post.slug}`}
              className="block rounded-lg"
              aria-label={`${post.title} — view project`}
            >
              <ProjectItem post={post} />
            </Link>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
```

`src/sections/gears.tsx` — same shape, but each item is an external link:

```tsx
import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface GearsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
}

export default function GearsSection({
  title,
  href,
  id,
  posts,
}: GearsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <ul className="-mx-2.5 flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.id}>
            <a
              href={post.path}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg"
              aria-label={`${post.title} — view gear item`}
            >
              <ProjectItem post={post} />
            </a>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
```

- [ ] **Step 7: Update callers**

- `src/app/_components/home-projects.tsx`: remove the `className` prop from `<ProjectsSection>`.
- `src/app/_components/work-projects.tsx`: remove `className`; change `title="Projects"` to `title="All projects"`.
- `src/app/_components/gears-category.tsx`: remove `className` from `<GearsSection>`; change the wrapper class to `"w-full flex flex-col items-stretch justify-start gap-14"`.
- `src/app/projects/(index)/page.tsx`: remove the `<Separator className="w-full" />` inside the Suspense and its import.

- [ ] **Step 8: Rewrite `src/components/skeletons/projects-section-skeleton.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
}

export function ProjectsSectionSkeleton({
  rowCount = 3,
  showViewAll = false,
}: ProjectsSectionSkeletonProps) {
  return (
    <section aria-hidden className="flex w-full flex-col gap-3.5">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-16 rounded" />
        {showViewAll && <Skeleton className="h-4 w-6 rounded" />}
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-[20px_1fr] gap-x-3 py-2">
            <Skeleton className="size-5 rounded-[5px]" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="col-start-2 mt-1.5 h-4 w-[min(100%,320px)] rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

Update the three callers: `src/app/(home)/page.tsx` → `<ProjectsSectionSkeleton rowCount={3} showViewAll />`; `src/app/projects/(index)/page.tsx` → `<ProjectsSectionSkeleton rowCount={6} />`; `src/app/gears/(index)/page.tsx` → `<ProjectsSectionSkeleton rowCount={8} />`.

- [ ] **Step 9: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add -A src/components src/sections src/app
git commit -m "feat: show projects and gears as icon rows

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: One post list (Home, Writing archive, More posts)

**Files:**
- Create: `src/components/post-list.tsx`
- Create: `src/components/post-list.test.tsx`
- Delete: `src/components/post-item.tsx`
- Modify: `src/sections/posts.tsx`
- Modify: `src/app/_components/blog-posts.tsx`
- Modify: `src/components/skeletons/posts-section-skeleton.tsx`
- Modify: `src/app/writings/(index)/page.tsx`, `src/app/writings/[slug]/page.tsx` (skeleton props)

**Interfaces:**
- Consumes: `formatPostDayMonth`, `formatPostDateCompact`, `groupPostsByYear`, `formatDateTimeIso` (Task 2 / existing), `SectionWrapper` (Task 5).
- Produces: `<PostList posts groupByYear? currentYear? />`; `PostsSection({ title, href?, id, posts, groupByYear? })`; `PostsSectionSkeleton({ rowCount?, showViewAll?, groupByYear? })`.

- [ ] **Step 1: Write the failing test** `src/components/post-list.test.tsx`

```tsx
import type { PostMetadata } from "@/utils/formatter";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostList } from "./post-list";

const post = (id: string, title: string, published_date: string) =>
  ({ id, title, slug: id, published_date }) as PostMetadata;

const posts = [
  post("a", "Building in Public", "2026-06-25T15:20:00.000+01:00"),
  post("b", "Understanding AI", "2026-05-08"),
  post("c", "Older post", "2025-12-12"),
];

describe("PostList", () => {
  it("renders a flat list with compact dates and no year column", () => {
    render(<PostList posts={posts} currentYear={2026} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByText("25/06")).toBeInTheDocument();
    expect(screen.getByText("12/12/25")).toBeInTheDocument();
    expect(screen.queryByText("2026")).toBeNull();
  });

  it("groups by year with dd/mm dates on the archive", () => {
    render(<PostList posts={posts} groupByYear />);
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("12/12")).toBeInTheDocument();
  });

  it("links each row to its post", () => {
    render(<PostList posts={posts} />);
    expect(
      screen.getByRole("link", { name: "Building in Public — read post" }),
    ).toHaveAttribute("href", "/writings/a");
  });

  it("shows undated posts under a dash instead of crashing", () => {
    render(<PostList posts={[post("x", "Draft", "")]} groupByYear />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders nothing for no posts", () => {
    const { container } = render(<PostList posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/components/post-list.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `src/components/post-list.tsx`**

```tsx
import { cn } from "@/lib/utils";
import {
  formatDateTimeIso,
  formatPostDateCompact,
  formatPostDayMonth,
  groupPostsByYear,
  type PostMetadata,
} from "@/utils/formatter";
import Link from "next/link";

interface PostListProps {
  posts: PostMetadata[];
  /** Archive layout: a year column, `dd/mm` dates. Short lists leave it off. */
  groupByYear?: boolean;
  /** For tests; defaults to this year. */
  currentYear?: number;
}

function PostRows({
  posts,
  formatDate,
}: {
  posts: PostMetadata[];
  formatDate: (date: string) => string;
}) {
  return (
    <ul className="group/list min-w-0">
      {posts.map((post) => (
        <li
          key={post.id}
          className="border-t border-border first:border-t-0"
        >
          <Link
            href={`/writings/${post.slug}`}
            aria-label={`${post.title} — read post`}
            className="group/row flex items-baseline justify-between gap-4 py-2.5"
          >
            <span className="min-w-0 text-foreground transition-colors duration-150 ease-(--ease-out) group-hover/list:text-subtle-foreground group-hover/row:text-foreground!">
              {post.title}
            </span>
            <time
              dateTime={formatDateTimeIso(post.published_date)}
              className="shrink-0 text-subtle-foreground tabular-nums"
            >
              {formatDate(post.published_date)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PostList({ posts, groupByYear = false, currentYear }: PostListProps) {
  if (posts.length === 0) return null;

  if (!groupByYear) {
    return (
      <div className="w-full border-y border-border">
        <PostRows
          posts={posts}
          formatDate={(date) => formatPostDateCompact(date, currentYear)}
        />
      </div>
    );
  }

  return (
    <div className="w-full border-y border-border">
      {groupPostsByYear(posts).map((group, index) => (
        <div
          key={group.year || "undated"}
          className={cn(
            "grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr]",
            index > 0 && "border-t border-border",
          )}
        >
          <span className="py-2.5 text-subtle-foreground tabular-nums">
            {group.year || "—"}
          </span>
          <PostRows posts={group.posts} formatDate={formatPostDayMonth} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/components/post-list.test.tsx`
Expected: PASS

- [ ] **Step 5: Wire it in**

`src/sections/posts.tsx`:

```tsx
import { PostList } from "@/components/post-list";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface PostsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
  groupByYear?: boolean;
}

export default function PostsSection({
  title,
  href,
  id,
  posts,
  groupByYear = false,
}: PostsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <PostList posts={posts} groupByYear={groupByYear} />
    </SectionWrapper>
  );
}
```

`src/app/_components/blog-posts.tsx`: render `<PostsSection title="All posts" id="writing" posts={blogPostMetadata} groupByYear />`.
`src/app/_components/more-posts.tsx`: change `title="More Posts"` to `title="More posts"` and add `href="/writings"`.
Delete `src/components/post-item.tsx` (`git rm`). Confirm nothing imports it: `grep -rn "post-item" src` → no output.

- [ ] **Step 6: Rewrite `src/components/skeletons/posts-section-skeleton.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton";

interface PostsSectionSkeletonProps {
  rowCount?: number;
  showViewAll?: boolean;
  groupByYear?: boolean;
}

export function PostsSectionSkeleton({
  rowCount = 4,
  showViewAll = false,
  groupByYear = false,
}: PostsSectionSkeletonProps) {
  return (
    <section aria-hidden className="flex w-full flex-col gap-3.5">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-16 rounded" />
        {showViewAll && <Skeleton className="h-4 w-6 rounded" />}
      </div>
      <div className="w-full divide-y divide-border border-y border-border">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3">
            {groupByYear && (
              <Skeleton
                className={i === 0 ? "h-4 w-9 rounded" : "h-4 w-9 opacity-0"}
              />
            )}
            <Skeleton className="h-4 flex-1 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

Update callers: `src/app/writings/(index)/page.tsx` → `<PostsSectionSkeleton rowCount={6} groupByYear />`; `src/app/writings/[slug]/page.tsx` → `<PostsSectionSkeleton rowCount={3} showViewAll />`. `src/app/(home)/page.tsx` keeps `rowCount={4} showViewAll`.

- [ ] **Step 7: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add -A src/components src/sections src/app
git commit -m "feat: use one post list style with a year column on the archive

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Page heroes, social links and About "Elsewhere"

**Files:**
- Modify: `src/sections/hero.tsx`
- Delete: `src/components/heading-page.tsx`
- Create: `src/components/social-links.tsx`
- Modify: `src/app/_components/home-hero.tsx`, `about-hero.tsx`, `blog-hero.tsx`, `gears-hero.tsx`, `work-hero.tsx`
- Modify: `src/app/about/page.tsx`, `src/app/gears/(index)/page.tsx`, `src/app/writings/(index)/page.tsx`
- Modify: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `Typography` `h1`/`h2`/`regular`/`article` (Task 1), `FaviconLink`, `SocialIcon` (Task 4), `socialProfiles`, `socialHandle` (Task 4), `SectionWrapper` (Task 5).
- Produces: `Hero({ title, description?, thumbnail?, blurDataURL?, top?, bottom?, children?, variant?: "page" | "article" })` — `"page"` (default) is a 20px serif title, no cover; `"article"` is a 28px serif title with lede and cover. `<SocialLinks />` ("Find me on [GitHub], …"). `<ElsewhereList />`.

- [ ] **Step 1: Rewrite `src/sections/hero.tsx`**

```tsx
import { CoverImage } from "@/components/cover-image";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  description?: string;
  thumbnail?: string;
  blurDataURL?: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "page" | "article";
}

export default function HeroSection({
  title,
  description,
  thumbnail,
  blurDataURL,
  top,
  bottom,
  children,
  variant = "page",
}: HeroSectionProps) {
  const isArticle = variant === "article";

  return (
    <header className={cn("flex w-full flex-col", isArticle ? "gap-8" : "gap-5")}>
      {top}
      <div className={cn("flex flex-col", isArticle ? "gap-3" : "gap-0")}>
        <Typography
          component="h1"
          variant={isArticle ? "h1" : "h2"}
          className="break-words"
        >
          {title}
        </Typography>
        {bottom}
      </div>
      {description && (
        <Typography
          size={isArticle ? "article" : "regular"}
          className="max-w-[60ch]"
        >
          {description}
        </Typography>
      )}
      {children}
      {isArticle && thumbnail && (
        <div className="relative w-full overflow-hidden rounded-[10px] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:shadow-[inset_0_0_0_1px_var(--input)]">
          <CoverImage
            src={thumbnail}
            alt=""
            blurDataURL={blurDataURL}
            priority
            sizes="(max-width: 672px) 100vw, 640px"
            className="aspect-video"
          />
        </div>
      )}
    </header>
  );
}
```

Delete `src/components/heading-page.tsx` (`git rm`); `grep -rn "heading-page" src` → no output.

- [ ] **Step 2: Create `src/components/social-links.tsx`**

```tsx
import { SectionWrapper } from "@/components/section-wrapper";
import { socialHandle, socialProfiles } from "@/utils/social-profiles";
import { Fragment } from "react";
import { FaviconLink, SocialIcon } from "./favicon-link";
import { Typography } from "./typography";

/** "Find me on [GitHub], [YouTube] and [Instagram]." */
export function SocialLinks() {
  const last = socialProfiles.length - 1;
  return (
    <Typography className="max-w-[60ch]">
      Find me on{" "}
      {socialProfiles.map((profile, i) => (
        <Fragment key={profile.label}>
          {i > 0 && (i === last ? " and " : ", ")}
          <FaviconLink href={profile.url} label={profile.label} />
        </Fragment>
      ))}
      .
    </Typography>
  );
}

export function ElsewhereList() {
  return (
    <SectionWrapper title="Elsewhere" id="elsewhere">
      <ul className="-mx-2.5 flex flex-col gap-1">
        {socialProfiles.map((profile) => (
          <li key={profile.label}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline justify-between gap-4 rounded-lg px-2.5 py-2 transition-colors duration-150 ease-(--ease-out) hover:bg-muted"
            >
              <span className="flex items-center gap-2 text-foreground">
                <SocialIcon label={profile.label} />
                {profile.label}
              </span>
              <span className="text-subtle-foreground">
                {socialHandle(profile.url)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
```

- [ ] **Step 3: Home hero** — in `src/app/_components/home-hero.tsx` replace the `<Hero ... />` element (keep the JSON-LD) with:

```tsx
      <Hero
        title={metadata.title}
        description={metadata.description}
        bottom={
          <Typography className="text-subtle-foreground">
            {[metadata.role, metadata.location].filter(Boolean).join(" · ")}
          </Typography>
        }
      >
        <SocialLinks />
      </Hero>
```

Add `import { SocialLinks } from "@/components/social-links";`.

- [ ] **Step 4: Index heroes** — remove `size="small"`, `thumbnail` and `blurDataURL` props from `about-hero.tsx`, `blog-hero.tsx`, `gears-hero.tsx`, and `size="small"` from `work-hero.tsx`. In `src/app/about/page.tsx`, `src/app/gears/(index)/page.tsx` and `src/app/writings/(index)/page.tsx`, replace `await withThumbnailBlur(formatPageMetadata(page))` with `formatPageMetadata(page)` and drop the unused `withThumbnailBlur` import.

- [ ] **Step 5: About "Elsewhere"** — in `src/app/about/page.tsx` render `<ElsewhereList />` after `<AboutContent blocks={pageBlocks} />` and import it from `@/components/social-links`.

- [ ] **Step 6: 404** — `src/app/not-found.tsx`:

```tsx
import page from "@/data/page.json";
import Hero from "@/sections/hero";
import Link from "next/link";

export default function NotFound() {
  const { title, description } = page.notFound;

  return (
    <section className="article-layout">
      <Hero title={title} description={description}>
        <p className="flex gap-4">
          <Link href="/" className="font-medium text-foreground hover:opacity-70 transition-opacity duration-150">
            Go to homepage
          </Link>
          <Link href="/writings" className="link">
            Browse writing
          </Link>
        </p>
      </Hero>
    </section>
  );
}
```

- [ ] **Step 7: Keep article heroes compiling** — `Hero` no longer has a `size` prop. In `src/app/writings/[slug]/_components/blog-post-hero.tsx` and `src/app/projects/[slug]/_components/work-post-hero.tsx` replace `size="small"` with `variant="article"` (Task 9 rewrites both files fully).

- [ ] **Step 8: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A src
git commit -m "feat: rebuild page heroes with serif titles and social links

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Article and project headers

**Files:**
- Create: `src/components/article-header-parts.tsx`
- Delete: `src/components/heading-top.tsx`
- Modify: `src/app/writings/[slug]/_components/blog-post-hero.tsx`
- Modify: `src/app/projects/[slug]/_components/work-post-hero.tsx`

**Interfaces:**
- Consumes: `Hero` `variant="article"` (Task 8), `formatPostDateFull`, `formatDateTimeIso` (existing).
- Produces: `<BackLink href label />`, `<ArticleMeta date dateTime category? />`.

- [ ] **Step 1: Create `src/components/article-header-parts.tsx`**

```tsx
import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="link inline-flex w-fit items-center gap-1.5">
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function ArticleMeta({
  date,
  dateTime,
  category,
}: {
  date: string;
  dateTime: string;
  category?: string;
}) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-subtle-foreground tabular-nums">
      <time dateTime={dateTime}>{date}</time>
      {category && (
        <>
          <span aria-hidden className="opacity-60">
            ·
          </span>
          <span>{category}</span>
        </>
      )}
    </p>
  );
}
```

- [ ] **Step 2: Blog post hero** — `src/app/writings/[slug]/_components/blog-post-hero.tsx`:

```tsx
import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";

export function BlogPostHero({ metadata }: { metadata: PostMetadata }) {
  return (
    <Hero
      variant="article"
      top={<BackLink href="/writings" label="Writing" />}
      title={metadata.title}
      bottom={
        <ArticleMeta
          date={formatPostDateFull(metadata.published_date)}
          dateTime={formatDateTimeIso(metadata.published_date)}
          category={metadata.category}
        />
      }
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
```

- [ ] **Step 3: Project hero** — `src/app/projects/[slug]/_components/work-post-hero.tsx`:

```tsx
import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";
import { Code, ExternalLink } from "lucide-react";

export function WorkPostHero({ metadata }: { metadata: PostMetadata }) {
  return (
    <Hero
      variant="article"
      top={<BackLink href="/projects" label="Projects" />}
      title={metadata.title}
      bottom={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <ArticleMeta
            date={formatPostDateFull(metadata.published_date)}
            dateTime={formatDateTimeIso(metadata.published_date)}
          />
          {metadata.path && (
            <a
              href={metadata.path}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1.5"
            >
              <ExternalLink className="size-3.5" aria-hidden /> Live demo
            </a>
          )}
          {metadata.source && (
            <a
              href={metadata.source}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1.5"
            >
              <Code className="size-3.5" aria-hidden /> Source code
            </a>
          )}
        </div>
      }
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
```

Delete `src/components/heading-top.tsx` (`git rm`); `grep -rn "heading-top" src` → no output.

- [ ] **Step 4: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "feat: add back link and meta line to article headers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Notion content blocks on the new scale

**Files:**
- Modify: `src/sections/content.tsx`
- Modify: `src/components/content-blocks/blocks/heading-blocks.tsx`
- Modify: `src/components/content-blocks/blocks/text-blocks.tsx`
- Modify: `src/components/content-blocks/blocks/list-blocks.tsx`
- Modify: `src/components/content-blocks/list-utils.ts`
- Modify: `src/components/content-blocks/blocks/media-blocks.tsx`
- Modify: `src/components/content-blocks/blocks/table-block.tsx`

**Interfaces:**
- Consumes: `Typography` `h3`, `h4`, `article` (Task 1).
- Produces: no new names; visual change only.

- [ ] **Step 1: Section spacing** — in `src/sections/content.tsx` change the section class to:

```tsx
      className="w-full flex flex-col items-start justify-start space-y-0 [&>*+*]:mt-[18px]"
```

- [ ] **Step 2: Headings** — `src/components/content-blocks/blocks/heading-blocks.tsx`:

```tsx
export const Heading1Block = withContentValidation((props: DropedProps) => (
  <Typography component="h2" variant="h3" className="w-full mt-10!">
    {props.children}
  </Typography>
));

export const Heading2Block = withContentValidation((props: DropedProps) => (
  <Typography component="h2" variant="h3" className="w-full mt-8!">
    {props.children}
  </Typography>
));

export const Heading3Block = withContentValidation((props: DropedProps) => (
  <Typography component="h3" variant="h4" className="w-full mt-6!">
    {props.children}
  </Typography>
));
```

(Notion H1 renders as `h2` because the page title is the only `h1`.)

- [ ] **Step 3: Text blocks** — in `src/components/content-blocks/blocks/text-blocks.tsx`:

- `ParagraphBlock`: `<Typography data-testid="paragraph" size="article" className="w-full max-w-[64ch]">`.
- `CalloutBlock` outer div: `className="w-full rounded-lg bg-card p-3 shadow-[inset_0_0_0_1px_var(--input)] flex items-start justify-start"`; inner `<Typography size="article" className="w-full text-foreground">`.
- `QuoteBlock`: `<blockquote className="w-full max-w-[64ch] border-l-2 border-input pl-4">` with `<Typography size="article" className="text-foreground">`.

- [ ] **Step 4: Lists** — in `src/components/content-blocks/blocks/list-blocks.tsx` change the list item to `<Typography component="li" key={i} size="article" className="w-full">`. In `src/components/content-blocks/list-utils.ts` change both `max-w-[68ch]` to `max-w-[64ch]`.

- [ ] **Step 5: Media and table** — in `media-blocks.tsx` change the placeholder's `rounded-md border border-border bg-muted` to `rounded-[10px] bg-card shadow-[inset_0_0_0_1px_var(--input)]`. In `table-block.tsx` change the header cell `text-accent-foreground bg-card` to `text-foreground bg-card` and the body cell `text-muted-foreground` stays; add `text-sm` to the `<table>` class.

- [ ] **Step 6: Verify**

Run: `pnpm type-check && pnpm lint && pnpm test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/sections/content.tsx src/components/content-blocks
git commit -m "feat: set Notion content blocks on the article type scale

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Browser verification

**Files:** none (fix-ups go in the task that owns the file).

- [ ] **Step 1: Environment** — copy the main checkout's local env into the worktree (gitignored): `cp ../../../.env.local .env.local`. Confirm `BASE_URL` is set: `grep -c '^BASE_URL=' .env.local` → `1`.

- [ ] **Step 2: Gates** — `pnpm lint && pnpm type-check && pnpm test`. Expected: all pass.

- [ ] **Step 3: Dev server** — start it through the preview tool (`.claude/launch.json` entry `{ "name": "dev", "runtimeExecutable": "pnpm", "runtimeArgs": ["dev"], "port": 3000 }`), never via Bash.

- [ ] **Step 4: Check each route** at 1280px and 375px, in light and dark: `/`, `/projects`, `/writings`, one `/writings/<slug>`, one `/projects/<slug>`, `/about`, `/gears`, `/does-not-exist`. For each, confirm against the mockup:
  - 640px column, no horizontal scroll at 375px.
  - Serif only on the name, page titles, article titles.
  - Project/gear rows show icon tiles (Notion icon, cover crop or monogram).
  - Home "Writing" and "More posts": no year column, `dd/mm` dates; `/writings`: year column.
  - Favicons on GitHub/YouTube/Instagram links (Home, About, and any in Notion text).
  - Entrance stagger plays once; with reduced motion emulated it does not.
  - The reactions pill on an article still records a view, a like, plays narration and opens the Purl save flow (behavior unchanged; only colors change).
  - `read_console_messages` shows no errors; `/api/notion-image?resource=icon&id=<a project id with an uploaded icon>` returns 200 if any project has one.

- [ ] **Step 5: No-JS check** — load `/` and one article with JavaScript disabled (or `curl -s localhost:3000/ | grep -c 'Nubelson'`): hero, project rows and article body are in the HTML.

- [ ] **Step 6: Commit any fixes** with a message naming what was fixed, then report results with screenshots.

---

### Task 12: Interface review with `/better-interface`

**Files:** whichever component files the review flags.

- [ ] **Step 1:** Invoke the `better-interface` skill on the rebuilt UI (accessibility, layout, writing, typography, color, UI polish), scoped to the files changed on this branch: `git diff --name-only develop...HEAD -- src`.
- [ ] **Step 2:** Apply every finding that does not contradict the spec or Global Constraints. List any finding that does (for example, one asking for an accent color) for the user instead of applying it.
- [ ] **Step 3:** Run `pnpm lint && pnpm type-check && pnpm test`; expected PASS. Re-check the affected routes in the browser (Task 11 Step 4 list).
- [ ] **Step 4:** Commit: `fix: apply interface review findings` with the co-author line.

### Task 13: Animation opportunities with `/find-animation-opportunities`

**Files:** none (read-only).

- [ ] **Step 1:** After Task 12, invoke the `find-animation-opportunities` skill on the rebuilt UI. It proposes motion with exact values and does not implement it.
- [ ] **Step 2:** Save its output to `docs/superpowers/specs/2026-10-15-portfolio-micro-interactions-notes.md` and commit it (`docs: record animation opportunities for the micro-interactions pass`). This is the input for the micro-interactions follow-up (spec Open item 2); nothing from it is implemented in this plan.

