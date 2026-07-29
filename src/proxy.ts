import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function acceptsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/markdown");
}

function withDiscoveryHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const origin = request.nextUrl.origin;
  const linkHeader = [
    `<${origin}/sitemap.xml>; rel="sitemap"`,
    `<${origin}/feed.xml>; rel="alternate"; type="application/rss+xml"; title="Blog & work"`,
    `<${origin}/blog/feed.xml>; rel="alternate"; type="application/rss+xml"; title="Blog"`,
    `<${origin}/work/feed.xml>; rel="alternate"; type="application/rss+xml"; title="Work"`,
    `<${origin}/llms.txt>; rel="help"; type="text/plain"; title="LLMs overview"`,
    `<${origin}/agents.txt>; rel="agent-policy"; type="text/plain"; title="Agent capabilities"`,
    `<${origin}/agents.json>; rel="agent-policy"; type="application/json"; title="Agent capabilities"`,
  ].join(", ");

  response.headers.set("Link", linkHeader);
  return response;
}

export function proxy(request: NextRequest) {
  if (acceptsMarkdown(request)) {
    const blogMatch = request.nextUrl.pathname.match(/^\/blog\/([^/]+)$/);
    if (blogMatch?.[1]) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/api/markdown/blog/${blogMatch[1]}`;
      return withDiscoveryHeaders(
        request,
        NextResponse.rewrite(rewriteUrl),
      );
    }

    const workMatch = request.nextUrl.pathname.match(/^\/work\/([^/]+)$/);
    if (workMatch?.[1]) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/api/markdown/work/${workMatch[1]}`;
      return withDiscoveryHeaders(
        request,
        NextResponse.rewrite(rewriteUrl),
      );
    }
  }

  return withDiscoveryHeaders(request, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
