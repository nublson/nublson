import { Render } from "@9gustin/react-notion-render";
import styles from "./styles.module.scss";

interface ContentSectionProps {
  type: "articles" | "products";
  blocks: any[];
  store_path?: string;
}

export const ContentSection = ({
  type,
  blocks,
  store_path,
}: ContentSectionProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.blocks}>
        <Render blocks={blocks} simpleTitles classNames />
      </div>
    </div>
  );
};
