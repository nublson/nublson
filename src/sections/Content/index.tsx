import { Render, withContentValidation } from "@9gustin/react-notion-render";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";

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
