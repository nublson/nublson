import { describe, expect, it } from "vitest";
import { findSocialProfile, socialProfiles } from "./social-profiles";

describe("findSocialProfile", () => {
  it("matches a profile by hostname", () => {
    expect(findSocialProfile("https://github.com/nublson/purl")?.label).toBe(
      "GitHub",
    );
  });

  it("ignores www. and letter case", () => {
    expect(findSocialProfile("https://WWW.GitHub.com/x")?.label).toBe("GitHub");
    expect(findSocialProfile("https://youtube.com/@nublson")?.label).toBe(
      "YouTube",
    );
  });

  it("recognises Substack links without adding Substack to the Home profiles", () => {
    expect(findSocialProfile("https://nublson.substack.com/p/hello")?.label).toBe(
      "Substack",
    );
    expect(socialProfiles.map((p) => p.label)).not.toContain("Substack");
  });

  it("returns null for unknown or malformed URLs", () => {
    expect(findSocialProfile("https://example.com")).toBeNull();
    expect(findSocialProfile("not a url")).toBeNull();
  });
});

describe("socialProfiles", () => {
  it("lists every profile from social.json", () => {
    expect(socialProfiles.map((p) => p.label)).toEqual([
      "Instagram",
      "YouTube",
      "GitHub",
    ]);
  });
});
