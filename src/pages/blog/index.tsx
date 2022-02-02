import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getData } from "../../services/notion";
import { formatPosts } from "../../utils/formatter";
import pageData from "../../utils/pageData.json";
import { IPostItem } from "../../utils/types";

const HomeSection = dynamic(() => import("../../section/Home"));
const PostsSection = dynamic(() => import("../../section/Posts"));
const NewsletterSection = dynamic(() => import("../../section/Newsletter"));
const ContactSection = dynamic(() => import("../../section/Contact"));

type BlogProps = {
  posts: IPostItem[];
};

const Blog: NextPage<BlogProps> = ({ posts }) => {
  const { asPath } = useRouter();

  return (
    <>
      <NextSeo
        title="Blog | Nubelson Fernandes"
        description={pageData.blog.description}
        canonical={`${process.env.BASE_URL}${asPath}`}
        openGraph={{
          title: "Blog | Nubelson Fernandes",
          description: pageData.blog.description,
          url: `${process.env.BASE_URL}${asPath}`,
          type: "blog",
          images: [
            {
              url: pageData.blog.image,
              width: 1920,
              height: 1080,
              alt: pageData.blog.title,
            },
          ],
          site_name: "Blog | Nubelson Fernandes",
        }}
      />
      <HomeSection
        id="home"
        top={pageData.blog.top}
        title={pageData.blog.title}
        subtitle={pageData.blog.description}
        image={pageData.blog.image}
        scrollTo="posts"
      />
      <PostsSection posts={posts} />
      <NewsletterSection />
      <ContactSection />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const results = await getData(process.env.NOTION_DATABASE_ID, "article");

  const posts = formatPosts(results);

  return {
    props: {
      posts,
    },

    revalidate: 5,
  };
};

export default Blog;
