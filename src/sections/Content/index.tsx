import assets from "@/assets/blur.json";
import { Render, withContentValidation } from "@9gustin/react-notion-render";
import Image from "next/image";
import styles from "./styles.module.scss";

interface ContentSectionProps {
  blocks: any[];
}

export const ContentSection = ({ blocks }: ContentSectionProps) => {
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
    </section>
  );
};
