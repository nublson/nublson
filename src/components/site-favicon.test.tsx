import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteFavicon } from "./site-favicon";

const getFavicon = vi.hoisted(() => vi.fn());
vi.mock("@/services/favicon", () => ({ getFavicon }));

/** Renders the async server component's output. */
async function renderFavicon(href: string) {
  return render(<p>{await SiteFavicon({ href })}</p>).container;
}

beforeEach(() => {
  vi.stubEnv("BASE_URL", "https://nublson.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
  getFavicon.mockReset();
});

describe("SiteFavicon", () => {
  it("inlines the site's favicon, hidden from screen readers", async () => {
    getFavicon.mockResolvedValue("data:image/png;base64,AAAA");

    const container = await renderFavicon("https://sonner.emilkowal.ski/toast");

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "data:image/png;base64,AAAA");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(getFavicon).toHaveBeenCalledWith("sonner.emilkowal.ski");
  });

  it("draws a themed globe when the site has no favicon", async () => {
    getFavicon.mockResolvedValue(null);

    const container = await renderFavicon("https://example.com");

    expect(container.querySelector("img")).toBeNull();
    const globe = container.querySelector("svg");
    expect(globe).not.toBeNull();
    expect(globe?.getAttribute("class")).toContain("text-muted-foreground");
  });

  it("shows nothing for links to this site", async () => {
    const container = await renderFavicon("https://nublson.com/writings/x");

    expect(container.querySelector("img, svg")).toBeNull();
    expect(getFavicon).not.toHaveBeenCalled();
  });
});
