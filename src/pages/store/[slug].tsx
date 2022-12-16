import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { getBlocks, getData } from "../../services/notion";
import {
  formatBlockWithChildren,
  formatDate,
  formatPosts,
} from "../../utils/formatter";
import { IPostItem } from "../../utils/types";

const HomeSection = dynamic(() => import("../../section/Home"), {
  ssr: true,
});
const ContentSection = dynamic(() => import("../../section/Content"), {
  ssr: true,
});
const ShareSection = dynamic(() => import("../../section/Share"));
const ContactSection = dynamic(() => import("../../section/Contact"));

type SlugProps = {
  pageProps: IPostItem;
  blocks: any[];
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const Slug: NextPage<SlugProps> = ({ pageProps, blocks }) => {
  const { asPath } = useRouter();

  useEffect(() => {
    const registerView = () => {
      fetch(`/api/views/${pageProps.post_slug}`, {
        method: "POST",
      });
    };

    registerView();
  }, [pageProps.post_slug]);

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
        top={`Updated at ${formatDate(pageProps.modified_date)}`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        article
      />
      <ContentSection
        blocks={blocks}
        url={pageProps.refer_link}
        member_link={pageProps.member_link}
      />
      <ShareSection title="Share this product on" />
      <ContactSection />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const results = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  const posts = formatPosts(results);

  const paths = posts.map((post) => ({
    params: {
      slug: post.post_slug,
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

  const results = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  const pages = formatPosts(results);

  const pageExists = pages.find((page) => {
    return page.post_slug === slug;
  });

  if (!pageExists) {
    return {
      props: {
        pageProps: {} as IPostItem,
        blocks: [],
      },
    };
  } else {
    const blocks = await getBlocks(pageExists.id);

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
        pageProps: pageExists,
        blocks: blocksWithChildren,
      },
      revalidate: 5,
    };
  }
};

export default Slug;
