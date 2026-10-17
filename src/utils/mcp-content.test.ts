import type { PageMetadata, PostMetadata } from "@/utils/formatter";
import { describe, expect, it } from "vitest";
import {
  postToolItem,
  profileFromHero,
  searchPosts,
  type PostToolItem,
} from "./mcp-content";

function post(overrides: Partial<PostMetadata>): PostMetadata {
  return {
    id: "id",
    title: "",
    slug: "",
    description: "",
    descriptionRichText: [],
    published_date: "",
    updated_date: "",
    path: "",
    source: "",
    category: "",
    author: "",
    ...overrides,
  };
}

describe("postToolItem", () => {
  it("builds an item with absolute url and all fields", () => {
    const item = postToolItem(
      post({
        title: "Hello",
        slug: "hello",
        description: "Intro.",
        published_date: "2025-09-19",
        category: "Design",
      }),
      "https://nublson.com",
      "/writings",
    );

    expect(item).toEqual({
      title: "Hello",
      slug: "hello",
      url: "https://nublson.com/writings/hello",
      description: "Intro.",
      publishedDate: "2025-09-19",
      category: "Design",
    });
  });

  it("drops empty optional fields", () => {
    const item = postToolItem(
      post({ title: "Bare", slug: "bare" }),
      "https://nublson.com",
      "/projects",
    );

    expect(item).toEqual({
      title: "Bare",
      slug: "bare",
      url: "https://nublson.com/projects/bare",
      description: undefined,
      publishedDate: undefined,
      category: undefined,
    });
  });
});

describe("searchPosts", () => {
  const items: PostToolItem[] = [
    {
      title: "Design Systems",
      slug: "design-systems",
      url: "u1",
      description: "Tokens and components.",
      category: "Design",
    },
    {
      title: "Next.js Caching",
      slug: "nextjs-caching",
      url: "u2",
      description: "ISR deep dive.",
      category: "Engineering",
    },
  ];

  it("matches case-insensitively across title, description and category", () => {
    expect(searchPosts(items, "design")).toHaveLength(1);
    expect(searchPosts(items, "TOKENS")).toHaveLength(1);
    expect(searchPosts(items, "engineering")).toHaveLength(1);
  });

  it("returns empty for empty or whitespace queries", () => {
    expect(searchPosts(items, "")).toEqual([]);
    expect(searchPosts(items, "   ")).toEqual([]);
  });

  it("returns empty when nothing matches", () => {
    expect(searchPosts(items, "quantum")).toEqual([]);
  });
});

describe("profileFromHero", () => {
  const hero: PageMetadata = {
    id: "id",
    title: "Nubelson Fernandes",
    slug: "nubelson-fernandes",
    description: "Designer and developer.",
    descriptionRichText: [],
    modified_date: undefined,
    role: "Product Designer",
    location: "Lisbon, Portugal",
  };

  it("builds the profile with https-only social links", () => {
    const profile = profileFromHero(
      hero,
      [
        { label: "GitHub", url: "https://github.com/nublson" },
        { label: "Local", url: "http://localhost:3000" },
      ],
      "https://nublson.com",
    );

    expect(profile).toEqual({
      name: "Nubelson Fernandes",
      description: "Designer and developer.",
      role: "Product Designer",
      location: "Lisbon, Portugal",
      url: "https://nublson.com",
      social: [{ name: "GitHub", url: "https://github.com/nublson" }],
    });
  });

  it("drops empty optional fields", () => {
    const profile = profileFromHero(
      { ...hero, description: "", role: undefined, location: undefined },
      [],
      "https://nublson.com",
    );

    expect(profile.description).toBeUndefined();
    expect(profile.role).toBeUndefined();
    expect(profile.location).toBeUndefined();
  });
});
