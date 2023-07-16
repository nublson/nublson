import { ContentSection, GearsSection, Header, ShareSection } from "@/sections";
import { getBlocks, getPage } from "@/services/notion";
import gears from "@/utils/gears.json";
import moment from "moment";

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
