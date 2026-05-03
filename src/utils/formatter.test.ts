import { describe, it, expect } from "vitest";
import {
  slugifyText,
  formatPostDate,
  formatPostDateFull,
  getListBlockItems,
  formatBlockWithChildren,
} from "./formatter";

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
