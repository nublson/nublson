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
  type GearGroup,
  type PostToolItem,
  type Profile,
} from "@/utils/mcp-content";
import { unstable_cache } from "next/cache";

const MEDIA_BY_TYPE = { blog: "Blog", work: "Project" } as const;
const PATH_BY_TYPE = { blog: "/blog", work: "/work" } as const;

export type PostType = keyof typeof MEDIA_BY_TYPE;

function baseUrl(): string {
  return process.env.BASE_URL!.replace(/\/$/, "");
}

// Cache keys are unchanged from when these lived in the MCP route, so the
// existing cache entries stay valid.
const fetchPostItemsCached = unstable_cache(
  async (type: PostType): Promise<PostToolItem[]> => {
    const pages = await getDatabasePages(
      process.env.NOTION_DATABASE_CONTENT_ID!,
      MEDIA_BY_TYPE[type],
      50,
    );
    return formatPostMetadata(pages).map((post) =>
      postToolItem(post, baseUrl(), PATH_BY_TYPE[type]),
    );
  },
  ["mcp-post-items"],
  { revalidate: 10 },
);

export async function fetchAllPostItems(
  type?: PostType,
): Promise<PostToolItem[]> {
  if (type) return fetchPostItemsCached(type);
  const [blog, work] = await Promise.all([
    fetchPostItemsCached("blog"),
    fetchPostItemsCached("work"),
  ]);
  return [...blog, ...work];
}

export const fetchPostMarkdownCached = unstable_cache(
  async (type: PostType, slug: string): Promise<string | null> => {
    const found = await getDatabasePageBySlug(
      process.env.NOTION_DATABASE_CONTENT_ID!,
      MEDIA_BY_TYPE[type],
      slug,
    );

    if (!found) return null;

    const blocks = await getPageBlocks(found.page.id);
    return postToMarkdown({
      title: found.metadata.title,
      description: found.metadata.description,
      publishedDate: formatDateTimeIso(found.metadata.published_date),
      author: found.metadata.author,
      category: found.metadata.category || undefined,
      blocks,
    });
  },
  ["mcp-post-markdown"],
  { revalidate: 10 },
);

export const fetchGearGroupsCached = unstable_cache(
  async (): Promise<GearGroup[]> => {
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
    return groupGears(formatPostMetadata(pages));
  },
  ["mcp-gears"],
  { revalidate: 10 },
);

export const fetchProfileCached = unstable_cache(
  async (): Promise<Profile> => {
    const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
    return profileFromHero(formatPageMetadata(page), social.media, baseUrl());
  },
  ["mcp-profile"],
  { revalidate: 10 },
);
