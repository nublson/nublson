import {
  isNotionId,
  isNotionImageResource,
  type NotionImageResource,
} from "@/lib/notion-image";
import { resolveNotionImageUpstream } from "@/services/notion";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/** CDN + browser: keep bytes warm well beyond Notion's ~1h signed URL TTL. */
const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

async function fetchUpstreamImage(url: string): Promise<Response> {
  const upstream = await fetch(url, {
    // Signed URLs must not be reused from Next's data cache after expiry.
    cache: "no-store",
    headers: {
      // Some Notion CDNs behave better with a normal browser UA.
      "User-Agent": "nublson-notion-image-proxy/1.0",
      Accept: "image/*,*/*;q=0.8",
    },
  });
  return upstream;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const resourceParam = request.nextUrl.searchParams.get("resource") ?? "";
  const id = request.nextUrl.searchParams.get("id") ?? "";

  if (!isNotionImageResource(resourceParam) || !isNotionId(id)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const resource: NotionImageResource = resourceParam;

  try {
    let { url } = await resolveNotionImageUpstream(resource, id);
    let upstream = await fetchUpstreamImage(url);

    // Rare race: signature expires between resolve and fetch — retry once.
    if (upstream.status === 403 || upstream.status === 401) {
      ({ url } = await resolveNotionImageUpstream(resource, id));
      upstream = await fetchUpstreamImage(url);
    }

    if (!upstream.ok) {
      return new NextResponse("Upstream image unavailable", {
        status: 502,
      });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const bytes = await upstream.arrayBuffer();

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": CACHE_CONTROL,
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
