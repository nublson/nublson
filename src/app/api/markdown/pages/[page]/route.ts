import {
  getDatabasePages,
  getPageBlocks,
  getPageData,
} from "@/services/notion";
import {
  formatDateTimeIso,
  formatPageMetadata,
  formatPostMetadata,
  type PostMetadata,
} from "@/utils/formatter";
import {
  estimateMarkdownTokens,
  notionBlocksToMarkdown,
  pageToMarkdown,
  type MarkdownPostLink,
} from "@/utils/pages-to-markdown";
import { NextResponse } from "next/server";

export const revalidate = 10;

const PAGES = ["home", "about", "blog", "work"] as const;

type MarkdownPage = (typeof PAGES)[number];

function isMarkdownPage(value: string): value is MarkdownPage {
  return (PAGES as readonly string[]).includes(value);
}

function toPostLinks(
  posts: PostMetadata[],
  base: string,
  pathPrefix: "/writings" | "/projects",
): MarkdownPostLink[] {
  return posts.map((post) => ({
    title: post.title,
    url: `${base}${pathPrefix}/${post.slug}`,
    description: post.description || undefined,
    publishedDate: post.published_date
      ? formatDateTimeIso(post.published_date)
      : undefined,
  }));
}

async function heroFor(pageId: string) {
  return formatPageMetadata(await getPageData(pageId));
}

async function bodyFor(pageId: string): Promise<string> {
  return notionBlocksToMarkdown(await getPageBlocks(pageId));
}

async function buildPageMarkdown(
  page: MarkdownPage,
  base: string,
): Promise<string> {
  const contentDb = process.env.NOTION_DATABASE_CONTENT_ID!;

  switch (page) {
    case "home": {
      const [hero, projectPages, blogPages] = await Promise.all([
        heroFor(process.env.NOTION_PAGE_HOME_ID!),
        getDatabasePages(contentDb, "Project", 3),
        getDatabasePages(contentDb, "Blog", 4),
      ]);
      return pageToMarkdown({
        hero,
        sections: [
          {
            heading: "Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/projects"),
          },
          {
            heading: "Writing",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/writings"),
          },
        ],
      });
    }
    case "about": {
      const pageId = process.env.NOTION_PAGE_ABOUT_ID!;
      const [hero, body] = await Promise.all([heroFor(pageId), bodyFor(pageId)]);
      return pageToMarkdown({ hero, body });
    }
    case "blog": {
      const [hero, blogPages] = await Promise.all([
        heroFor(process.env.NOTION_PAGE_BLOG_ID!),
        getDatabasePages(contentDb, "Blog", 20),
      ]);
      return pageToMarkdown({
        hero,
        sections: [
          {
            heading: "Writing",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/writings"),
          },
        ],
      });
    }
    case "work": {
      const pageId = process.env.NOTION_PAGE_WORK_ID!;
      const [hero, body, projectPages] = await Promise.all([
        heroFor(pageId),
        bodyFor(pageId),
        getDatabasePages(contentDb, "Project", 20),
      ]);
      return pageToMarkdown({
        hero,
        body,
        sections: [
          {
            heading: "Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/projects"),
          },
        ],
      });
    }
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;

  if (!isMarkdownPage(page)) {
    return NextResponse.json({ message: "Invalid page" }, { status: 400 });
  }

  const base = process.env.BASE_URL!.replace(/\/$/, "");
  const markdown = await buildPageMarkdown(page, base);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      Vary: "Accept",
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
    },
  });
}
