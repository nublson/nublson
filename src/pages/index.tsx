import type { NextPage } from "next";
import Head from "next/head";

import HomeSection from "../section/Home";

import home from "../assets/img/home.jpg";

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
    </>
  );
};

export default Home;
