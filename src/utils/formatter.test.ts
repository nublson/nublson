import { describe, it, expect } from "vitest";
import type { PageObjectResponse } from "@notionhq/client";
import {
  slugifyText,
  formatPostDate,
  formatPostDateFull,
  getListBlockItems,
  formatBlockWithChildren,
  formatPageMetadata,
  formatPostMetadata,
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
});

describe("getListBlockItems", () => {
  it("extracts items from render-lib shape (items[])", () => {
    const block = {
      items: [
        { content: { text: [{ plain_text: "First" }] } },
        { content: { text: [{ plain_text: "Second" }] } },
      ],
    };
    expect(getListBlockItems(block)).toEqual(["First", "Second"]);
  });

  it("joins multiple rich-text fragments per item", () => {
    const block = {
      items: [
        {
          content: {
            text: [{ plain_text: "Framework:" }, { plain_text: " Next.js (App Router)" }],
          },
        },
      ],
    };
    expect(getListBlockItems(block)).toEqual(["Framework: Next.js (App Router)"]);
  });

  it("extracts items from Notion API shape (bulleted_list_item)", () => {
    const block = {
      bulleted_list_item: {
        rich_text: [{ plain_text: "Only item" }],
      },
    };
    expect(getListBlockItems(block)).toEqual(["Only item"]);
  });

  it("returns empty array for an unrecognised block shape", () => {
    expect(getListBlockItems({})).toEqual([]);
  });

  it("handles missing text gracefully", () => {
    const block = {
      items: [{ content: {} }],
    };
    expect(getListBlockItems(block)).toEqual([""]);
  });
});

describe("formatBlockWithChildren", () => {
  it("passes through blocks without children unchanged", () => {
    const block = {
      id: "1",
      type: "paragraph",
      has_children: false,
    } as unknown as Parameters<typeof formatBlockWithChildren>[0][number];

    const result = formatBlockWithChildren([block]);
    expect(result[0]).toBe(block);
  });

  it("inlines children into the block type key", () => {
    const child = { id: "child", type: "paragraph", has_children: false };
    const block = {
      id: "1",
      type: "bulleted_list_item",
      has_children: true,
      children: [child],
      bulleted_list_item: { rich_text: [] },
    } as unknown as Parameters<typeof formatBlockWithChildren>[0][number];

    const [result] = formatBlockWithChildren([block]);
    const typed = result as unknown as {
      bulleted_list_item: { rich_text: unknown[]; children: unknown[] };
    };
    expect(typed.bulleted_list_item).toHaveProperty("children", [child]);
  });
});

// ---------------------------------------------------------------------------
// formatPageMetadata
// ---------------------------------------------------------------------------

describe("formatPageMetadata", () => {
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
      "https://cdn.example.com/img.png",
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
    expect(result.thumbnail).toBe("https://cdn.example.com/img.png");
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
