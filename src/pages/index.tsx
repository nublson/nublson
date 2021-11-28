import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BlogSection from "../section/Blog";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import WorkSection from "../section/Work";
import { getDatabase } from "../services/api";
import files from "../utils/files.json";
import { formatPosts } from "../utils/formatter";
import { BlogItem } from "../utils/types";

type HomeProps = {
  posts: BlogItem[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
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
        image={files.images.home}
        scrollTo="work"
      />
      <WorkSection />
      <BlogSection posts={posts} />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getDatabase(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results).slice(0, 2);

  return {
    props: {
      posts,
    },

    revalidate: 1,
  };
};

export default Home;
