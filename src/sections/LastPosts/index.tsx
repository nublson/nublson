import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Article, Product } from "@/components/shared/Cards";
import { PostProps } from "@/utils/types";

interface LastPostProps {
  title: string;
  type: "articles" | "products";
  posts: PostProps[];
  linkTo: string;
}

export const LastPosts = ({ title, type, posts, linkTo }: LastPostProps) => {
  return (
    <Section title={title}>
      <div className={styles.container}>
        <div className={styles.posts}>
          {posts.map((item, index) => {
            if (type === "articles") {
              return <Article key={index} {...item} />;
            } else {
              return <Product key={index} {...item} />;
            }
          })}
        </div>
        <Link className={styles.link} href={linkTo}>
          Lorem
          <RiArrowRightLine />
        </Link>
      </div>
    </Section>
  );
};
