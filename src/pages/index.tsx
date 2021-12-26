import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import BlogSection from "../section/Blog";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import NewsletterSection from "../section/Newsletter";
import WorkSection from "../section/Work";
import { getArticles } from "../services/notion";
import { formatPosts } from "../utils/formatter";
import pageData from "../utils/pageData.json";
import { BlogItem } from "../utils/types";

type HomeProps = {
  posts: BlogItem[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title="Nubelson Fernandes"
        description={pageData.home.description}
        canonical={`${process.env.BASE_URL}`}
        openGraph={{
          title: "Nubelson Fernandes",
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
          site_name: "Nubelson Fernandes",
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
  const results = await getArticles(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results).slice(0, 2);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Home;
