import { toAbsoluteAssetUrl } from "@/lib/notion-image";
import type { BlockWithChildren } from "@/services/notion";
import { blocksToMarkdown } from "notionic/markdown";

export type MarkdownHero = {
  title: string;
  description: string;
  role?: string;
  location?: string;
};

export type MarkdownPostLink = {
  title: string;
  url?: string;
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
  const link = post.url ? `[${post.title}](${post.url})` : post.title;
  return `- ${link}${date}${description}`;
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

function escapeYamlValue(value: string): string {
  if (/[:#{}[\],&*?|>!%@`"'\n]/.test(value) || value.trim() !== value) {
    return JSON.stringify(value);
  }
  return value;
}

/**
 * Notion page body as Markdown. Uploaded images already point to the
 * `/api/notion-image` proxy (see `getPageBlocks`); they are made absolute here
 * so the Markdown works off-site. Notion's heading 1 becomes `##`.
 */
export function notionBlocksToMarkdown(blocks: BlockWithChildren[]): string {
  return blocksToMarkdown(blocks, {
    transformFileUrl: ({ url }) => toAbsoluteAssetUrl(url) ?? url,
  });
}

export function postToMarkdown({
  title,
  description,
  publishedDate,
  author,
  category,
  blocks,
}: {
  title: string;
  description: string;
  publishedDate: string;
  author: string;
  category?: string;
  blocks: BlockWithChildren[];
}): string {
  const frontMatter = [
    "---",
    `title: ${escapeYamlValue(title)}`,
    `description: ${escapeYamlValue(description)}`,
    `published: ${escapeYamlValue(publishedDate)}`,
    `author: ${escapeYamlValue(author)}`,
    ...(category ? [`category: ${escapeYamlValue(category)}`] : []),
    "---",
  ].join("\n");

  const body = notionBlocksToMarkdown(blocks);
  return [frontMatter, `# ${title}`, body].filter(Boolean).join("\n\n") + "\n";
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}
