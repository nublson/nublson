import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import ArticlesSection from "../../section/Articles";
import ContactSection from "../../section/Contact";
import HomeSection from "../../section/Home";
import NewsletterSection from "../../section/Newsletter";
import { getArticles } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";
import pageData from "../../utils/pageData.json";
import { BlogItem } from "../../utils/types";

type BlogProps = {
  posts: BlogItem[];
};

const Blog: NextPage<BlogProps> = ({ posts }) => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Blog | Nubelson Fernandes"
        description={pageData.blog.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: "Blog | Nubelson Fernandes",
          description: pageData.blog.description,
          url: `${process.env.BASE_URL}${asPath}`,
          type: "blog",
          images: [
            {
              url: pageData.blog.image,
              width: 1920,
              height: 1080,
              alt: pageData.blog.title,
            },
          ],
          site_name: "Blog | Nubelson Fernandes",
        }}
      />
      <HomeSection
        id="home"
        top={pageData.blog.top}
        title={pageData.blog.title}
        subtitle={pageData.blog.description}
        image={pageData.blog.image}
        scrollTo="articles"
      />
      <ArticlesSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getArticles(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Blog;
