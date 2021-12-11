import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import ContactSection from "../../section/Contact";
import ContentSection from "../../section/Content";
import HomeSection from "../../section/Home";
import { getBlocks, getDatabase } from "../../services/api";
import {
  formatBlockWithChildren,
  formatDate,
  formatPageProps,
  formatSlug,
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
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <title>{pageProps.title} | Nubelson Fernandes</title>
        <meta name="description" content={pageProps.description} />

        <meta
          property="og:title"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta property="og:description" content={pageProps.description} />
        <meta property="og:image" content={pageProps.thumbnail} />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          property="og:site_name"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          name="twitter:title"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta name="twitter:description" content={pageProps.description} />
        <meta name="twitter:image" content={pageProps.thumbnail} />
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
