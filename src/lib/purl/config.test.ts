import { afterEach, describe, expect, it, vi } from "vitest";
import { getPurlConfig } from "./config";

describe("getPurlConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to purl.live with no client id", () => {
    vi.stubEnv("NEXT_PUBLIC_PURL_URL", "");
    vi.stubEnv("NEXT_PUBLIC_PURL_CLIENT_ID", "");
    const config = getPurlConfig();
    expect(config.baseUrl).toBe("https://purl.live");
    expect(config.clientId).toBeNull();
  });

  it("builds endpoint URLs from the base URL without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_PURL_URL", "https://x.test/");
    vi.stubEnv("NEXT_PUBLIC_PURL_CLIENT_ID", "portfolio");
    const config = getPurlConfig();
    expect(config.authorizeUrl).toBe("https://x.test/api/auth/mcp/authorize");
    expect(config.tokenUrl).toBe("https://x.test/api/auth/mcp/token");
    expect(config.saveUrl).toBe("https://x.test/api/v1/links/save");
    expect(config.clientId).toBe("portfolio");
  });

  it("requests the save scope and redirects to the site's callback", () => {
    const config = getPurlConfig();
    expect(config.scope).toBe("links:save offline_access");
    expect(config.redirectUri).toBe(`${window.location.origin}/purl/callback`);
  });
});
