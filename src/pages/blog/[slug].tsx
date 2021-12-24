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
        twitter={{
          handle: "@nublson",
          site: "@nublson",
          cardType: "summary_large_image",
        }}
      />
      {/* <Head>
        <link
          rel="canonical"
          href={`${process.env.BASE_URL}/blog/${formatSlug(pageProps.title)}/`}
        />
        <title>{pageProps.title} | Nubelson Fernandes</title>
        <meta name="description" content={pageProps.description} />

        <meta
          property="og:title"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta property="og:description" content={pageProps.description} />
        <meta property="og:image" content={pageProps.thumbnail} />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          property="og:site_name"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          name="twitter:title"
          content={`${pageProps.title} | Nubelson Fernandes`}
        />
        <meta name="twitter:description" content={pageProps.description} />
        <meta name="twitter:image" content={pageProps.thumbnail} />
      </Head> */}
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
