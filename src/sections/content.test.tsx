import type { RichTextItemResponse } from "@notionhq/client";
import { render, screen } from "@testing-library/react";
import type { NotionBlock } from "notionic";
import { prerender } from "react-dom/static";
import { describe, expect, it, vi } from "vitest";
import ContentSection from "./content";

const text = (content: string, href: string | null = null) =>
  ({
    type: "text",
    plain_text: content,
    href,
    text: { content, link: href ? { url: href } : null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  }) as RichTextItemResponse;

const block = (id: string, type: string, payload: object) =>
  ({ object: "block", id, type, has_children: false, [type]: payload }) as unknown as NotionBlock;

describe("ContentSection", () => {
  it("renders nothing for a blank page", () => {
    const { container } = render(<ContentSection blocks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders blocks with notionic", () => {
    render(
      <ContentSection
        blocks={[
          block("p1", "paragraph", { rich_text: [text("Hello there.")], color: "default" }),
          block("h1", "heading_1", { rich_text: [text("A heading")], color: "default", is_toggleable: false }),
        ]}
      />,
    );
    expect(screen.getByText("Hello there.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /A heading/ })).toBeInTheDocument();
  });

  it("renders images through CoverImage with their caption", () => {
    render(
      <ContentSection
        blocks={[
          block("i1", "image", {
            type: "file",
            file: { url: "/api/notion-image?resource=block&id=i1" },
            caption: [text("A photo")],
          }),
        ]}
      />,
    );
    const image = screen.getByRole("img", { name: "A photo" });
    expect(image.className).toContain("fade-in-image");
    expect(image.getAttribute("src")).toContain(encodeURIComponent("/api/notion-image"));
    expect(screen.getByText("A photo", { selector: "figcaption *, figcaption" })).toBeInTheDocument();
  });

  it("highlights code blocks on the server", async () => {
    // NotionCode is an async Server Component, so render it the way the server does.
    const { prelude } = await prerender(
      <ContentSection
        blocks={[
          block("c1", "code", { language: "typescript", rich_text: [text("const a = 1")], caption: [] }),
        ]}
      />,
    );
    const html = await new Response(prelude).text();
    expect(html).toContain("TypeScript");
    expect(html).toContain("--shiki-light");
  });

  it("shows the favicons fetchBlocks attached, and a globe for a site without one", async () => {
    const { prelude } = await prerender(
      <ContentSection
        blocks={[
          {
            ...block("p2", "paragraph", {
              rich_text: [
                text("notionic", "https://notionic.dev"),
                text(" and "),
                text("GitHub", "https://github.com/nublson"),
              ],
              color: "default",
            }),
            linkFavicons: { "notionic.dev": "data:image/png;base64,AAAA" },
          },
        ]}
      />,
    );
    const html = await new Response(prelude).text();
    expect(html).toMatch(/<a href="https:\/\/notionic.dev"[^>]*target="_blank"[^>]*><img src="data:image\/png;base64,AAAA"/);
    expect(html).toMatch(/<a href="https:\/\/github.com\/nublson"[^>]*><svg/);
  });

  it("keeps links to this site plain", async () => {
    vi.stubEnv("BASE_URL", "https://nublson.com");
    try {
      const { prelude } = await prerender(
        <ContentSection
          blocks={[
            {
              ...block("p3", "paragraph", {
                rich_text: [text("about", "https://nublson.com/about")],
                color: "default",
              }),
              linkFavicons: { "nublson.com": "data:image/png;base64,BBBB" },
            },
          ]}
        />,
      );
      const html = await new Response(prelude).text();
      expect(html).toMatch(/<a href="https:\/\/nublson.com\/about"[^>]*>about<\/a>/);
      expect(html).not.toContain("<img");
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
