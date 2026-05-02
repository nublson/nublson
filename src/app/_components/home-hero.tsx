import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function HomeHero() {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Hero
      title={pageMetadata.title}
      description={pageMetadata.description}
      bottom={
        <div className="flex w-full items-center justify-between gap-2">
          <Typography className="line-clamp-1 break-all font-bold text-muted-foreground">
            {pageMetadata.role}
          </Typography>
          <Typography className="line-clamp-1 break-all font-bold text-muted-foreground">
            📍 {pageMetadata.location}
          </Typography>
        </div>
      }
    />
  );
}
