import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    type?: "blog" | "work";
    slug?: string;
  };

  if (body.type && body.slug) {
    const path = body.type === "blog" ? `/blog/${body.slug}` : `/work/${body.slug}`;
    revalidatePath(path, "page");
  } else {
    revalidateTag("notion-blocks", "default");
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
