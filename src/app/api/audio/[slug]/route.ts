import { getOrGenerateAudioUrl } from "@/services/audio";
import { getDatabasePageBySlug } from "@/services/notion";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    slug,
  );

  if (!found) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const audioUrl = await getOrGenerateAudioUrl(
      found.page.id,
      slug,
      found.metadata,
    );
    return NextResponse.redirect(audioUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
