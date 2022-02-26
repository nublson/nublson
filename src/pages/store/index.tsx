import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getData } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";
import pageData from "../../utils/pageData.json";
import { IPostItem } from "../../utils/types";

const HomeSection = dynamic(() => import("../../section/Home"));
const PostsSection = dynamic(() => import("../../section/Posts"));
const NewsletterSection = dynamic(() => import("../../section/Newsletter"));
const ContactSection = dynamic(() => import("../../section/Contact"));

type StoreProps = {
  posts: IPostItem[];
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
        scrollTo="posts"
      />
      <PostsSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  const posts = formatPosts(results);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Store;
