import { getOrGenerateAudio } from "@/services/audio";
import { getDatabasePageBySlug } from "@/services/notion";
import { NextResponse } from "next/server";

// A post's first-ever narration streams live while it caches in the
// background — both need headroom beyond the platform's default timeout.
export const maxDuration = 120;

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
    const result = await getOrGenerateAudio(found.page.id, slug, found.metadata);

    if (result.type === "redirect") {
      return NextResponse.redirect(result.url);
    }

    return new Response(result.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(`[speech-mode] audio generation failed for "${slug}":`, err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
