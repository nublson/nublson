import social from "@/data/social.json";
import {
  getDatabasePageBySlug,
  getDatabasePages,
  getPageBlocks,
  getPageData,
} from "@/services/notion";
import { postToMarkdown } from "@/utils/blocks-to-markdown";
import {
  formatDateTimeIso,
  formatPageMetadata,
  formatPostMetadata,
} from "@/utils/formatter";
import {
  groupGears,
  postToolItem,
  profileFromHero,
  searchPosts,
  type PostToolItem,
} from "@/utils/mcp-content";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const MEDIA_BY_TYPE = { blog: "Blog", work: "Project" } as const;
const PATH_BY_TYPE = { blog: "/blog", work: "/work" } as const;

type PostType = keyof typeof MEDIA_BY_TYPE;

function baseUrl(): string {
  return process.env.BASE_URL!.replace(/\/$/, "");
}

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

async function fetchPostItems(type: PostType): Promise<PostToolItem[]> {
  const pages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    MEDIA_BY_TYPE[type],
    50,
  );
  return formatPostMetadata(pages).map((post) =>
    postToolItem(post, baseUrl(), PATH_BY_TYPE[type]),
  );
}

async function fetchAllPostItems(type?: PostType): Promise<PostToolItem[]> {
  if (type) return fetchPostItems(type);
  const [blog, work] = await Promise.all([
    fetchPostItems("blog"),
    fetchPostItems("work"),
  ]);
  return [...blog, ...work];
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_posts",
      {
        title: "List posts",
        description:
          "List published blog posts and work case studies with slugs, URLs, dates and descriptions. Omit type to get both.",
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
        const found = await getDatabasePageBySlug(
          process.env.NOTION_DATABASE_CONTENT_ID!,
          MEDIA_BY_TYPE[type],
          slug,
        );

        if (!found) {
          return errorResult(
            `No ${type} post found for slug "${slug}". Use list_posts to see available slugs.`,
          );
        }

        const blocks = await getPageBlocks(found.page.id);
        const markdown = postToMarkdown({
          title: found.metadata.title,
          description: found.metadata.description,
          publishedDate: formatDateTimeIso(found.metadata.published_date),
          author: found.metadata.author,
          category: found.metadata.category || undefined,
          blocks,
        });

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
      async () => {
        const pages = await getDatabasePages(
          process.env.NOTION_DATABASE_GEARS_ID!,
          undefined,
          50,
          [
            { property: "Category", direction: "ascending" },
            { property: "State", direction: "descending" },
            { property: "Updated", direction: "ascending" },
          ],
          ["title", "Description", "Category", "Path"],
        );
        return jsonResult(groupGears(formatPostMetadata(pages)));
      },
    );

    server.registerTool(
      "get_profile",
      {
        title: "Get profile",
        description:
          "Get Nubelson Fernandes' profile: name, role, location, bio and social links.",
        inputSchema: z.object({}),
      },
      async () => {
        const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
        return jsonResult(
          profileFromHero(formatPageMetadata(page), social.media, baseUrl()),
        );
      },
    );

    server.registerTool(
      "search_posts",
      {
        title: "Search posts",
        description:
          "Case-insensitive search across post titles, descriptions and categories.",
        inputSchema: z.object({
          query: z.string().min(1),
        }),
      },
      async ({ query }) => {
        const matches = searchPosts(await fetchAllPostItems(), query);
        if (matches.length === 0) {
          return errorResult(
            `No posts matched "${query}". Try list_posts for the full index.`,
          );
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
