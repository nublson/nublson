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
