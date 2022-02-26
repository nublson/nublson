import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getBlocks, getPage } from "../services/notion";
import {
  formatBlockWithChildren,
  formatDate,
  formatPostProps,
} from "../utils/formatter";
import { IPostItem } from "../utils/types";

const HomeSection = dynamic(() => import("../section/Home"));
const ContentSection = dynamic(() => import("../section/Content"));
const ShareSection = dynamic(() => import("../section/Share"));
const NewsletterSection = dynamic(() => import("../section/Newsletter"));
const ContactSection = dynamic(() => import("../section/Contact"));

type AffiliatesProps = {
  pageProps: IPostItem;
  blocks: any[];
};

const Affiliates: NextPage<AffiliatesProps> = ({ pageProps, blocks }) => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Affiliates | Nubelson Fernandes"
        description={pageProps.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: "Affiliates | Nubelson Fernandes",
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
          site_name: "Affiliates | Nubelson Fernandes",
        }}
      />
      <HomeSection
        top={`Updated at ${formatDate(pageProps.modified_date)}`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        article
      />
      <ContentSection blocks={blocks} access={pageProps.access} />
      <ShareSection title="Share this program on" />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps<AffiliatesProps> = async (
  context
) => {
  const page = await getPage(process.env.NOTION_PAGE_AFFILIATES_ID);

  const pageProps = formatPostProps(page);

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

export default Affiliates;
