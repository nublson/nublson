import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import ArticlesSection from "../../section/Articles";
import ContactSection from "../../section/Contact";
import HomeSection from "../../section/Home";
import NewsletterSection from "../../section/Newsletter";
import { getData } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";
import pageData from "../../utils/pageData.json";
import { BlogItem } from "../../utils/types";

type StoreProps = {
  posts: BlogItem[];
};

const Store: NextPage<StoreProps> = ({ posts }) => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Store | Nubelson Fernandes"
        description={pageData.store.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: "Store | Nubelson Fernandes",
          description: pageData.store.description,
          url: `${process.env.BASE_URL}${asPath}`,
          type: "store",
          images: [
            {
              url: pageData.store.image,
              width: 1920,
              height: 1080,
              alt: pageData.store.title,
            },
          ],
          site_name: "Store | Nubelson Fernandes",
        }}
      />
      <HomeSection
        id="home"
        top={pageData.store.top}
        title={pageData.store.title}
        subtitle={pageData.store.description}
        image={pageData.store.image}
        scrollTo="articles"
      />
      <ArticlesSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getData(process.env.NOTION_DATABASE_ID, "product");

  const posts = formatPosts(results);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Store;
