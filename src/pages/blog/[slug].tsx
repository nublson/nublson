import moment from "moment";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import slugify from "slugify";
import ContactSection from "../../section/Contact";
import HomeSection from "../../section/Home";
import { getDatabase } from "../../services/api";

type SlugProps = {
  pageProps: {
    publish_date: string;
    title: string;
    description: string;
    thumbnail: string;
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const Slug: NextPage<SlugProps> = ({ pageProps }) => {
  return (
    <>
      <Head>
        <title>{pageProps.title} - Nubelson Fernandes</title>
      </Head>
      <HomeSection
        top={`Published at ${moment(pageProps.publish_date).format(
          "MMMM D, YYYY"
        )}`}
        title={pageProps.title}
        subtitle={pageProps.description}
        image={pageProps.thumbnail}
        scrollTo=""
        article
      />
      <ContactSection />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getDatabase(process.env.NOTION_DATABASE_ID);

  const paths = database.map((post) => ({
    params: {
      slug: slugify(post.properties.Name.title[0].text.content).toLowerCase(),
    },
  }));

  console.log({ paths });

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
    const resultSlug = slugify(
      result.properties.Name.title[0].text.content
    ).toLowerCase();

    return resultSlug === slug;
  });

  const pageProps = {
    thumbnail:
      pageExists.cover.type === "file"
        ? pageExists.cover.file.url
        : pageExists.cover.external.url,
    title: pageExists.properties.Name.title[0].text.content,
    description: pageExists.properties.description.rich_text[0].text.content,
    publish_date: pageExists.properties.publish_date.date.start,
  };

  return {
    props: {
      pageProps,
    },
    revalidate: 1,
  };
};

export default Slug;
