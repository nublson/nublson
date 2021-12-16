import { NextPage } from "next";
import Head from "next/head";
import HomeSection from "../section/Home";
import pageData from "../utils/pageData.json";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found | Nubelson Fernandes</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <HomeSection
        id="404"
        top={pageData.notFound.top}
        title={pageData.notFound.title}
        subtitle={pageData.notFound.description}
        image={pageData.notFound.image}
      />
    </>
  );
};

export default Home;
