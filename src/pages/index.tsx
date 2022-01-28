import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { getData } from "../services/notion";
import { formatPosts } from "../utils/formatter";
import pageData from "../utils/pageData.json";
import { IBlogItem } from "../utils/types";

const HomeSection = dynamic(() => import("../section/Home"));
const WorkSection = dynamic(() => import("../section/Work"));
const BlogSection = dynamic(() => import("../section/Blog"));
const NewsletterSection = dynamic(() => import("../section/Newsletter"));
const ContactSection = dynamic(() => import("../section/Contact"));

type HomeProps = {
  posts: IBlogItem[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title="Nubelson Fernandes - Developer &#38; Content Creator"
        description={pageData.home.description}
        canonical={`${process.env.BASE_URL}`}
        openGraph={{
          title: "Nubelson Fernandes - Developer & Content Creator",
          description: pageData.home.description,
          url: `${process.env.BASE_URL}`,
          type: "website",
          images: [
            {
              url: pageData.home.image,
              width: 1920,
              height: 1080,
              alt: pageData.home.title,
            },
          ],
          site_name: "Nubelson Fernandes - Developer & Content Creator",
        }}
      />

      <HomeSection
        id="home"
        top={pageData.home.top}
        title={pageData.home.title}
        subtitle={pageData.home.description}
        image={pageData.home.image}
        scrollTo="work"
      />
      <WorkSection />
      <BlogSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getData(process.env.NOTION_DATABASE_ID, "article");

  const posts = formatPosts(results).slice(0, 2);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Home;
