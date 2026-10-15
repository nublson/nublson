import GearsSection from "@/sections/gears";
import { getDatabasePages, withThumbnailBlurs } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function GearsCategory() {
  const gearsPages = await getDatabasePages(
    process.env.NOTION_DATABASE_GEARS_ID!,
    undefined,
    50,
    [
      {
        property: "Category",
        direction: "ascending",
      },
      {
        property: "State",
        direction: "descending",
      },
      {
        property: "Updated",
        direction: "ascending",
      },
    ],
    ["title", "Description", "Category", "Path"],
  );

  const gearsPostMetadata = await withThumbnailBlurs(
    formatPostMetadata(gearsPages),
  );

  const categories = gearsPostMetadata.map((post) => post.category);
  const uniqueCategories = [...new Set(categories)];

  return (
    <div className="w-full flex flex-col items-stretch justify-start gap-14">
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
