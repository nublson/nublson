import { getRemoteImage } from "@/utils/getImage";
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
        <Render blocks={blocks} simpleTitles classNames />
      </div>
    </section>
  );
};
