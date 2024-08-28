import { ContentSection, GearsSection, Header, ShareSection } from "@/sections";
import { getBlocks, getGears, getPage } from "@/services/notion";
import { setToCurrentDate } from "@/utils/formatter";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(process.env.NOTION_PAGE_GEARS_ID);

  return {
    title: "Gears",
    description: page.description,
    category: page.category,
    keywords: page.keywords,
    alternates: {
      canonical: `/gears`,
    },
    openGraph: {
      type: "article",
      url: `${process.env.BASE_URL}/gears`,
      title: "Gears",
      description: page.description,
      siteName: "nublson.com",
    },
    twitter: {
      card: "summary_large_image",
      site: `${process.env.BASE_URL}/gears`,
      title: page.title,
      description: page.description,
      images: page.thumbnail,
      creator: "@nublson",
    },
  };
}

export default async function Gears() {
  const [data, gears] = await Promise.all([
    getPage(process.env.NOTION_PAGE_GEARS_ID),
    getGears(process.env.NOTION_DATABASE_GEARS_ID),
  ]);

  const pageBlocks = await getBlocks(data.id);

  return (
    <>
      <Header
        label={setToCurrentDate(data.modified_date, "LL")}
        title={data.title}
        thumbnail={data.thumbnail}
        description={data.description}
      />
      <ContentSection blocks={pageBlocks} data={data} />
      <GearsSection data={gears} />
      <ShareSection>
        <p>I may earn some commission from sales using these links.</p>
      </ShareSection>
    </>
  );
}
