import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const authMd = readFileSync(join(process.cwd(), "public/auth.md"), "utf8");

describe("public/auth.md", () => {
  it("opens with an H1 containing auth.md", () => {
    const h1 = authMd.split("\n").find((line) => line.startsWith("# "));
    expect(h1?.toLowerCase()).toContain("auth.md");
  });

  it("identifies the agent audience it is written for", () => {
    expect(authMd).toMatch(/agent/i);
    expect(authMd).toMatch(/MCP client|autonomous agent/i);
  });

  it("states the registration position explicitly rather than omitting it", () => {
    expect(authMd).toMatch(/## Registration/i);
    expect(authMd).toMatch(/no registration|not required/i);
  });

  it("documents the supported authentication methods", () => {
    expect(authMd).toMatch(/## Authentication methods/i);
    expect(authMd).toMatch(/anonymous/i);
  });

  it("explains credential use, including that none are accepted", () => {
    expect(authMd).toMatch(/## Credentials/i);
    expect(authMd).toMatch(/no credentials|does not accept/i);
  });

  it("lists the agent-facing surfaces an agent can reach", () => {
    for (const surface of ["/api/mcp", "/.well-known/ard.json", "/llms.txt"]) {
      expect(authMd).toContain(surface);
    }
  });

  it("does not claim OAuth support the site does not implement", () => {
    expect(authMd).not.toMatch(/oauth-authorization-server|register_uri/i);
  });
});
