import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getData } from "../../services/notion";
import { formatBooks } from "../../utils/formatter";
import pageData from "../../utils/pageData.json";
import { IBookItem } from "../../utils/types";

const HomeSection = dynamic(() => import("../../section/Home"));
const BooksSection = dynamic(() => import("../../section/Books"));
const ShareSection = dynamic(() => import("../../section/Share"));
const ContactSection = dynamic(() => import("../../section/Contact"));

type BooksProps = {
  books: IBookItem[];
};

const Newsletter: NextPage<BooksProps> = ({ books }) => {
  const { asPath } = useRouter();

  useEffect(() => {
    console.log({ books });
  }, [books]);

  return (
    <>
      <NextSeo
        title="Books | Nubelson Fernandes"
        description={pageData.books.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          url: `${process.env.BASE_URL}${asPath}`,
          title: "Books | Nubelson Fernandes",
          description: pageData.books.description,
          images: [
            {
              url: pageData.books.image,
              width: 1920,
              height: 1080,
              alt: pageData.books.title,
            },
          ],
          site_name: "Books | Nubelson Fernandes",
          type: "website",
        }}
      />

      <HomeSection
        title={pageData.books.title}
        subtitle={pageData.books.description}
      />
      <BooksSection books={books} />
      <ShareSection title="Share my books on" />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getData(process.env.NOTION_DATABASE_BOOKS_ID);

  const books = formatBooks(results).slice(0, 2);

  return {
    props: {
      books,
    },

    revalidate: 5,
  };
};

export default Newsletter;
