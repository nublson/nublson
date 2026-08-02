import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function request(path: string, accept?: string): NextRequest {
  return new NextRequest(`https://nublson.com${path}`, {
    headers: accept ? { accept } : {},
  });
}

function rewriteTarget(response: Response): string | null {
  return response.headers.get("x-middleware-rewrite");
}

describe("proxy markdown negotiation", () => {
  it.each([
    ["/", "home"],
    ["/about", "about"],
    ["/blog", "blog"],
    ["/work", "work"],
    ["/gears", "gears"],
  ])("rewrites %s to pages/%s for text/markdown", (path, page) => {
    const response = proxy(request(path, "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      `https://nublson.com/api/markdown/pages/${page}`,
    );
  });

  it("rewrites blog post paths to the post markdown route", () => {
    const response = proxy(request("/blog/my-post", "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/blog/my-post",
    );
  });

  it("rewrites work post paths to the post markdown route", () => {
    const response = proxy(request("/work/my-project", "text/markdown"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/work/my-project",
    );
  });

  it("accepts markdown among multiple Accept values", () => {
    const response = proxy(request("/", "text/markdown, text/html;q=0.9"));
    expect(rewriteTarget(response)).toBe(
      "https://nublson.com/api/markdown/pages/home",
    );
  });

  it("does not rewrite HTML requests", () => {
    const response = proxy(request("/", "text/html"));
    expect(rewriteTarget(response)).toBeNull();
  });

  it("does not rewrite unknown paths even for markdown requests", () => {
    const response = proxy(request("/nonexistent", "text/markdown"));
    expect(rewriteTarget(response)).toBeNull();
  });

  it("sets Vary: Accept on negotiated paths for HTML responses", () => {
    const response = proxy(request("/", "text/html"));
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("sets Vary: Accept on post paths", () => {
    const response = proxy(request("/blog/my-post", "text/html"));
    expect(response.headers.get("vary")).toBe("Accept");
  });

  it("does not set Vary on non-negotiated paths", () => {
    const response = proxy(request("/feed.xml", "text/html"));
    expect(response.headers.get("vary")).toBeNull();
  });

  it("keeps discovery Link headers on every response", () => {
    const response = proxy(request("/", "text/html"));
    expect(response.headers.get("link")).toContain(
      'rel="sitemap"',
    );
  });
});
