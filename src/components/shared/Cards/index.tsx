import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";

import { CardItemProps, GearProps, PostCardProps } from "@/utils/types";
import Link from "next/link";
import styles from "./styles.module.scss";

export const Work = ({ title, description, path }: CardItemProps) => {
  return (
    <div className={styles.work}>
      <div className={styles.body}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <a href={path} target="_blank">
        Visit
        <RiExternalLinkLine />
      </a>
    </div>
  );
};

export const Post = ({ type, post, blurData }: PostCardProps) => {
  return (
    <div className={styles.post}>
      <div className={styles.thumbnail}>
        <Image
          src={post.thumbnail}
          alt="post thumbnail"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={blurData}
        />
      </div>
      <div className={styles.body}>
        {type === "articles" ? (
          <Link href={`/blog/${post.post_slug}`}>
            <h2 className={styles.title}>{post.title}</h2>
          </Link>
        ) : (
          <h2 className={styles.title}>{post.title}</h2>
        )}
      </div>

      <div className={styles.footer}>
        {type === "articles" ? (
          <Link href={`/blog/${post.post_slug}`}>Read more</Link>
        ) : (
          <a className={styles.external} href={post.path} target="_blank">
            Visit
            <RiExternalLinkLine />
          </a>
        )}
        <p className={styles.category}>{post.category}</p>
      </div>
    </div>
  );
};

export const Gear = ({ image, name, description, blurData }: GearProps) => {
  return (
    <div className={styles.gear}>
      <div className={styles.thumbnail}>
        <Image
          src={image}
          alt="gear thumbnail"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={blurData}
        />
      </div>
      <div className={styles.details}>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};
