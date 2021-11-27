import type { NextPage } from "next";
import Head from "next/head";

import HomeSection from "../../section/Home";
import ContactSection from "../../section/Contact";

import slug from "../../assets/img/home.webp";

const Slug: NextPage = () => {
  return (
    <>
      <Head>
        <title>Work - Nubelson Fernandes</title>
      </Head>
      <HomeSection
        top="Published at September 18, 2021"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        subtitle="Hendrerit egestas volutpat nibh maecenas dignissim habitasse tristique vivamus."
        image={slug}
        scrollTo=""
        article
      />
      <ContactSection />
    </>
  );
};

export default Slug;
