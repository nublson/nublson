import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ContactSection from "../section/Contact";
import ContentSection from "../section/Content";
import HomeSection from "../section/Home";
import NewsletterSection from "../section/Newsletter";
import { getBlocks, getPage } from "../services/notion";
import {
  formatBlockWithChildren,
  formatDate,
  formatPageProps,
} from "../utils/formatter";
import { BlogItem } from "../utils/types";

type AboutProps = {
  pageProps: BlogItem;
  blocks: any[];
};

const About: NextPage<AboutProps> = ({ pageProps, blocks }) => {
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="canonical" href={`${process.env.BASE_URL}/about/`} />
        <title>About | Nubelson Fernandes</title>
        <meta name="description" content={pageProps.description} />

        <meta property="og:title" content={"About | Nubelson Fernandes"} />
        <meta property="og:description" content={pageProps.description} />
        <meta property="og:image" content={pageProps.thumbnail} />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta property="og:site_name" content={"About | Nubelson Fernandes"} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta name="twitter:title" content={"About | Nubelson Fernandes"} />
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
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps<AboutProps> = async (context) => {
  const page = await getPage(process.env.NOTION_ABOUT_ID);

  const pageProps = formatPageProps(page);

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
    revalidate: 5,
  };
};

export default About;
