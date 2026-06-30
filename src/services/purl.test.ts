import { afterEach, describe, expect, it, vi } from "vitest";
import { savePurlLink } from "./purl";

const mockLink = {
  id: "clxyz123",
  url: "https://example.com/article",
  title: "An interesting article",
  description: null,
  favicon: "https://example.com/favicon.ico",
  thumbnail: null,
  domain: "example.com",
  contentType: "WEB" as const,
  ingestStatus: "PENDING" as const,
  createdAt: "2025-06-05T12:00:00.000Z",
};

describe("savePurlLink", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("saves a link via the Purl v1 API", async () => {
    vi.stubEnv("PURL_API_KEY", "purl_test_key");
    vi.stubEnv("PURL_URL", "https://purl.nublson.com");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => mockLink,
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await savePurlLink("https://example.com/article");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://purl.nublson.com/api/v1/links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer purl_test_key",
        },
        body: JSON.stringify({ url: "https://example.com/article" }),
      },
    );
    expect(result).toEqual(mockLink);
  });

  it("throws PurlApiError when the API returns an error", async () => {
    vi.stubEnv("PURL_API_KEY", "purl_test_key");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 402,
        json: async () => ({
          error: "Plan limit reached",
          code: "LIMIT_REACHED",
        }),
      }),
    );

    await expect(savePurlLink("https://example.com/article")).rejects.toMatchObject({
      name: "PurlApiError",
      status: 402,
      message: "Plan limit reached",
    });
  });

  it("throws when PURL_API_KEY is missing", async () => {
    await expect(savePurlLink("https://example.com/article")).rejects.toThrow(
      "PURL_API_KEY is not configured",
    );
  });
});
