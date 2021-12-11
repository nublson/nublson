import { NextPage } from "next";
import Head from "next/head";
import HomeSection from "../section/Home";
import files from "../utils/files.json";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
      </Head>

      <HomeSection
        id="404"
        top="Page not found"
        title="Oops, your're lost"
        subtitle="You fell in the middle of an infinite space. Come home!"
        image={files.images.notFound}
      />
    </>
  );
};

export default Home;
