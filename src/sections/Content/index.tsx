import assets from "@/assets/blur.json";
import { PostProps } from "@/utils/types";
import { Render, withContentValidation } from "@9gustin/react-notion-render";
import Image from "next/image";
import { RiStore2Line } from "react-icons/ri";
import styles from "./styles.module.scss";

interface ContentSectionProps {
  blocks: any[];
  data: PostProps;
}

export const ContentSection = ({ blocks, data }: ContentSectionProps) => {
  return (
    <section className={styles.container}>
      <div className={styles.blocks}>
        <Render
          blocks={blocks}
          simpleTitles
          classNames
          blockComponentsMapper={{
            image: withContentValidation((props) => {
              if (props.media && props.media.src) {
                return (
                  <Image
                    src={props.media.src}
                    alt={props.media.alt}
                    width={1920}
                    height={1080}
                    placeholder="blur"
                    blurDataURL={assets.base64}
                  />
                );
              } else {
                return null;
              }
            }),
          }}
        />
      </div>
      {data.path && (
        <a
          className={styles.getButton}
          href={data.path}
          target="_blank"
          rel="noopener"
          aria-label="share twitter icon"
        >
          <RiStore2Line className={styles.icon} />
          <p>Get Now</p>
        </a>
      )}
    </section>
  );
};
