import type { RichTextItemResponse } from "@notionhq/client";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RichDescription } from "./rich-description";

// SiteFavicon is an async server component, which Testing Library can't render.
vi.mock("./site-favicon", () => ({
  SiteFavicon: ({ href }: { href: string }) => (
    <span data-testid="site-favicon" data-href={href} />
  ),
}));

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

  it("renders links with the linked site's favicon before the text", () => {
    render(<RichDescription items={[text("GitHub", "https://github.com/nublson")]} />);
    const link = screen.getByRole("link", { name: /GitHub/ });
    expect(link).toHaveAttribute("href", "https://github.com/nublson");
    expect(link.firstElementChild).toBe(screen.getByTestId("site-favicon"));
    expect(screen.getByTestId("site-favicon")).toHaveAttribute("data-href", "https://github.com/nublson");
  });

  it("renders nothing without text", () => {
    const { container } = render(<RichDescription items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
