import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import home from "../assets/img/home.webp";
import BlogSection from "../section/Blog";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import WorkSection from "../section/Work";

import { getDatabase } from "../services/api";
import { DatabaseResult, BlogItem } from "../utils/types";

type HomeProps = {
  posts: DatabaseResult[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  const [articles, setArticles] = useState<BlogItem[]>([]);

  useEffect(() => {
    const formatedPosts: BlogItem[] = posts.map((item) => {
      return {
        id: item.id,
        thumbnail: item.cover.file.url,
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
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
      </Head>

      <HomeSection
        id="home"
        top="Hi, my name is"
        title="Nubelson Fernandes"
        subtitle="Developer and Content Creator with also xp in UI Design"
        image={home}
        scrollTo="work"
      />
      <WorkSection />
      <BlogSection posts={articles.slice(0, 2)} />
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

    revalidate: 10,
  };
};

export default Home;
