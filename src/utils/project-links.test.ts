import { describe, expect, it } from "vitest";
import type { PostMetadata } from "./formatter";
import { projectHref, projectPublicUrl } from "./project-links";
import { rssItemsFromPosts } from "./rss";

const project = (path: string, source: string) =>
  ({
    title: "Purl",
    slug: "purl",
    path,
    source,
    description: "",
    published_date: "2026-05-11",
    updated_date: "2026-05-11T00:00:00.000Z",
  }) as PostMetadata;

describe("projectHref", () => {
  it("prefers the live site", () => {
    expect(projectHref(project("https://purl.so", "https://github.com/x"))).toBe(
      "https://purl.so",
    );
  });

  it("falls back to the source code", () => {
    expect(projectHref(project("", "https://github.com/x"))).toBe(
      "https://github.com/x",
    );
  });

  it("returns undefined when there is neither, ignoring whitespace", () => {
    expect(projectHref(project("  ", ""))).toBeUndefined();
  });
});

describe("projectPublicUrl", () => {
  it("uses the project link when there is one", () => {
    expect(
      projectPublicUrl("https://nublson.com/", project("https://purl.so", "")),
    ).toBe("https://purl.so");
  });

  it("falls back to a unique anchor on the projects page", () => {
    expect(projectPublicUrl("https://nublson.com/", project("", ""))).toBe(
      "https://nublson.com/projects#purl",
    );
  });
});

describe("rssItemsFromPosts for projects", () => {
  it("links project items to the project itself, not a removed page", () => {
    const [item] = rssItemsFromPosts("https://nublson.com", "/projects", [
      project("https://purl.so", ""),
    ]);
    expect(item.link).toBe("https://purl.so");
  });

  it("keeps writing items on the site", () => {
    const [item] = rssItemsFromPosts("https://nublson.com", "/writings", [
      project("https://purl.so", ""),
    ]);
    expect(item.link).toBe("https://nublson.com/writings/purl");
  });
});
