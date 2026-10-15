import type { RichTextItemResponse } from "@notionhq/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichDescription } from "./rich-description";

const text = (content: string, url?: string) =>
  ({
    type: "text",
    plain_text: content,
    href: url ?? null,
    text: { content, link: url ? { url } : null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  }) as RichTextItemResponse;

describe("RichDescription", () => {
  it("splits blank lines into paragraphs", () => {
    const { container } = render(
      <RichDescription
        items={[text("I build software.\n\nFind me on "), text("GitHub", "https://github.com/nublson"), text(".")]}
      />,
    );
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("I build software.");
    expect(paragraphs[1].textContent).toBe("Find me on GitHub.");
  });

  it("renders profile links with their icon", () => {
    render(<RichDescription items={[text("GitHub", "https://github.com/nublson")]} />);
    const link = screen.getByRole("link", { name: /GitHub/ });
    expect(link).toHaveAttribute("href", "https://github.com/nublson");
    expect(link.querySelector("svg")).not.toBeNull();
  });

  it("renders nothing without text", () => {
    const { container } = render(<RichDescription items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
