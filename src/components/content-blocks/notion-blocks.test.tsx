import type { RichTextItemResponse } from "@notionhq/client";
import { describe, expect, it, vi } from "vitest";
import { NotionBlocks } from ".";
import { block, renderToHtml, richText } from "./test-utils";
import type { NotionBlock } from "./types";

vi.mock("./blocks/code-block-highlight", () => ({
  CodeBlockHighlight: ({ language, code }: { language: string; code: string }) => (
    <pre data-language={language}>{code}</pre>
  ),
}));

// Favicon lookups go to the network; tests get a fixed icon.
vi.mock("@/services/favicon", () => ({
  getFavicon: vi.fn(async () => "data:image/png;base64,AAAA"),
}));

vi.mock("../cover-image", () => ({
  CoverImage: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

function render(blocks: NotionBlock[]) {
  return renderToHtml(<NotionBlocks blocks={blocks} />);
}

/** The rendered HTML parsed into a container, for structural queries. */
async function dom(blocks: NotionBlock[]) {
  const container = document.createElement("div");
  container.innerHTML = await render(blocks);
  return container;
}

const para = (...text: RichTextItemResponse[]) =>
  block("paragraph", { rich_text: text });
const bullet = (text: string, children?: NotionBlock[]) =>
  block("bulleted_list_item", { rich_text: [richText(text)] }, children);
const numbered = (text: string) =>
  block("numbered_list_item", { rich_text: [richText(text)] });

describe("NotionBlocks", () => {
  it("renders a paragraph in the muted body colour", async () => {
    const root = await dom([para(richText("Hello"))]);
    const p = root.querySelector('[data-testid="paragraph"]');
    expect(p?.textContent).toBe("Hello");
    expect(p?.innerHTML).toContain("text-muted-foreground");
  });

  it("drops empty paragraphs, like the old renderer", async () => {
    expect(await render([para(), para(richText("  "))])).toBe("");
  });

  it("keeps annotations and Notion colours", async () => {
    const root = await dom([
      para(
        richText("bold", { annotations: { bold: true } }),
        richText("red", { annotations: { color: "red" } }),
      ),
    ]);
    expect(root.querySelector("strong")?.textContent).toBe("bold");
    expect(root.querySelector(".text-red-500")?.textContent).toBe("red");
  });

  it("renders headings one level down, without the muted colour", async () => {
    const root = await dom([
      block("heading_1", { rich_text: [richText("One")] }),
      block("heading_3", { rich_text: [richText("Three")] }),
    ]);
    expect(root.querySelector("h2")?.textContent).toBe("One");
    expect(root.querySelector("h3")?.textContent).toBe("Three");
    expect(root.querySelector("h1")).toBeNull();
    expect(root.innerHTML).not.toContain("text-muted-foreground");
  });

  it("merges consecutive list items into one list per kind", async () => {
    const root = await dom([
      bullet("a"),
      bullet("b"),
      numbered("one"),
      numbered("two"),
      bullet("c"),
    ]);
    const lists = [...root.querySelectorAll("ul, ol")].map((list) => [
      list.tagName,
      list.querySelectorAll("li").length,
    ]);
    expect(lists).toEqual([
      ["UL", 2],
      ["OL", 2],
      ["UL", 1],
    ]);
  });

  it("renders nested list items inside their parent item", async () => {
    const root = await dom([bullet("parent", [bullet("child")])]);
    const nested = root.querySelector("li ul li");
    expect(nested?.textContent).toBe("child");
  });

  it("renders to-dos as checkboxes, struck through when done", async () => {
    const root = await dom([
      block("to_do", { rich_text: [richText("ship")], checked: true }),
      block("to_do", { rich_text: [richText("test")], checked: false }),
    ]);
    const boxes = root.querySelectorAll<HTMLInputElement>("input[type=checkbox]");
    expect([...boxes].map((box) => box.checked)).toEqual([true, false]);
    expect(root.querySelector("s")?.textContent).toBe("ship");
  });

  it("joins code segments without adding spaces", async () => {
    const root = await dom([
      block("code", {
        language: "typescript",
        rich_text: [richText("const a"), richText(" = 1;")],
      }),
    ]);
    const pre = root.querySelector("pre");
    expect(pre?.textContent).toBe("const a = 1;");
    expect(pre?.dataset.language).toBe("typescript");
  });

  it("renders a callout with its emoji and nested blocks", async () => {
    const root = await dom([
      block(
        "callout",
        { rich_text: [richText("Note")], icon: { type: "emoji", emoji: "💡" } },
        [para(richText("More"))],
      ),
    ]);
    expect(root.textContent).toContain("💡");
    expect(root.textContent).toContain("Note");
    expect(root.querySelector('[data-testid="paragraph"]')?.textContent).toBe(
      "More",
    );
  });

  it("renders quotes and toggles", async () => {
    const root = await dom([
      block("quote", { rich_text: [richText("Quoted")] }),
      block("toggle", { rich_text: [richText("Open me")] }, [
        para(richText("Hidden")),
      ]),
    ]);
    expect(root.querySelector("blockquote")?.textContent).toBe("Quoted");
    expect(root.querySelector("summary")?.textContent).toBe("Open me");
    expect(root.querySelector("details")?.textContent).toContain("Hidden");
  });

  it("renders uploaded and external images with the caption as alt", async () => {
    const root = await dom([
      block("image", {
        type: "file",
        file: { url: "/api/notion-image?id=1" },
        caption: [richText("A cat")],
      }),
      block("image", {
        type: "external",
        external: { url: "https://example.com/a.png" },
        caption: [],
      }),
    ]);
    const images = [...root.querySelectorAll("img")];
    expect(images.map((img) => img.getAttribute("src"))).toEqual([
      "/api/notion-image?id=1",
      "https://example.com/a.png",
    ]);
    expect(images[0]?.alt).toBe("A cat");
  });

  it("embeds YouTube videos", async () => {
    const root = await dom([
      block("video", {
        type: "external",
        external: { url: "https://www.youtube.com/watch?v=abc123" },
        caption: [],
      }),
    ]);
    expect(root.querySelector("iframe")?.getAttribute("src")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("renders tables from their rows, with a header row when set", async () => {
    const row = (...cells: string[]) =>
      block("table_row", { cells: cells.map((c) => [richText(c)]) });
    const root = await dom([
      block("table", { has_column_header: true, table_width: 2 }, [
        row("Name", "Role"),
        row("Ada", "Engineer"),
      ]),
    ]);
    expect([...root.querySelectorAll("th")].map((th) => th.textContent)).toEqual(
      ["Name", "Role"],
    );
    expect([...root.querySelectorAll("td")].map((td) => td.textContent)).toEqual(
      ["Ada", "Engineer"],
    );
  });

  it("flattens synced blocks and columns into the page", async () => {
    const root = await dom([
      block("synced_block", { synced_from: null }, [para(richText("Synced"))]),
      block("column_list", {}, [
        block("column", {}, [para(richText("Column"))]),
      ]),
    ]);
    expect(
      [...root.querySelectorAll('[data-testid="paragraph"]')].map(
        (p) => p.textContent,
      ),
    ).toEqual(["Synced", "Column"]);
  });

  it("renders nothing for unsupported blocks", async () => {
    expect(await render([block("table_of_contents", { color: "default" })])).toBe(
      "",
    );
  });

  it("opens external links in a new tab with their favicon, and keeps profile icons", async () => {
    const root = await dom([
      para(
        richText("docs", { href: "https://example.com" }),
        richText("GitHub", { href: "https://github.com/nublson" }),
      ),
    ]);
    const [docs, github] = [...root.querySelectorAll("a")];
    expect(docs?.getAttribute("target")).toBe("_blank");
    expect(docs?.className).toContain("underline");
    expect(
      docs?.querySelector('img[data-slot="site-favicon"]')?.getAttribute("src"),
    ).toBe("data:image/png;base64,AAAA");
    expect(github?.querySelector("svg")).not.toBeNull();
    expect(github?.querySelector('[data-slot="site-favicon"]')).toBeNull();
  });
});
