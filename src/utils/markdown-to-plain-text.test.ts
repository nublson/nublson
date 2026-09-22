import { describe, expect, it } from "vitest";
import { markdownToPlainText } from "./markdown-to-plain-text";

describe("markdownToPlainText", () => {
  it("strips headings, bold, italic, and strikethrough markers", () => {
    expect(markdownToPlainText("# Title\n\n**bold** *italic* ~~gone~~")).toBe(
      "Title\n\nbold italic gone",
    );
  });

  it("keeps link labels and drops the URL", () => {
    expect(markdownToPlainText("See [the docs](https://example.com) for more.")).toBe(
      "See the docs for more.",
    );
  });

  it("drops images entirely", () => {
    expect(markdownToPlainText("Before ![alt text](https://example.com/a.png) after")).toBe(
      "Before after",
    );
  });

  it("keeps code content but drops fences, language, and inline backticks", () => {
    expect(markdownToPlainText("```ts\nconst x = 1;\n```")).toBe("const x = 1;");
    expect(markdownToPlainText("Use `npm install` first.")).toBe(
      "Use npm install first.",
    );
  });

  it("strips list and blockquote markers", () => {
    expect(
      markdownToPlainText("- one\n- two\n1. first\n> a quote"),
    ).toBe("one\ntwo\nfirst\na quote");
  });

  it("drops table separator rows and turns pipes into pauses", () => {
    expect(
      markdownToPlainText("| A | B |\n| --- | --- |\n| 1 | 2 |"),
    ).toBe("A , B\n1 , 2");
  });

  it("drops horizontal rules and collapses excess blank lines", () => {
    expect(markdownToPlainText("one\n\n---\n\n\n\ntwo")).toBe("one\n\ntwo");
  });
});
