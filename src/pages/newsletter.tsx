import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import IssuesSection from "../section/Issues";
import NewsletterSection from "../section/Newsletter";
import ShareSection from "../section/Share";
import ContactSection from "../section/Contact";
import { getIssues } from "../services/getRevue";
import { formatIssues } from "../utils/formatter";
import pageData from "../utils/pageData.json";
import { IssueItem } from "../utils/types";

type NewsletterProps = {
  issues: IssueItem[];
};

const Newsletter: NextPage<NewsletterProps> = ({ issues }) => {
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
      <IssuesSection issues={issues} />
      <ShareSection title="Share my newsletter on" />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await getIssues();

  const issues = formatIssues(data);

  return {
    props: {
      issues,
    },

    revalidate: 5,
  };
};

export default Newsletter;
