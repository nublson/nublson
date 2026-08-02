import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const skillsDir = path.join(process.cwd(), "public/.well-known/agent-skills");

type SkillEntry = {
  name: string;
  type: string;
  description: string;
  url: string;
  digest: string;
};

function loadIndex(): { $schema: string; skills: SkillEntry[] } {
  return JSON.parse(readFileSync(path.join(skillsDir, "index.json"), "utf8"));
}

describe("agent-skills discovery index", () => {
  it("declares the v0.2.0 schema and at least one skill", () => {
    const index = loadIndex();
    expect(index.$schema).toBe(
      "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    );
    expect(index.skills.length).toBeGreaterThan(0);
  });

  it("every entry is a valid skill-md skill with a matching digest", () => {
    for (const skill of loadIndex().skills) {
      expect(skill.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(skill.name.length).toBeLessThanOrEqual(64);
      expect(skill.type).toBe("skill-md");
      expect(skill.description.length).toBeLessThanOrEqual(1024);

      const url = new URL(skill.url);
      expect(url.host).toBe("nublson.com");
      expect(url.pathname).toMatch(/^\/\.well-known\/agent-skills\//);

      const relativePath = url.pathname.replace(
        /^\/\.well-known\/agent-skills\//,
        "",
      );
      const file = readFileSync(path.join(skillsDir, relativePath));

      const digest = createHash("sha256").update(file).digest("hex");
      expect(skill.digest).toBe(`sha256:${digest}`);

      const descriptionLine = file
        .toString("utf8")
        .match(/^description:\s*(.+)$/m);
      expect(descriptionLine?.[1]?.trim()).toBe(skill.description);
    }
  });
});
