import { describe, expect, it, vi } from "vitest";
import { getWebmcpTools, type ModelContextTool } from "./webmcp-tools";

const LLMS_TXT = [
  "# Nubelson Fernandes",
  "## Blog",
  "- [Design Systems](https://nublson.com/blog/design-systems): Tokens and components.",
  "- [Next.js Caching](https://nublson.com/blog/nextjs-caching): ISR deep dive.",
].join("\n");

function okResponse(body: string): Response {
  return new Response(body, { status: 200 });
}

function toolByName(tools: ModelContextTool[], name: string): ModelContextTool {
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool) throw new Error(`missing tool ${name}`);
  return tool;
}

describe("getWebmcpTools", () => {
  it("exposes exactly the three read-only tools", () => {
    const tools = getWebmcpTools(vi.fn());
    expect(tools.map((tool) => tool.name)).toEqual([
      "list_posts",
      "search_posts",
      "get_post",
    ]);
    for (const tool of tools) {
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.inputSchema).toMatchObject({ type: "object" });
    }
  });

  it("list_posts returns the llms.txt body", async () => {
    const fetcher = vi.fn().mockResolvedValue(okResponse(LLMS_TXT));
    const result = await toolByName(getWebmcpTools(fetcher), "list_posts").execute({});

    expect(fetcher).toHaveBeenCalledWith("/llms.txt");
    expect(result.content[0]?.text).toBe(LLMS_TXT);
  });

  it("search_posts returns matching lines case-insensitively", async () => {
    const fetcher = vi.fn().mockResolvedValue(okResponse(LLMS_TXT));
    const result = await toolByName(
      getWebmcpTools(fetcher),
      "search_posts",
    ).execute({ query: "CACHING" });

    expect(result.content[0]?.text).toBe(
      "- [Next.js Caching](https://nublson.com/blog/nextjs-caching): ISR deep dive.",
    );
  });

  it("search_posts reports when nothing matches", async () => {
    const fetcher = vi.fn().mockResolvedValue(okResponse(LLMS_TXT));
    const result = await toolByName(
      getWebmcpTools(fetcher),
      "search_posts",
    ).execute({ query: "quantum" });

    expect(result.content[0]?.text).toContain("No posts matched");
  });

  it("get_post fetches the markdown route", async () => {
    const fetcher = vi.fn().mockResolvedValue(okResponse("# Hello"));
    const result = await toolByName(getWebmcpTools(fetcher), "get_post").execute(
      { type: "blog", slug: "hello" },
    );

    expect(fetcher).toHaveBeenCalledWith("/api/markdown/blog/hello");
    expect(result.content[0]?.text).toBe("# Hello");
  });

  it("get_post returns friendly text on 404", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response("nope", { status: 404 }));
    const result = await toolByName(getWebmcpTools(fetcher), "get_post").execute(
      { type: "blog", slug: "missing" },
    );

    expect(result.content[0]?.text).toContain("No blog post found");
    expect(result.content[0]?.text).toContain("list_posts");
  });

  it("never throws when the fetcher rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network down"));
    for (const tool of getWebmcpTools(fetcher)) {
      const result = await tool.execute({ query: "x", type: "blog", slug: "x" });
      expect(result.content[0]?.text).toContain("Could not load");
    }
  });
});
