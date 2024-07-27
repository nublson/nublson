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

const getPriceValue = (price?: number | null) => {
  if (price === null) return null;
  return price === 0 ? "- FREE" : `- ${price}€`;
};

const ImageBlock = withContentValidation((props: any) => {
  if (props.media?.src) {
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
  }
  return null;
});

export const ContentSection = ({ blocks, data }: ContentSectionProps) => (
  <section className={styles.container}>
    {data.path && (
      <a
        className={styles.getButton}
        href={data.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="get button"
      >
        <RiStore2Line className={styles.icon} />
        <p>Get Here {getPriceValue(data.price)}</p>
      </a>
    )}
    <div className={styles.blocks}>
      <Render
        blocks={blocks}
        simpleTitles
        classNames
        blockComponentsMapper={{
          image: ImageBlock,
        }}
      />
    </div>
  </section>
);
