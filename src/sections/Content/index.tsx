import { Render, withContentValidation } from "@9gustin/react-notion-render";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { getSingleImage } from "@/utils/getImage";

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
            image: withContentValidation(async (props) => {
              if (props.media && props.media.src) {
                const { base64, img } = await getSingleImage(props.media.src);

                return (
                  <Image
                    src={img.src}
                    alt={props.media.alt}
                    width={img.width}
                    height={img.height}
                    placeholder="blur"
                    blurDataURL={base64}
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
