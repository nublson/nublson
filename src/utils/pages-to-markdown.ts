export type MarkdownHero = {
  title: string;
  description: string;
  role?: string;
  location?: string;
};

export type MarkdownPostLink = {
  title: string;
  url: string;
  description?: string;
  publishedDate?: string;
};

export type MarkdownSection = {
  heading: string;
  posts: MarkdownPostLink[];
};

function postLine(post: MarkdownPostLink): string {
  const date = post.publishedDate ? ` (${post.publishedDate.slice(0, 10)})` : "";
  const description = post.description ? `: ${post.description}` : "";
  return `- [${post.title}](${post.url})${date}${description}`;
}

export function pageToMarkdown({
  hero,
  body,
  sections = [],
}: {
  hero: MarkdownHero;
  body?: string;
  sections?: MarkdownSection[];
}): string {
  const parts: string[] = [`# ${hero.title}`];

  if (hero.description) parts.push(`> ${hero.description}`);

  const byline = [hero.role, hero.location].filter(Boolean).join(" — ");
  if (byline) parts.push(byline);

  if (body) parts.push(body.trim());

  for (const section of sections) {
    if (section.posts.length === 0) continue;
    parts.push(`## ${section.heading}`);
    parts.push(section.posts.map(postLine).join("\n"));
  }

  return `${parts.join("\n\n")}\n`;
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}
