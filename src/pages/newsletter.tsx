import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import IssuesSection from "../section/Issues";
import NewsletterSection from "../section/Newsletter";
import pageData from "../utils/pageData.json";

const Newsletter: NextPage = () => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Newsletter | Nubelson Fernandes"
        description={pageData.newsletter.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          url: `${process.env.BASE_URL}${asPath}`,
          title: "Newsletter | Nubelson Fernandes",
          description: pageData.newsletter.description,
          images: [
            {
              url: pageData.newsletter.image,
              width: 1920,
              height: 1080,
              alt: pageData.newsletter.title,
            },
          ],
          site_name: "Newsletter | Nubelson Fernandes",
          type: "website",
        }}
      />

      <NewsletterSection />
      <IssuesSection />
    </>
  );
};

export default Newsletter;
