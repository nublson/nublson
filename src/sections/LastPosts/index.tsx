import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Post } from "@/components/shared/Cards";
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
            return <Post type={type} key={index} post={item} />;
          })}
        </div>
        <Link className={styles.link} href={linkTo}>
          Full list
          <RiArrowRightLine />
        </Link>
      </div>
    </Section>
  );
};
