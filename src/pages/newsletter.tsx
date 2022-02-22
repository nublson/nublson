import { NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import pageData from "../utils/pageData.json";

const NewsletterSection = dynamic(() => import("../section/Newsletter"));
const IssuesSection = dynamic(() => import("../section/Issues"));
const ShareSection = dynamic(() => import("../section/Share"));
const ContactSection = dynamic(() => import("../section/Contact"));

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
      <ShareSection title="Share my newsletter on" />
      <ContactSection />
    </>
  );
};

export default Newsletter;
