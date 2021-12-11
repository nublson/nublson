import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta
          property="og:title"
          content={"Nubelson Fernandes | Developer & Content Creator"}
        />
        <meta
          property="og:description"
          content="I'm a Developer and Content Creator with also xp in UI Design!"
        />
        <meta property="og:image" content={files.images.home} />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          property="og:site_name"
          content="Nubelson Fernandes | Developer &#38; Content Creator"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          name="twitter:title"
          content={"Nubelson Fernandes | Developer & Content Creator"}
        />
        <meta
          name="twitter:description"
          content={
            "I'm a Developer and Content Creator with also xp in UI Design!"
          }
        />
        <meta name="twitter:image" content={files.images.home} />
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
