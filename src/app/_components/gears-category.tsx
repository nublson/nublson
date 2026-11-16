import GearsSection from "@/sections/gears";
import {
  GEARS_SORTS,
  getDatabasePages,
  withThumbnailBlurs,
} from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getGears(): Promise<PostMetadata[]> {
  const gearsPages = await getDatabasePages(
    process.env.NOTION_DATABASE_GEARS_ID!,
    undefined,
    50,
    GEARS_SORTS,
    ["title", "Description", "Category", "Path"],
  );

  return withThumbnailBlurs(formatPostMetadata(gearsPages));
}

export function GearsCategory({ posts: gearsPostMetadata }: { posts: PostMetadata[] }) {

  const categories = gearsPostMetadata.map((post) => post.category);
  const uniqueCategories = [...new Set(categories)];

  return (
    <div
      data-stream
      className="w-full flex flex-col items-stretch justify-start gap-14"
    >
      {uniqueCategories.map((category) => (
        <GearsSection
          key={category}
          title={category}
          id={category}
          posts={gearsPostMetadata.filter((post) => post.category === category)}
        />
      ))}
    </div>
  );
}
