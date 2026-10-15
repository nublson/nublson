import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderRichTextNode } from "./content-blocks/rich-text";
import { FaviconLink } from "./favicon-link";

describe("FaviconLink", () => {
  it("renders the icon before the label and opens in a new tab", () => {
    render(<FaviconLink href="https://github.com/nublson" label="GitHub" />);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.querySelector("svg")).not.toBeNull();
  });
});

describe("FaviconLink icons", () => {
  it("renders the Substack mark for Substack links", () => {
    render(
      <FaviconLink href="https://nublson.substack.com" label="Substack" />,
    );
    expect(
      screen.getByRole("link", { name: "Substack" }).querySelector("svg"),
    ).not.toBeNull();
  });
});

describe("FaviconLink Purl", () => {
  it("renders the Purl pearl for Purl links", () => {
    render(<FaviconLink href="https://purl.live" label="Purl" />);
    expect(
      screen.getByRole("link", { name: "Purl" }).querySelector("svg"),
    ).not.toBeNull();
  });
});

describe("FaviconLink wrapping", () => {
  it("lets long custom link text wrap so it can't overflow narrow screens", () => {
    render(
      <FaviconLink href="https://youtube.com/watch?v=1" label="YouTube">
        A very long video title that must wrap on a phone
      </FaviconLink>,
    );
    const link = screen.getByRole("link", { name: /very long video title/ });
    expect(link.className).not.toContain("whitespace-nowrap");
  });
});

describe("renderRichTextNode favicons", () => {
  it("adds a favicon to links that point at a known profile", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "my code",
          href: "https://github.com/nublson",
        })}
      </p>,
    );
    expect(
      screen.getByRole("link", { name: /my code/ }).querySelector("svg"),
    ).not.toBeNull();
  });

  it("keeps plain underlined links for other domains", () => {
    render(
      <p>
        {renderRichTextNode({
          plain_text: "docs",
          href: "https://example.com",
        })}
      </p>,
    );
    const link = screen.getByRole("link", { name: "docs" });
    expect(link.querySelector("svg")).toBeNull();
    expect(link.className).toContain("underline");
  });
});
