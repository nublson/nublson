import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Post } from "@/components/shared/Cards";
import { getRemoteImage } from "@/utils/getImage";
import { PostProps, VideoProps } from "@/utils/types";

interface LastPostProps {
  title: string;
  type?: "articles" | "products" | "videos";
  posts: PostProps[] | VideoProps[];
  linkTo?: string;
  external?: boolean;
}

export const LastPosts = ({
  title,
  type,
  posts,
  linkTo,
  external,
}: LastPostProps) => {
  return (
    <Section title={title}>
      <div className={styles.container}>
        <div className={styles.posts}>
          {posts.map(async (item) => {
            const { base64, img } = await getRemoteImage(item.thumbnail);

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
        {linkTo &&
          (external ? (
            <a
              className={styles.link}
              href={linkTo}
              target="_blank"
              rel="noopener"
              aria-label={`link to ${title}`}
            >
              <p>Full list</p>
              <RiArrowRightLine />
            </a>
          ) : (
            <Link className={styles.link} href={linkTo}>
              <p>Full list</p>
              <RiArrowRightLine />
            </Link>
          ))}
      </div>
    </Section>
  );
};
