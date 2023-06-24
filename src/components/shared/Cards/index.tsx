import { RiExternalLinkLine } from "react-icons/ri";

import { CardItemProps } from "@/utils/types";
import styles from "./styles.module.scss";

export const Work = ({ title, description, path }: CardItemProps) => {
  return (
    <div className={styles.work}>
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={path} target="_blank">
        Lorem
        <RiExternalLinkLine />
      </a>
    </div>
  );
};
