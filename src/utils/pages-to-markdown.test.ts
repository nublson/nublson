import type { BlockWithChildren } from "@/services/notion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  estimateMarkdownTokens,
  notionBlocksToMarkdown,
  pageToMarkdown,
  postToMarkdown,
} from "./pages-to-markdown";

const PROXY_URL =
  "/api/notion-image?resource=block&id=11111111-1111-1111-1111-111111111111";

function text(content: string) {
  return {
    type: "text",
    text: { content, link: null },
    plain_text: content,
    href: null,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  };
}

function block(type: string, payload: object): BlockWithChildren {
  return {
    object: "block",
    id: "11111111-1111-1111-1111-111111111111",
    type,
    has_children: false,
    [type]: payload,
  } as unknown as BlockWithChildren;
}

const BLOCKS = [
  block("heading_2", { rich_text: [text("Intro")] }),
  block("paragraph", { rich_text: [text("Hello.")] }),
  block("image", { type: "file", file: { url: PROXY_URL }, caption: [] }),
];

beforeEach(() => {
  vi.stubEnv("BASE_URL", "https://example.com/");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("notionBlocksToMarkdown", () => {
  it("keeps heading levels and makes proxied images absolute", () => {
    expect(notionBlocksToMarkdown(BLOCKS)).toBe(
      `## Intro\n\nHello.\n\n![](https://example.com${PROXY_URL})`,
    );
  });
});

describe("postToMarkdown", () => {
  it("writes front matter, the title as #, then the body", () => {
    const markdown = postToMarkdown({
      title: "Hello: World",
      description: "A post.",
      publishedDate: "2026-01-01T00:00:00.000Z",
      author: "Nubelson",
      category: "Design",
      blocks: BLOCKS.slice(0, 2),
    });

    expect(markdown).toBe(
      "---\n" +
        'title: "Hello: World"\n' +
        "description: A post.\n" +
        'published: "2026-01-01T00:00:00.000Z"\n' +
        "author: Nubelson\n" +
        "category: Design\n" +
        "---\n\n" +
        "# Hello: World\n\n## Intro\n\nHello.\n",
    );
  });

  it("omits category and body when absent", () => {
    const markdown = postToMarkdown({
      title: "Empty",
      description: "",
      publishedDate: "2026",
      author: "Nubelson",
      blocks: [],
    });

    expect(markdown).toBe(
      "---\ntitle: Empty\ndescription: \npublished: 2026\nauthor: Nubelson\n---\n\n# Empty\n",
    );
  });
});

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
          heading: "Writing",
          posts: [
            {
              title: "Hello World",
              url: "https://nublson.com/writings/hello-world",
              description: "An intro.",
              publishedDate: "2025-09-19T00:00:00Z",
            },
            {
              title: "No Extras",
              url: "https://nublson.com/writings/no-extras",
            },
          ],
        },
      ],
    });

    expect(markdown).toBe(
      "# Blog\n\n> Writing.\n\n## Writing\n\n" +
        "- [Hello World](https://nublson.com/writings/hello-world) (2025-09-19): An intro.\n" +
        "- [No Extras](https://nublson.com/writings/no-extras)\n",
    );
  });

  it("renders posts without a url as plain text", () => {
    const markdown = pageToMarkdown({
      hero: { title: "Gears", description: "Tools I use." },
      sections: [
        {
          heading: "Hardware",
          posts: [
            {
              title: "Unlinked Gear",
              description: "No Path property in Notion.",
            },
            {
              title: "Linked Gear",
              url: "https://example.com/gear",
            },
          ],
        },
      ],
    });

    expect(markdown).toBe(
      "# Gears\n\n> Tools I use.\n\n## Hardware\n\n" +
        "- Unlinked Gear: No Path property in Notion.\n" +
        "- [Linked Gear](https://example.com/gear)\n",
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
