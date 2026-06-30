import { PurlApiError, savePurlLink } from "@/services/purl";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 },
    );
  }

  const { url } = body as Record<string, unknown>;

  if (typeof url !== "string" || url.trim() === "") {
    return NextResponse.json(
      { error: "url is required and must be a non-empty string" },
      { status: 400 },
    );
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "url must be a valid URL" }, { status: 400 });
  }

  try {
    const link = await savePurlLink(url);
    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    if (err instanceof PurlApiError) {
      return NextResponse.json(
        {
          error: err.body?.error ?? err.message,
          code: err.body?.code,
          feature: err.body?.feature,
        },
        { status: err.status },
      );
    }

    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
