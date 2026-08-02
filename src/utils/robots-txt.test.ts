import { describe, expect, it } from "vitest";
import { buildRobotsTxt, CONTENT_SIGNAL } from "./robots-txt";

describe("buildRobotsTxt", () => {
  const txt = buildRobotsTxt("https://nublson.com");

  it("keeps the wildcard allow group with the Content-Signal line", () => {
    expect(txt).toContain(
      "User-Agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n",
    );
  });

  it("keeps the named AI bot allow group with its own Content-Signal line", () => {
    expect(txt).toContain(
      "User-Agent: GPTBot\nUser-Agent: ClaudeBot\nUser-Agent: PerplexityBot\nUser-Agent: anthropic-ai\nUser-Agent: Bytespider\nUser-Agent: Amazonbot\nUser-Agent: Meta-ExternalFetcher\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n",
    );
  });

  it("keeps the sitemap line and normalizes trailing slashes", () => {
    expect(txt).toContain("Sitemap: https://nublson.com/sitemap.xml");
    expect(buildRobotsTxt("https://nublson.com/")).toContain(
      "Sitemap: https://nublson.com/sitemap.xml",
    );
  });

  it("ends with a single trailing newline", () => {
    expect(txt.endsWith("\n")).toBe(true);
    expect(txt.endsWith("\n\n")).toBe(false);
  });

  it("exports the agreed content signal", () => {
    expect(CONTENT_SIGNAL).toBe("search=yes, ai-input=yes, ai-train=yes");
  });
});
