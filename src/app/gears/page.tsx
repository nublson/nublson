import { ContentSection, GearsSection, Header, ShareSection } from "@/sections";
import { getBlocks, getPage } from "@/services/notion";
import { setToCurrentDate } from "@/utils/formatter";
import gears from "@/utils/gears.json";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(process.env.NOTION_PAGE_GEARS_ID);

  return {
    title: "Gears",
    description: page.description,
    category: page.category,
    alternates: {
      canonical: `/gears`,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      siteId: "1131704795604164615",
      creator: "@nublson",
      creatorId: "1131704795604164615",
    },
    openGraph: {
      type: "article",
      url: `${process.env.BASE_URL}/gears`,
      title: "Gears",
      description: page.description,
      siteName: "nublson.com",
    },
  };
}

export const revalidate = 60;

export default async function Gears() {
  const data = await getPage(process.env.NOTION_PAGE_GEARS_ID);

  const pageBlocks = await getBlocks(data.id);

  return (
    <>
      <Header
        label={setToCurrentDate(data.modified_date, "LL")}
        title={data.title}
        thumbnail={data.thumbnail}
        description={data.description}
      />
      <ContentSection blocks={pageBlocks} />
      <GearsSection data={gears.categories} />
      <ShareSection>
        <p>I may earn some commission from sales using these links.</p>
      </ShareSection>
    </>
  );
}
