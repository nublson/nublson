import Image from "next/image";
import { RiExternalLinkLine } from "react-icons/ri";

import { CardItemProps, GearProps, PostCardProps } from "@/utils/types";
import Link from "next/link";
import styles from "./styles.module.scss";

export const Work = ({ title, description, path }: CardItemProps) => {
  return (
    <div className={styles.work}>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <a
        href={path}
        target="_blank"
        rel="noopener"
        aria-label={`link to ${title}`}
      >
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
          priority
        />
      </div>
      <div className={styles.body}>
        {type === "articles" ? (
          <Link href={`/blog/${post.post_slug}`}>
            <h3 className={styles.title}>{post.title}</h3>
          </Link>
        ) : (
          <h2 className={styles.title}>{post.title}</h2>
        )}
      </div>

      <div className={styles.footer}>
        {type === "articles" ? (
          <Link href={`/blog/${post.post_slug}`}>Read post</Link>
        ) : (
          <a
            className={styles.external}
            href={post.path}
            target="_blank"
            rel="noopener"
            aria-label={`link to ${post.title}`}
          >
            Get product
            <RiExternalLinkLine />
          </a>
        )}
        <p className={styles.category}>{post.category}</p>
      </div>
    </div>
  );
};

export const Gear = ({
  thumbnail,
  title,
  description,
  blurData,
  path,
}: GearProps) => {
  return path ? (
    <a
      href={path}
      aria-label={`link to ${title}`}
      target="_blank"
      rel="noopener"
    >
      <div className={styles.gear}>
        <div className={styles.thumbnail}>
          <Image
            src={thumbnail}
            alt="gear thumbnail"
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={blurData}
            quality={100}
          />
        </div>
        <div className={styles.details}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </a>
  ) : (
    <div className={styles.gear}>
      <div className={styles.thumbnail}>
        <Image
          src={thumbnail}
          alt="gear thumbnail"
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={blurData}
          quality={100}
        />
      </div>
      <div className={styles.details}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};
