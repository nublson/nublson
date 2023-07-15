import { Render } from "@9gustin/react-notion-render";
import styles from "./styles.module.scss";
import Link from "next/link";

interface ContentSectionProps {
  blocks: any[];
}

export const ContentSection = ({ blocks }: ContentSectionProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.blocks}>
        <Render blocks={blocks} simpleTitles classNames />
      </div>
    </div>
  );
};
