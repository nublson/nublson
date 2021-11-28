import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import ArticlesSection from "../section/Articles";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import { getDatabase } from "../services/api";
import files from "../utils/files.json";
import { BlogItem } from "../utils/types";

type BlogProps = {
  posts: BlogItem[];
};

const Blog: NextPage<BlogProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Blog - Nubelson Fernandes</title>
      </Head>
      <HomeSection
        id="home"
        top="Welcome to my"
        title="Blog"
        subtitle="Sharing ideas, thoughts and experience"
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

  const posts: BlogItem[] = results.map((post) => ({
    id: post.id,
    thumbnail:
      post.cover.type === "file"
        ? post.cover.file.url
        : post.cover.external.url,
    title: post.properties.Name.title[0].text.content,
    description: post.properties.description.rich_text[0].text.content,
    publish_date: post.properties.publish_date.date.start,
    read_time: 3,
  }));

  return {
    props: {
      posts,
    },

    revalidate: 1,
  };
};

export default Blog;
