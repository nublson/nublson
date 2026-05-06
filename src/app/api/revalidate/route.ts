import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: { type?: "blog" | "work"; slug?: string } = {};
  const rawBody = await request.text();

  if (rawBody.trim().length > 0) {
    try {
      const parsedBody = JSON.parse(rawBody) as unknown;

      if (parsedBody && typeof parsedBody === "object") {
        body = parsedBody as { type?: "blog" | "work"; slug?: string };
      } else {
        return NextResponse.json(
          { message: "Invalid JSON body: expected an object" },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 },
      );
    }
  }

  if (body.type && body.slug) {
    const path = body.type === "blog" ? `/blog/${body.slug}` : `/work/${body.slug}`;
    revalidatePath(path, "page");
  } else {
    revalidateTag("notion-blocks", "default");
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
