import {
  getDatabasePages,
  getPageBlocks,
  getPageData,
} from "@/services/notion";
import { blocksToMarkdown } from "@/utils/blocks-to-markdown";
import {
  formatDateTimeIso,
  formatPageMetadata,
  formatPostMetadata,
  type PostMetadata,
} from "@/utils/formatter";
import {
  estimateMarkdownTokens,
  pageToMarkdown,
  type MarkdownPostLink,
  type MarkdownSection,
} from "@/utils/pages-to-markdown";
import { NextResponse } from "next/server";

export const revalidate = 10;

const PAGES = ["home", "about", "blog", "work", "gears"] as const;

type MarkdownPage = (typeof PAGES)[number];

function isMarkdownPage(value: string): value is MarkdownPage {
  return (PAGES as readonly string[]).includes(value);
}

function toPostLinks(
  posts: PostMetadata[],
  base: string,
  pathPrefix: "/blog" | "/work",
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

function gearSections(gears: PostMetadata[]): MarkdownSection[] {
  const categories = [...new Set(gears.map((gear) => gear.category))];
  return categories.map((category) => ({
    heading: category || "Other",
    posts: gears
      .filter((gear) => gear.category === category)
      .map((gear) => ({
        title: gear.title,
        url: gear.path || undefined,
        description: gear.description || undefined,
      })),
  }));
}

async function heroFor(pageId: string) {
  return formatPageMetadata(await getPageData(pageId));
}

async function bodyFor(pageId: string): Promise<string> {
  return blocksToMarkdown(await getPageBlocks(pageId));
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
            heading: "Latest Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/work"),
          },
          {
            heading: "Latest Posts",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/blog"),
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
            heading: "Latest Posts",
            posts: toPostLinks(formatPostMetadata(blogPages), base, "/blog"),
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
            heading: "Latest Projects",
            posts: toPostLinks(formatPostMetadata(projectPages), base, "/work"),
          },
        ],
      });
    }
    case "gears": {
      const pageId = process.env.NOTION_PAGE_GEARS_ID!;
      const [hero, body, gearPages] = await Promise.all([
        heroFor(pageId),
        bodyFor(pageId),
        getDatabasePages(
          process.env.NOTION_DATABASE_GEARS_ID!,
          undefined,
          50,
          [
            { property: "Category", direction: "ascending" },
            { property: "State", direction: "descending" },
            { property: "Updated", direction: "ascending" },
          ],
          ["title", "Description", "Category", "Path"],
        ),
      ]);
      return pageToMarkdown({
        hero,
        body,
        sections: gearSections(formatPostMetadata(gearPages)),
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
