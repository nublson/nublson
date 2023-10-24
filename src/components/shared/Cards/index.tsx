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
        <h3 className={styles.title}>{post.title}</h3>
      </div>

      <div className={styles.footer}>
        <span className={type !== "articles" ? styles.external : ""}>
          {type === "articles" ? "Read" : type === "products" ? "Get" : "Watch"}
          {type !== "articles" && <RiExternalLinkLine />}
        </span>
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
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
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
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
