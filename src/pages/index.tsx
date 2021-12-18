import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import BlogSection from "../section/Blog";
import ContactSection from "../section/Contact";
import HomeSection from "../section/Home";
import NewsletterSection from "../section/Newsletter";
import WorkSection from "../section/Work";
import { getArticles } from "../services/api";
import { formatPosts } from "../utils/formatter";
import pageData from "../utils/pageData.json";
import { BlogItem } from "../utils/types";

type HomeProps = {
  posts: BlogItem[];
};

const Home: NextPage<HomeProps> = ({ posts }) => {
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
        <meta name="description" content={pageData.home.description} />

        <meta
          property="og:title"
          content={"Nubelson Fernandes | Developer & Content Creator"}
        />
        <meta property="og:description" content={pageData.home.description} />
        <meta property="og:image" content={pageData.home.image} />
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
        <meta name="twitter:description" content={pageData.home.description} />
        <meta name="twitter:image" content={pageData.home.image} />
      </Head>

      <HomeSection
        id="home"
        top={pageData.home.top}
        title={pageData.home.title}
        subtitle={pageData.home.description}
        image={pageData.home.image}
        scrollTo="work"
      />
      <WorkSection />
      <BlogSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getArticles(process.env.NOTION_DATABASE_ID);

  const posts = formatPosts(results).slice(0, 2);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Home;
