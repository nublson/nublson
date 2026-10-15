import { describe, expect, it } from "vitest";
import {
  findSocialProfile,
  socialHandle,
  socialProfiles,
} from "./social-profiles";

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

  it("returns null for unknown or malformed URLs", () => {
    expect(findSocialProfile("https://example.com")).toBeNull();
    expect(findSocialProfile("not a url")).toBeNull();
  });
});

describe("socialHandle", () => {
  it("returns the last path segment as an @handle", () => {
    expect(socialHandle("https://www.youtube.com/@nublson")).toBe("@nublson");
    expect(socialHandle("https://github.com/nublson")).toBe("@nublson");
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
