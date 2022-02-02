import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getBlocks, getPage } from "../services/notion";
import {
  formatBlockWithChildren,
  formatDate,
  formatPageProps,
} from "../utils/formatter";
import { IPostItem } from "../utils/types";

const HomeSection = dynamic(() => import("../section/Home"));
const ContentSection = dynamic(() => import("../section/Content"));
const ShareSection = dynamic(() => import("../section/Share"));
const NewsletterSection = dynamic(() => import("../section/Newsletter"));
const ContactSection = dynamic(() => import("../section/Contact"));

type GearsProps = {
  pageProps: IPostItem;
  blocks: any[];
};

const Gears: NextPage<GearsProps> = ({ pageProps, blocks }) => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Gears | Nubelson Fernandes"
        description={pageProps.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: "Gears | Nubelson Fernandes",
          description: pageProps.description,
          url: `${process.env.BASE_URL}${asPath}`,
          type: "website",
          images: [
            {
              url: pageProps.thumbnail,
              width: 1920,
              height: 1080,
              alt: pageProps.title,
            },
          ],
          site_name: "Gears | Nubelson Fernandes",
        }}
      />
      <HomeSection
        top={`${
          pageProps.modified_date
            ? `Updated at ${formatDate(pageProps.modified_date)}`
            : `Published at ${formatDate(pageProps.publish_date)}`
        }`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        article
      />
      <ContentSection blocks={blocks} product_url={pageProps.link} />
      <ShareSection title="Share this kit on" />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps<GearsProps> = async (context) => {
  const page = await getPage(process.env.NOTION_GEARS_ID);

  const pageProps = formatPageProps(page);

  const blocks = await getBlocks(pageProps.id);

  const childBlocks = await Promise.all(
    blocks
      .filter((block: any) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );

  const blocksWithChildren = formatBlockWithChildren(blocks, childBlocks);

  return {
    props: {
      pageProps,
      blocks: blocksWithChildren,
    },
    revalidate: 5,
  };
};

export default Gears;
