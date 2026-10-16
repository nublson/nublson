import { describe, it, expect } from "vitest";
import type { PageObjectResponse } from "@notionhq/client";
import {
  slugifyText,
  formatPostDate,
  formatPostDateFull,
  formatCompactCount,
  formatViewCount,
  formatPageMetadata,
  formatPostMetadata,
  formatPostDayMonth,
  formatPostDateCompact,
  groupPostsByYear,
  formatPageIcon,
} from "./formatter";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePage(
  overrides: Record<string, unknown> = {},
): PageObjectResponse {
  return {
    id: "page-1",
    cover: null,
    last_edited_time: "2024-09-19T12:00:00.000Z",
    properties: {
      Name: { type: "title", title: [{ plain_text: "Hello World" }] },
      description: {
        type: "rich_text",
        rich_text: [{ plain_text: "A short description" }],
      },
      Description: {
        type: "rich_text",
        rich_text: [{ plain_text: "Post description" }],
      },
      "Publish Date": { type: "date", date: { start: "2024-09-01" } },
    },
    ...overrides,
  } as unknown as PageObjectResponse;
}

describe("slugifyText", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugifyText("Hello World")).toBe("hello-world");
  });

  it("removes special characters defined in the pattern", () => {
    expect(slugifyText("Hello, World!")).toBe("hello-world");
    expect(slugifyText("Title: Subtitle")).toBe("title-subtitle");
  });

  it("handles already-lowercased input", () => {
    expect(slugifyText("my blog post")).toBe("my-blog-post");
  });

  it("handles empty string", () => {
    expect(slugifyText("")).toBe("");
  });
});

describe("formatPostDate", () => {
  it("formats a date to month + year (short month)", () => {
    const result = formatPostDate("2024-09-19T00:00:00.000Z");
    expect(result).toMatch(/Sep\s+2024/);
  });

  it("produces a human-readable string", () => {
    const result = formatPostDate("2023-01-01T00:00:00.000Z");
    expect(result).toMatch(/Jan\s+2023/);
  });
});

describe("formatPostDateFull", () => {
  it("includes the day in the output", () => {
    const result = formatPostDateFull("2024-09-19T00:00:00.000Z");
    expect(result).toMatch(/19/);
    expect(result).toMatch(/Sep/);
    expect(result).toMatch(/2024/);
  });

  it("uses the calendar day written in the Notion string, ignoring timezone", () => {
    expect(formatPostDateFull("2026-01-01T00:30:00.000+01:00")).toBe(
      "Jan 1, 2026",
    );
  });

  it("returns an empty string for an empty date instead of Invalid Date", () => {
    expect(formatPostDateFull("")).toBe("");
  });
});

describe("formatCompactCount", () => {
  it("returns string integers below 1K unchanged", () => {
    expect(formatCompactCount(0)).toBe("0");
    expect(formatCompactCount(1)).toBe("1");
    expect(formatCompactCount(999)).toBe("999");
  });

  it("formats thousands with K and up to one decimal", () => {
    expect(formatCompactCount(1000)).toBe("1K");
    expect(formatCompactCount(10300)).toBe("10.3K");
    expect(formatCompactCount(10000)).toBe("10K");
  });

  it("rolls nearly 1M counts into M when K would round to 1000", () => {
    expect(formatCompactCount(999_999)).toBe("1M");
  });

  it("formats millions with M and up to one decimal", () => {
    expect(formatCompactCount(1_000_000)).toBe("1M");
    expect(formatCompactCount(1_550_000)).toBe("1.6M");
  });

  it("truncates fractional input", () => {
    expect(formatCompactCount(10300.7)).toBe("10.3K");
  });

  it("returns 0 for non-finite or negative values", () => {
    expect(formatCompactCount(-1)).toBe("0");
    expect(formatCompactCount(Number.NaN)).toBe("0");
  });
});

describe("formatPageMetadata", () => {
  it("joins every rich text segment of the description, not just the first", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "Home" }] },
        description: {
          type: "rich_text",
          rich_text: [
            { plain_text: "Find me on ", href: null },
            { plain_text: "GitHub", href: "https://github.com/nublson" },
            { plain_text: ".", href: null },
          ],
        },
      },
    });
    const result = formatPageMetadata(page);
    expect(result.description).toBe("Find me on GitHub.");
    expect(result.descriptionRichText).toHaveLength(3);
    expect(result.descriptionRichText[1].href).toBe("https://github.com/nublson");
  });

  it("collapses paragraph breaks into single spaces in the plain description", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "Home" }] },
        description: {
          type: "rich_text",
          rich_text: [{ plain_text: "I build software.\n\nFind me on GitHub.", href: null }],
        },
      },
    });
    expect(formatPageMetadata(page).description).toBe(
      "I build software. Find me on GitHub.",
    );
  });

  it("returns an empty rich text list when there is no description", () => {
    const page = makePage({
      properties: { Name: { type: "title", title: [{ plain_text: "Home" }] } },
    });
    expect(formatPageMetadata(page).descriptionRichText).toEqual([]);
  });

  it("extracts id, title and generates a slug", () => {
    const page = makePage();
    const result = formatPageMetadata(page);
    expect(result.id).toBe("page-1");
    expect(result.title).toBe("Hello World");
    expect(result.slug).toBe("hello-world");
  });

  it("returns empty title when Name property type is not 'title'", () => {
    const page = makePage({
      properties: { Name: { type: "rich_text", rich_text: [] } },
    });
    const result = formatPageMetadata(page);
    expect(result.title).toBe("");
  });

  it("returns empty title when title array is empty", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [] },
      },
    });
    const result = formatPageMetadata(page);
    expect(result.title).toBe("");
  });

  it("sets thumbnail from a file cover", () => {
    const page = makePage({
      cover: { type: "file", file: { url: "https://cdn.example.com/img.png" } },
    });
    expect(formatPageMetadata(page).thumbnail).toBe(
      "/api/notion-image?resource=cover&id=page-1&v=2024-09-19T12%3A00%3A00.000Z",
    );
  });

  it("sets thumbnail from an external cover", () => {
    const page = makePage({
      cover: {
        type: "external",
        external: { url: "https://external.example.com/img.png" },
      },
    });
    expect(formatPageMetadata(page).thumbnail).toBe(
      "https://external.example.com/img.png",
    );
  });

  it("returns undefined thumbnail when cover is null", () => {
    const page = makePage({ cover: null });
    expect(formatPageMetadata(page).thumbnail).toBeUndefined();
  });

  it("extracts description from rich_text", () => {
    const page = makePage();
    expect(formatPageMetadata(page).description).toBe("A short description");
  });

  it("returns empty description when property is absent", () => {
    const page = makePage({ properties: { Name: { type: "title", title: [] } } });
    expect(formatPageMetadata(page).description).toBe("");
  });

  it("extracts modified_date from last_edited_time property", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "T" }] },
        modified_date: {
          type: "last_edited_time",
          last_edited_time: "2025-01-15T08:00:00.000Z",
        },
      },
    });
    expect(formatPageMetadata(page).modified_date).toBe(
      "2025-01-15T08:00:00.000Z",
    );
  });

  it("returns undefined modified_date when property is absent", () => {
    const page = makePage();
    expect(formatPageMetadata(page).modified_date).toBeUndefined();
  });

  it("extracts role and location from rich_text properties", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "T" }] },
        role: { type: "rich_text", rich_text: [{ plain_text: "Engineer" }] },
        location: {
          type: "rich_text",
          rich_text: [{ plain_text: "Remote" }],
        },
      },
    });
    const result = formatPageMetadata(page);
    expect(result.role).toBe("Engineer");
    expect(result.location).toBe("Remote");
  });

  it("returns undefined role and location when properties are absent", () => {
    const page = makePage();
    const result = formatPageMetadata(page);
    expect(result.role).toBeUndefined();
    expect(result.location).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// formatPostMetadata
// ---------------------------------------------------------------------------

describe("formatPostMetadata", () => {
  it("keeps the description's rich text and joins every segment as plain text", () => {
    const [post] = formatPostMetadata([
      makePage({
        properties: {
          Name: { type: "title", title: [{ plain_text: "Post" }] },
          Description: {
            type: "rich_text",
            rich_text: [
              { plain_text: "Read it on ", href: null },
              { plain_text: "Substack", href: "https://nublson.substack.com" },
              { plain_text: ".", href: null },
            ],
          },
        },
      }),
    ]);
    expect(post.description).toBe("Read it on Substack.");
    expect(post.descriptionRichText).toHaveLength(3);
  });

  it("returns an empty array for empty input", () => {
    expect(formatPostMetadata([])).toEqual([]);
  });

  it("maps a page to PostMetadata with correct fields", () => {
    const page = makePage();
    const [result] = formatPostMetadata([page]);
    expect(result.id).toBe("page-1");
    expect(result.title).toBe("Hello World");
    expect(result.slug).toBe("hello-world");
    expect(result.description).toBe("Post description");
    expect(result.published_date).toBe("2024-09-01");
    expect(result.updated_date).toBe("2024-09-19T12:00:00.000Z");
  });

  it("sets thumbnail from a file cover", () => {
    const page = makePage({
      cover: { type: "file", file: { url: "https://cdn.example.com/img.png" } },
    });
    const [result] = formatPostMetadata([page]);
    expect(result.thumbnail).toBe(
      "/api/notion-image?resource=cover&id=page-1&v=2024-09-19T12%3A00%3A00.000Z",
    );
  });

  it("sets thumbnail from an external cover", () => {
    const page = makePage({
      cover: {
        type: "external",
        external: { url: "https://external.example.com/img.png" },
      },
    });
    const [result] = formatPostMetadata([page]);
    expect(result.thumbnail).toBe("https://external.example.com/img.png");
  });

  it("returns undefined thumbnail when cover is null", () => {
    const page = makePage({ cover: null });
    const [result] = formatPostMetadata([page]);
    expect(result.thumbnail).toBeUndefined();
  });

  it("returns empty published_date when Publish Date property is absent", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "T" }] },
        Description: { type: "rich_text", rich_text: [] },
      },
    });
    const [result] = formatPostMetadata([page]);
    expect(result.published_date).toBe("");
  });

  it("returns empty published_date when date value is null", () => {
    const page = makePage({
      properties: {
        Name: { type: "title", title: [{ plain_text: "T" }] },
        Description: { type: "rich_text", rich_text: [] },
        "Publish Date": { type: "date", date: null },
      },
    });
    const [result] = formatPostMetadata([page]);
    expect(result.published_date).toBe("");
  });

  it("maps multiple pages preserving order", () => {
    const pages = [
      makePage({ id: "a", properties: { Name: { type: "title", title: [{ plain_text: "Alpha" }] }, Description: { type: "rich_text", rich_text: [] }, "Publish Date": { type: "date", date: { start: "2024-01-01" } } } }),
      makePage({ id: "b", properties: { Name: { type: "title", title: [{ plain_text: "Beta" }] }, Description: { type: "rich_text", rich_text: [] }, "Publish Date": { type: "date", date: { start: "2024-02-01" } } } }),
    ];
    const results = formatPostMetadata(pages);
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("Alpha");
    expect(results[1].title).toBe("Beta");
  });
});

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

describe("formatViewCount", () => {
  it("uses the singular for one view", () => {
    expect(formatViewCount(1)).toBe("1 view");
  });

  it("uses the plural otherwise, compacting large counts", () => {
    expect(formatViewCount(0)).toBe("0 views");
    expect(formatViewCount(20)).toBe("20 views");
    expect(formatViewCount(1200)).toBe("1.2K views");
  });
});
