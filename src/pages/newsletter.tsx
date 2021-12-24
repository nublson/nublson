import { NextPage } from "next";
import Head from "next/head";
import NewsletterSection from "../section/Newsletter";
import pageData from "../utils/pageData.json";
import { useRouter } from "next/router";

const Newsletter: NextPage = () => {
  const { asPath } = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="canonical" href={`${process.env.BASE_URL}/newsletter`} />
        <title>Newsletter | Nubelson Fernandes</title>
        <meta name="description" content={pageData.newsletter.description} />

        <meta property="og:title" content={"Newsletter | Nubelson Fernandes"} />
        <meta
          property="og:description"
          content={pageData.newsletter.description}
        />
        <meta property="og:image" content={pageData.newsletter.image} />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta property="og:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          property="og:site_name"
          content="Newsletter | Nubelson Fernandes"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nublson" />
        <meta name="twitter:creator" content="@nublson" />
        <meta name="twitter:url" content={`${process.env.BASE_URL}${asPath}`} />
        <meta
          name="twitter:title"
          content={"Newsletter | Nubelson Fernandes"}
        />
        <meta
          name="twitter:description"
          content={pageData.newsletter.description}
        />
        <meta name="twitter:image" content={pageData.newsletter.image} />
      </Head>

      <NewsletterSection />
    </>
  );
};

export default Newsletter;
