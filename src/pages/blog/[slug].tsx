import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import ContactSection from "../../section/Contact";
import ContentSection from "../../section/Content";
import HomeSection from "../../section/Home";
import { getBlocks, getDatabase } from "../../services/api";
import {
  formatDate,
  formatPageProps,
  formatSlug,
  formatBlockWithChildren,
} from "../../utils/formatter";
import { BlogItem } from "../../utils/types";

type SlugProps = {
  pageProps: BlogItem;
  blocks: any[];
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const Slug: NextPage<SlugProps> = ({ pageProps, blocks }) => {
  return (
    <>
      <Head>
        <title>{pageProps.title} - Nubelson Fernandes</title>
      </Head>
      <HomeSection
        top={`Published at ${formatDate(pageProps.publish_date)}`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        scrollTo=""
        article
      />
      <ContentSection blocks={blocks} />
      <ContactSection />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getDatabase(process.env.NOTION_DATABASE_ID);

  const paths = database.map((post) => ({
    params: {
      slug: formatSlug(post),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SlugProps, Params> = async (
  context
) => {
  const params = context.params!;

  const { slug } = params;

  const database = await getDatabase(process.env.NOTION_DATABASE_ID);

  const pageExists = database.find((result) => {
    return formatSlug(result) === slug;
  });

  const pageProps = formatPageProps(pageExists);

  const blocks = await getBlocks(pageProps.id);

  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
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
    revalidate: 1,
  };
};

export default Slug;
