import { prerender } from "react-dom/static";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LinkPreview } from "./link-preview";

const getLinkPreview = vi.hoisted(() => vi.fn());
vi.mock("@/services/link-preview", () => ({ getLinkPreview }));
vi.mock("@/services/favicon", () => ({ getFavicon: async () => null }));

async function html(href: string) {
  const { prelude } = await prerender(
    <LinkPreview href={href}>
      <a href={href}>link</a>
    </LinkPreview>,
  );
  return new Response(prelude).text();
}

beforeEach(() => {
  vi.stubEnv("BASE_URL", "https://nublson.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
  getLinkPreview.mockReset();
});

describe("LinkPreview", () => {
  it("makes links to other sites a hover card trigger", async () => {
    getLinkPreview.mockResolvedValue({ title: "notionic", description: "Notion as a CMS" });
    const out = await html("https://notionic.dev");
    expect(out).toMatch(/<a href="https:\/\/notionic.dev"[^>]*data-slot="hover-card-trigger"/);
    expect(getLinkPreview).toHaveBeenCalledWith("https://notionic.dev");
  });

  it("leaves links unchanged when the page has no preview", async () => {
    getLinkPreview.mockResolvedValue(null);
    const out = await html("https://example.com");
    expect(out).toContain('<a href="https://example.com">link</a>');
    expect(out).not.toContain("hover-card");
  });

  it("never previews links to this site", async () => {
    expect(await html("https://nublson.com/about")).toBe('<a href="https://nublson.com/about">link</a>');
    expect(getLinkPreview).not.toHaveBeenCalled();
  });
});
