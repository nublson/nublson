import { Header } from "@/sections";
import { getPage } from "@/services/notion";
import { formatPageProps } from "@/utils/formatter";
import moment from "moment";

export default async function Gears() {
  const data = await getPage(process.env.NOTION_PAGE_GEARS_ID);
  const pageProps = formatPageProps(data);

  return (
    <>
      <Header
        label={moment(pageProps.publish_date).format("MMMM d, YYYY")}
        title={pageProps.title}
        thumbnail={pageProps.thumbnail}
        description={pageProps.description}
      />
    </>
  );
}
