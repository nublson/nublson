import type { NextPage } from "next";
import Head from "next/head";

import HomSection from "../section/Home";

import work from "../assets/img/work.jpg";

const Work: NextPage = () => {
  return (
    <>
      <Head>
        <title>Work - Nubelson Fernandes</title>
      </Head>
      <HomSection
        top="See what I'm"
        title="Creating"
        subtitle="Here you will find some of my selected photography works. I have worked with brands such as Logitech, Nomad, BenQ, Deltahub and various others."
        image={work}
        scrollTo=""
      />
    </>
  );
};

export default Work;
