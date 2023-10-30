import Section from "@/components/Layout/Section";
import { RiArrowRightLine } from "react-icons/ri";

import Link from "next/link";
import styles from "./styles.module.scss";

import { Post } from "@/components/shared/Cards";
import { getRemoteImage } from "@/utils/getImage";
import { PostProps } from "@/utils/types";

interface LastPostProps {
  title: string;
  type?: "articles" | "products" | "videos" | "newsletter";
  posts: PostProps[];
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

            if (type === "articles") {
              return (
                <Link key={item.id} href={`/blog/${item.post_slug}`}>
                  <Post
                    type={type}
                    post={{ ...item, thumbnail: img.src }}
                    blurData={base64}
                  />
                </Link>
              );
            } else {
              return (
                <a
                  key={item.id}
                  href={item.path}
                  target="_blank"
                  rel="noopener"
                  aria-label={`link to ${item.title}`}
                >
                  <Post
                    type={type}
                    post={{ ...item, thumbnail: img.src }}
                    blurData={base64}
                  />
                </a>
              );
            }
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
