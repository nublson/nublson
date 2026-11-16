import {
  fetchAllPostItems,
  fetchGearGroupsCached,
  fetchPostMarkdownCached,
  fetchProfileCached,
} from "@/services/content-tools";
import { searchPosts } from "@/utils/mcp-content";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

function jsonResult(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

function errorResult(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true,
  };
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_posts",
      {
        title: "List posts",
        description:
          "List published blog posts and work case studies with slugs, URLs, dates and descriptions. Omit type to get both. Covers the latest 50 posts per type (blog/work).",
        inputSchema: z.object({
          type: z.enum(["blog", "work"]).optional(),
        }),
      },
      async ({ type }) => jsonResult(await fetchAllPostItems(type)),
    );

    server.registerTool(
      "get_post",
      {
        title: "Get post",
        description:
          "Fetch a single blog post or work case study as markdown by slug (use list_posts to find slugs).",
        inputSchema: z.object({
          type: z.enum(["blog", "work"]),
          slug: z.string().min(1),
        }),
      },
      async ({ type, slug }) => {
        const markdown = await fetchPostMarkdownCached(type, slug);

        if (markdown === null) {
          return errorResult(
            `No ${type} post found for slug "${slug}". Use list_posts to see available slugs.`,
          );
        }

        return { content: [{ type: "text" as const, text: markdown }] };
      },
    );

    server.registerTool(
      "list_gears",
      {
        title: "List gear",
        description:
          "List recommended tools and gear, grouped by category, with product links.",
        inputSchema: z.object({}),
      },
      async () => jsonResult(await fetchGearGroupsCached()),
    );

    server.registerTool(
      "get_profile",
      {
        title: "Get profile",
        description:
          "Get Nubelson Fernandes' profile: name, role, location, bio and social links.",
        inputSchema: z.object({}),
      },
      async () => jsonResult(await fetchProfileCached()),
    );

    server.registerTool(
      "search_posts",
      {
        title: "Search posts",
        description:
          "Case-insensitive search across post titles, descriptions and categories. Covers the latest 50 posts per type (blog/work).",
        inputSchema: z.object({
          query: z.string().min(1),
        }),
      },
      async ({ query }) => {
        const matches = searchPosts(await fetchAllPostItems(), query);
        if (matches.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No posts matched "${query}". Try list_posts for the full index.`,
              },
            ],
          };
        }
        return jsonResult(matches);
      },
    );
  },
  {
    serverInfo: { name: "nublson.com", version: "1.0.0" },
  },
);

export { handler as GET, handler as POST };
