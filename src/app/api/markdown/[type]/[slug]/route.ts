import {
  getDatabasePageBySlug,
  getPageBlocks,
} from "@/services/notion";
import { postToMarkdown } from "@/utils/blocks-to-markdown";
import { formatDateTimeIso } from "@/utils/formatter";
import { NextResponse } from "next/server";

export const revalidate = 10;

const MEDIA_BY_TYPE = {
  blog: "Blog",
  work: "Project",
} as const;

type MarkdownType = keyof typeof MEDIA_BY_TYPE;

function isMarkdownType(value: string): value is MarkdownType {
  return value in MEDIA_BY_TYPE;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> },
) {
  const { type, slug } = await params;

  if (!isMarkdownType(type)) {
    return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }

  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    MEDIA_BY_TYPE[type],
    slug,
  );

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const blocks = await getPageBlocks(found.page.id);
  const markdown = postToMarkdown({
    title: found.metadata.title,
    description: found.metadata.description,
    publishedDate: formatDateTimeIso(found.metadata.published_date),
    author: found.metadata.author,
    category: found.metadata.category || undefined,
    blocks,
  });

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "s-maxage=10, stale-while-revalidate=59",
      Vary: "Accept",
    },
  });
}
