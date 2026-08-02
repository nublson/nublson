import { describe, expect, it } from "vitest";
import {
  buildAgentsJson,
  buildAgentsTxt,
  getAgentsDiscovery,
} from "./agents-discovery";

describe("agents-discovery", () => {
  const discovery = getAgentsDiscovery("https://nublson.com");

  it("builds agents.txt with capability declarations", () => {
    const txt = buildAgentsTxt(discovery);

    expect(txt).toContain("# agents.txt");
    expect(txt).toContain("https://agents-txt.com");
    expect(txt).toContain("JSON: https://nublson.com/agents.json");
    expect(txt).toContain(
      "MCP: https://nublson.com/.well-known/mcp/server-card.json",
    );
    expect(txt).toContain("MCP-Endpoint: https://nublson.com/api/mcp");
    expect(txt).toContain(
      "Skills: https://nublson.com/.well-known/agent-skills/index.json",
    );
    expect(txt).toContain("A2A: https://nublson.com/.well-known/agent.json");
  });

  it("builds agents.json with site metadata and capability blocks", () => {
    const json = buildAgentsJson(discovery);

    expect(json.version).toBe("1.0");
    expect(json.site).toEqual({
      name: "Nubelson Fernandes",
      url: "https://nublson.com",
      description: "Designer and developer sharing work, writing, and tools.",
    });
    expect(json.mcp).toHaveLength(1);
    expect(json.mcp[0]).toMatchObject({
      url: "https://nublson.com/.well-known/mcp/server-card.json",
      endpoint: "https://nublson.com/api/mcp",
      transport: "streamable-http",
    });
    expect(json.skills).toHaveLength(1);
    expect(json.a2a).toHaveLength(1);
    expect("payments" in json).toBe(false);
    expect("authorization" in json).toBe(false);
  });

  it("normalizes trailing slashes in base URL", () => {
    const normalized = getAgentsDiscovery("https://nublson.com/");

    expect(normalized.baseUrl).toBe("https://nublson.com");
    expect(normalized.mcpCardUrl).toBe(
      "https://nublson.com/.well-known/mcp/server-card.json",
    );
  });
});
