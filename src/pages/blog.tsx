import type { NextPage } from "next";
import Head from "next/head";

import blog from "../assets/img/blog.jpg";

import HomeSection from "../section/Home";
import ArticlesSection from "../section/Articles";

const Blog: NextPage = () => {
  return (
    <>
      <Head>
        <title>NUBLog - by Nubelson Fernandes</title>
      </Head>
      <HomeSection
        id="home"
        top="Welcome to my"
        title="Personal Blog"
        subtitle="Suscipit facilisi sed sed duis augue erat commodo."
        image={blog}
        scrollTo="articles"
      />
      <ArticlesSection />
    </>
  );
};

export default Blog;
