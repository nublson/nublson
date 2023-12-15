"use client";

import { usePathname } from "next/navigation";
import { RiTwitterXLine, RiWhatsappLine } from "react-icons/ri";
import styles from "./styles.module.scss";

interface ShareSectionProps {
  children: React.ReactNode;
}

export const ShareSection = (props: ShareSectionProps) => {
  const pathname = usePathname();

  const generateShareLink = (source: string, path: string) => {
    const url = `${process.env.BASE_URL}${path}`;

    if (source === "twitter") {
      return `https://twitter.com/intent/tweet?url=${url}`;
    } else {
      return `https://wa.me/?text=${url}`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>{props.children}</div>
      <div className={styles.share}>
        <a
          className={styles.social}
          href={generateShareLink("twitter", pathname)}
          target="_blank"
          rel="noopener"
          aria-label="share twitter icon"
        >
          <RiTwitterXLine className={styles.icon} />
        </a>
        <a
          className={styles.social}
          href={generateShareLink("whatsapp", pathname)}
          target="_blank"
          rel="noopener"
          aria-label="share whatsapp icon"
        >
          <RiWhatsappLine className={styles.icon} />
        </a>
      </div>
    </div>
  );
};
