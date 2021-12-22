import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
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
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="canonical" href={`${process.env.BASE_URL}/blog/`} />
        <title>Blog | Nubelson Fernandes</title>
        <meta name="description" content={pageData.blog.description} />

        <meta property="og:title" content={"Blog | Nubelson Fernandes"} />
        <meta property="og:description" content={pageData.blog.description} />
        <meta property="og:image" content={pageData.blog.image} />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta property="og:site_name" content="Blog | Nubelson Fernandes" />
        <meta property="og:type" content="blog" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta name="twitter:title" content={"Blog | Nubelson Fernandes"} />
        <meta name="twitter:description" content={pageData.blog.description} />
        <meta name="twitter:image" content={pageData.blog.image} />
      </Head>
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
