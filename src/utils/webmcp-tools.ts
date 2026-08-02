export type ModelContextToolResult = {
  content: { type: "text"; text: string }[];
};

export type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ModelContextToolResult>;
};

function textResult(text: string): ModelContextToolResult {
  return { content: [{ type: "text", text }] };
}

async function fetchText(
  fetcher: typeof fetch,
  url: string,
): Promise<{ ok: boolean; status: number; text: string }> {
  const response = await fetcher(url);
  return { ok: response.ok, status: response.status, text: await response.text() };
}

export function getWebmcpTools(fetcher: typeof fetch): ModelContextTool[] {
  return [
    {
      name: "list_posts",
      description:
        "List all published blog posts and work case studies on nublson.com with titles, links and descriptions.",
      inputSchema: { type: "object", properties: {} },
      async execute(input: Record<string, unknown> = {}) {
        try {
          void input;
          const { text } = await fetchText(fetcher, "/llms.txt");
          return textResult(text);
        } catch {
          return textResult("Could not load the post index. Try again later.");
        }
      },
    },
    {
      name: "search_posts",
      description:
        "Search nublson.com blog posts and work case studies by keyword (matches titles and descriptions).",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword to search for." },
        },
        required: ["query"],
      },
      async execute(input: Record<string, unknown> = {}) {
        try {
          const rawQuery = String(input.query ?? "").trim();
          const query = rawQuery.toLowerCase();
          if (!query) {
            return textResult(
              "Provide a search query. Try list_posts for the full index.",
            );
          }
          const { text } = await fetchText(fetcher, "/llms.txt");
          const matches = text
            .split("\n")
            .filter((line) => {
              if (!line.startsWith("- ")) return false;
              const withoutLinkTarget = line.replace(/\]\([^)]*\)/, "]");
              return withoutLinkTarget.toLowerCase().includes(query);
            });
          if (matches.length === 0) {
            return textResult(
              `No posts matched "${rawQuery}". Try list_posts for the full index.`,
            );
          }
          return textResult(matches.join("\n"));
        } catch {
          return textResult("Could not load the post index. Try again later.");
        }
      },
    },
    {
      name: "get_post",
      description:
        "Fetch a single nublson.com blog post or work case study as markdown by slug (use list_posts to find slugs).",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["blog", "work"] },
          slug: { type: "string", description: "The post slug." },
        },
        required: ["type", "slug"],
      },
      async execute(input: Record<string, unknown> = {}) {
        try {
          const type = input.type === "work" ? "work" : "blog";
          const slug = String(input.slug ?? "");
          const { ok, status, text } = await fetchText(
            fetcher,
            `/api/markdown/${type}/${encodeURIComponent(slug)}`,
          );
          if (!ok) {
            if (status === 404) {
              return textResult(
                `No ${type} post found for slug "${slug}". Use list_posts to see available slugs.`,
              );
            }
            return textResult("Could not load the post. Try again later.");
          }
          return textResult(text);
        } catch {
          return textResult("Could not load the post. Try again later.");
        }
      },
    },
  ];
}
