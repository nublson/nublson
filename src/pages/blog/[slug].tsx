import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import ContactSection from "../../section/Contact";
import ContentSection from "../../section/Content";
import HomeSection from "../../section/Home";
import NewsletterSection from "../../section/Newsletter";
import { getArticles, getBlocks } from "../../services/notion";
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

  useEffect(() => {
    const categories = pageProps.categories.map((category) => category.name);
    console.log(categories);
  }, [pageProps.categories]);

  return (
    <>
      <NextSeo
        title={`${pageProps.title} | Nubelson Fernandes`}
        description={pageProps.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: pageProps.title,
          description: pageProps.description,
          url: `${process.env.BASE_URL}${asPath}`,
          type: "article",
          article: {
            publishedTime: pageProps.publish_date,
            modifiedTime: pageProps.modified_date,
            authors: [`${process.env.BASE_URL}/about`],
            tags: pageProps.categories.map((category) => category.name),
          },
          images: [
            {
              url: pageProps.thumbnail,
              width: 850,
              height: 750,
              alt: pageProps.title,
            },
          ],
          site_name: `${pageProps.title} | Nubelson Fernandes`,
        }}
      />
      <HomeSection
        top={`Published at ${formatDate(pageProps.publish_date)}`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        article
      />
      <ContentSection blocks={blocks} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getArticles(process.env.NOTION_DATABASE_ID);

  const paths = database.map((post) => ({
    params: {
      slug: formatSlug(post),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<SlugProps, Params> = async (
  context
) => {
  const params = context.params!;

  const { slug } = params;

  const database = await getArticles(process.env.NOTION_DATABASE_ID);

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
    revalidate: 5,
  };
};

export default Slug;
