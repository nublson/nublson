import type { NextPage } from "next";
import Head from "next/head";

import blog from "../assets/img/blog.jpg";

import HomeSection from "../section/Home";
import ArticlesSection from "../section/Articles";
import ContactSection from "../section/Contact";
import data from "../utils/articles.json";

const Blog: NextPage = () => {
  const { articles } = data;

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
        image={blog}
        scrollTo="articles"
      />
      <ArticlesSection posts={articles} />
      <ContactSection />
    </>
  );
};

export default Blog;
