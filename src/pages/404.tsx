import { NextPage } from "next";
import Head from "next/head";
import HomeSection from "../section/Home";
import files from "../utils/files.json";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found | Nubelson Fernandes</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
