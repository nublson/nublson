import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Post } from "@/components/shared/Cards";
import { getSingleImage } from "@/utils/getImage";
import { PageProps } from "@/utils/types";

interface LastPostProps {
  title: string;
  type: "articles" | "products";
  posts: PageProps[];
  linkTo: string;
}

export const LastPosts = ({ title, type, posts, linkTo }: LastPostProps) => {
  return (
    <Section title={title}>
      <div className={styles.container}>
        <div className={styles.posts}>
          {posts.map(async (item) => {
            const { base64, img } = await getSingleImage(item.thumbnail);

            return (
              <Post
                type={type}
                key={item.id}
                post={{ ...item, thumbnail: img.src }}
                blurData={base64}
              />
            );
          })}
        </div>
        <Link className={styles.link} href={linkTo}>
          <p>Full list</p>
          <RiArrowRightLine />
        </Link>
      </div>
    </Section>
  );
};
