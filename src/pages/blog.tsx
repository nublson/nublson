import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ArticlesSection from "../section/Articles";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import { getDatabase } from "../services/api";
import files from "../utils/files.json";
import { formatPosts } from "../utils/formatter";
import { BlogItem } from "../utils/types";

type BlogProps = {
  posts: BlogItem[];
};

const Blog: NextPage<BlogProps> = ({ posts }) => {
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <title>Blog | Nubelson Fernandes</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta property="og:title" content={"Blog | Nubelson Fernandes"} />
        <meta
          property="og:description"
          content={"Sharing ideas, thoughts and experience"}
        />
        <meta property="og:image" content={files.images.blog} />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta property="og:site_name" content="Blog | Nubelson Fernandes" />
        <meta property="og:type" content="blog" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta name="twitter:title" content={"Blog | Nubelson Fernandes"} />
        <meta
          name="twitter:description"
          content={"Sharing ideas, thoughts and experience"}
        />
        <meta name="twitter:image" content={files.images.blog} />
      </Head>
      <HomeSection
        id="home"
        top="Welcome to my"
        title="Blog"
        subtitle="I don’t just shoot and develop. Here I share my ideas, thoughts and experience."
        image={files.images.blog}
        scrollTo="articles"
      />
      <ArticlesSection posts={posts} />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getDatabase(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results);

  return {
    props: {
      posts,
    },

    revalidate: 1,
  };
};

export default Blog;
