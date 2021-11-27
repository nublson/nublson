import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ArticlesSection from "../section/Articles";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import { getDatabase } from "../services/api";
import files from "../utils/files.json";
import { BlogItem, DatabaseResult } from "../utils/types";

type BlogProps = {
  posts: DatabaseResult[];
};

const Blog: NextPage<BlogProps> = ({ posts }) => {
  const [articles, setArticles] = useState<BlogItem[]>([]);

  useEffect(() => {
    const formatedPosts: BlogItem[] = posts.map((item) => {
      return {
        id: item.id,
        thumbnail:
          item.cover.type === "file"
            ? item.cover.file.url
            : item.cover.external.url,
        title: item.properties.Name.title[0].text.content,
        description: item.properties.description.rich_text[0].text.content,
        publish_date: item.properties.publish_date.date.start,
        read_time: 3,
      };
    });

    setArticles(formatedPosts);
  }, [posts]);

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
      <ArticlesSection posts={articles} />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getDatabase(process.env.NOTION_DATABASE_ID);

  return {
    props: {
      posts: results,
    },

    revalidate: 1,
  };
};

export default Blog;
