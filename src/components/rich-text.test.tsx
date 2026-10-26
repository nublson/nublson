import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderRichTextNode } from "./rich-text";

// SiteFavicon is an async server component, which Testing Library can't render.
vi.mock("./site-favicon", () => ({
  SiteFavicon: ({ href }: { href: string }) => (
    <span data-testid="site-favicon" data-href={href} />
  ),
}));

describe("renderRichTextNode links", () => {
  it("renders underlined links with the site's favicon before the text", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "docs",
          href: "https://example.com",
        })}
      </p>,
    );
    const link = screen.getByRole("link", { name: "docs" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.className).toContain("underline");
    expect(link.firstElementChild).toBe(screen.getByTestId("site-favicon"));
    expect(screen.getByTestId("site-favicon")).toHaveAttribute(
      "data-href",
      "https://example.com",
    );
  });

  it("treats social profiles like any other site", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "my code",
          href: "https://github.com/nublson",
        })}
      </p>,
    );
    const link = screen.getByRole("link", { name: /my code/ });
    expect(link.querySelector("svg")).toBeNull();
    expect(screen.getByTestId("site-favicon")).toHaveAttribute(
      "data-href",
      "https://github.com/nublson",
    );
  });
});
