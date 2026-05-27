import GearsSection from "@/sections/gears";
import { getDatabasePages } from "@/services/notion";
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

  const gearsPostMetadata = formatPostMetadata(gearsPages);

  const categories = gearsPostMetadata.map((post) => post.category);
  const uniqueCategories = [...new Set(categories)];

  return (
    <div className="w-full flex flex-col items-start justify-start gap-[60px]">
      {uniqueCategories.map((category) => (
        <GearsSection
          key={category}
          title={category}
          id={category}
          posts={gearsPostMetadata.filter((post) => post.category === category)}
          className="grid auto-rows-fr grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
        />
      ))}
    </div>
  );
}
