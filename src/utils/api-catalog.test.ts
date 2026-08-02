import { describe, expect, it } from "vitest";
import { buildApiCatalog } from "./api-catalog";

describe("buildApiCatalog", () => {
  const catalog = buildApiCatalog("https://nublson.com");

  it("describes the markdown API with service-desc and service-doc", () => {
    expect(catalog.linkset[0]).toEqual({
      anchor: "https://nublson.com/api/markdown",
      "service-desc": [
        {
          href: "https://nublson.com/openapi.json",
          type: "application/openapi+json",
        },
      ],
      "service-doc": [
        { href: "https://nublson.com/llms.txt", type: "text/plain" },
      ],
    });
  });

  it("describes the MCP endpoint with its server card", () => {
    expect(catalog.linkset[1]).toEqual({
      anchor: "https://nublson.com/api/mcp",
      "service-desc": [
        {
          href: "https://nublson.com/.well-known/mcp/server-card.json",
          type: "application/json",
        },
      ],
      "service-doc": [
        { href: "https://nublson.com/agents.txt", type: "text/plain" },
      ],
    });
  });

  it("has exactly two entries and normalizes trailing slashes", () => {
    expect(catalog.linkset).toHaveLength(2);
    expect(buildApiCatalog("https://nublson.com/").linkset[0]?.anchor).toBe(
      "https://nublson.com/api/markdown",
    );
  });
});
