import type { NextPage } from "next";
import Head from "next/head";
import { Heading } from "../components/shared/molecules";
import { Container } from "../styles/pages/Home";

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Nubelson Fernandes | Developer &#38; Content Creator</title>
      </Head>

      <Heading
        top="Hi, my name is"
        title="Nubelson Fernandes"
        subtitle="Developer and Content Creator with also XP in UI Design"
      />
    </Container>
  );
};

export default Home;
