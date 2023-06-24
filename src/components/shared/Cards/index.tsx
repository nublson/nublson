import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";

import { CardItemProps, PostProps } from "@/utils/types";
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

export const Article = (post: PostProps) => {
  return (
    <div className={styles.article}>
      <div className={styles.thumbnail}>
        <Image src={post.image} alt="post thumbnail" fill />
      </div>
      <h2 className={styles.title}>{post.title}</h2>

      <div className={styles.footer}>
        <Link href={post.path}>Facilisis enim</Link>
        <p className={styles.category}>{post.category}</p>
      </div>
    </div>
  );
};

export const Product = (post: PostProps) => {
  return (
    <div className={styles.product}>
      <div className={styles.thumbnail}>
        <Image src={post.image} alt="post thumbnail" fill />
      </div>
      <h2 className={styles.title}>{post.title}</h2>

      <div className={styles.footer}>
        <a href={post.path} target="_blank">
          Lorem
          <RiExternalLinkLine />
        </a>
        <p className={styles.category}>{post.category}</p>
      </div>
    </div>
  );
};
