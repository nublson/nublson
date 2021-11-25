import type { NextPage } from "next";
import Head from "next/head";
import home from "../assets/img/home.jpg";
import HomeSection from "../section/Home";
import WorkSection from "../section/Work";
import BlogSection from "../section/Blog";
import ContactSection from "../section/Contact";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
      </Head>

      <HomeSection
        top="Hi, my name is"
        title="Nubelson Fernandes"
        subtitle="Developer and Content Creator with also xp in UI Design"
        image={home}
      />
      <WorkSection />
      <BlogSection />
      <ContactSection />
    </>
  );
};

export default Home;
