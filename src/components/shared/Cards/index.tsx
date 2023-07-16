import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";

import { CardItemProps, PostCardProps, PostProps } from "@/utils/types";
import styles from "./styles.module.scss";
import Link from "next/link";

export const Work = ({ title, description, path }: CardItemProps) => {
  return (
    <div className={styles.work}>
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={path} target="_blank">
        Lorem
        <RiExternalLinkLine />
      </a>
    </div>
  );
};

export const Post = ({ type, post }: PostCardProps) => {
  return (
    <div className={styles.article}>
      <div className={styles.thumbnail}>
        <Image
          src={post.thumbnail}
          alt="post thumbnail"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <h2 className={styles.title}>{post.title}</h2>

      <div className={styles.footer}>
        {type === "articles" ? (
          <Link href={`/blog/${post.post_slug}`}>Read more</Link>
        ) : (
          <a href={post.path} target="_blank">
            Visit
            <RiExternalLinkLine />
          </a>
        )}
        <p className={styles.category}>{post.category}</p>
      </div>
    </div>
  );
};
