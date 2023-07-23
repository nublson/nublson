import { ContentSection, GearsSection, Header, ShareSection } from "@/sections";
import { getBlocks, getPage } from "@/services/notion";
import gears from "@/utils/gears.json";
import moment from "moment";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(process.env.NOTION_PAGE_GEARS_ID);

  return {
    title: "Gears",
    description: page.description,
    metadataBase: new URL(process.env.BASE_URL),
    openGraph: {
      type: "article",
      url: `${process.env.BASE_URL}/gears`,
      title: "Gears",
      description: page.description,
      siteName: "nublson.com",
      images: [
        {
          url: page.thumbnail,
        },
      ],
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
        label={moment(data.publish_date).format("MMMM d, YYYY")}
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