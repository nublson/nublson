import type { PageMetadata, PostMetadata } from "@/utils/formatter";

export type PostToolItem = {
  title: string;
  slug: string;
  url: string;
  description?: string;
  publishedDate?: string;
  category?: string;
};

export type Profile = {
  name: string;
  description?: string;
  role?: string;
  location?: string;
  url: string;
  social: { name: string; url: string }[];
};

export function postToolItem(
  post: PostMetadata,
  baseUrl: string,
  pathPrefix: "/writings" | "/projects",
): PostToolItem {
  return {
    title: post.title,
    slug: post.slug,
    url: `${baseUrl}${pathPrefix}/${post.slug}`,
    description: post.description || undefined,
    publishedDate: post.published_date || undefined,
    category: post.category || undefined,
  };
}

export function searchPosts(
  items: PostToolItem[],
  query: string,
): PostToolItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return items.filter((item) =>
    [item.title, item.description, item.category].some((field) =>
      field?.toLowerCase().includes(needle),
    ),
  );
}

export function profileFromHero(
  hero: PageMetadata,
  social: { label: string; url: string }[],
  baseUrl: string,
): Profile {
  return {
    name: hero.title,
    description: hero.description || undefined,
    role: hero.role || undefined,
    location: hero.location || undefined,
    url: baseUrl,
    social: social
      .filter((item) => item.url.startsWith("https://"))
      .map((item) => ({ name: item.label, url: item.url })),
  };
}
