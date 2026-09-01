import { describe, expect, it } from "vitest";
import { buildAiCatalog } from "./ai-catalog";

describe("buildAiCatalog", () => {
  const catalog = buildAiCatalog("https://nublson.com");

  it("declares the ARD spec version", () => {
    expect(catalog.specVersion).toBe("1.0");
  });

  it("catalogs five capability entries", () => {
    expect(catalog.entries).toHaveLength(5);
  });

  it("identifies the host with a did:web identifier and docs link", () => {
    expect(catalog.host).toEqual({
      displayName: "Nubelson Fernandes",
      identifier: "did:web:nublson.com",
      documentationUrl: "https://nublson.com/llms.txt",
    });
  });

  it("describes the MCP server card entry", () => {
    const entry = catalog.entries.find(
      (item) => item.identifier === "urn:air:nublson.com:mcp:content",
    );

    expect(entry).toMatchObject({
      displayName: "nublson.com Content MCP Server",
      type: "application/mcp-server-card+json",
      url: "https://nublson.com/.well-known/mcp/server-card.json",
    });
  });

  it("points every entry at a resource the site already serves", () => {
    expect(catalog.entries.map((entry) => entry.url)).toEqual([
      "https://nublson.com/.well-known/mcp/server-card.json",
      "https://nublson.com/.well-known/agent.json",
      "https://nublson.com/.well-known/agent-skills/index.json",
      "https://nublson.com/openapi.json",
      "https://nublson.com/llms.txt",
    ]);
  });

  it("gives every entry an urn:air identifier scoped to the domain", () => {
    expect(catalog.entries.length).toBeGreaterThan(0);

    for (const entry of catalog.entries) {
      expect(entry.identifier).toMatch(
        /^urn:air:nublson\.com:[a-z]+:[a-z-]+$/,
      );
    }
  });

  it("gives every entry a display name, description and IANA media type", () => {
    expect(catalog.entries.length).toBeGreaterThan(0);

    for (const entry of catalog.entries) {
      expect(entry.displayName.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
      expect(entry.type).toMatch(/^[a-z]+\/[a-z0-9.+-]+$/);
    }
  });

  it("gives every entry exactly one of url or data", () => {
    expect(catalog.entries.length).toBeGreaterThan(0);

    for (const entry of catalog.entries) {
      const record = entry as Record<string, unknown>;
      expect(["url", "data"].filter((key) => key in record)).toHaveLength(1);
    }
  });

  it("gives every entry 2-5 representative queries for semantic indexing", () => {
    expect(catalog.entries.length).toBeGreaterThan(0);

    for (const entry of catalog.entries) {
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("normalizes trailing slashes on the base URL", () => {
    expect(buildAiCatalog("https://nublson.com/").entries[0]?.url).toBe(
      "https://nublson.com/.well-known/mcp/server-card.json",
    );
  });
});
