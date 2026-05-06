import { JsonLd } from "@/components/json-ld";
import { Typography } from "@/components/typography";
import social from "@/data/social.json";
import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";

export async function HomeHero() {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const pageMetadata = formatPageMetadata(page);
  const sameAs = social.media
    .filter((item) => item.url.startsWith("https://"))
    .map((item) => item.url);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: pageMetadata.title,
          url: process.env.BASE_URL,
          jobTitle: pageMetadata.role,
          sameAs,
        }}
      />
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        bottom={
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <Typography className="line-clamp-1 break-all font-bold text-muted-foreground">
              {pageMetadata.role}
            </Typography>
            <Typography className="line-clamp-1 break-all font-bold text-muted-foreground">
              <span aria-hidden="true">📍</span> {pageMetadata.location}
            </Typography>
          </div>
        }
      />
    </>
  );
}
