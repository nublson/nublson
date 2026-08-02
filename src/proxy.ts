import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function acceptsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  return accept
    .split(",")
    .some((type) => type.trim().toLowerCase().startsWith("text/markdown"));
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

const PAGE_MARKDOWN_PATHS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/blog": "blog",
  "/work": "work",
  "/gears": "gears",
};

const POST_PATH_PATTERN = /^\/(blog|work)\/([^/]+)$/;

function markdownRewritePath(pathname: string): string | null {
  const page = PAGE_MARKDOWN_PATHS[pathname];
  if (page) return `/api/markdown/pages/${page}`;

  const postMatch = pathname.match(POST_PATH_PATTERN);
  if (postMatch) return `/api/markdown/${postMatch[1]}/${postMatch[2]}`;

  return null;
}

function isNegotiatedPath(pathname: string): boolean {
  return pathname in PAGE_MARKDOWN_PATHS || POST_PATH_PATTERN.test(pathname);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response: NextResponse | undefined;

  if (acceptsMarkdown(request)) {
    const rewritePath = markdownRewritePath(pathname);
    if (rewritePath) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = rewritePath;
      response = NextResponse.rewrite(rewriteUrl);
    }
  }

  response ??= NextResponse.next();

  if (isNegotiatedPath(pathname)) {
    response.headers.set("Vary", "Accept");
  }

  return withDiscoveryHeaders(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
