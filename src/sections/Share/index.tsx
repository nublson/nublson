"use client";

import { usePathname } from "next/navigation";
import { RiTwitterXLine, RiWhatsappLine } from "react-icons/ri";
import styles from "./styles.module.scss";

interface ShareSectionProps {
  children: React.ReactNode;
}

const generateShareLink = (source: string, path: string) => {
  const url = `${process.env.BASE_URL}${path}`;
  return source === "x"
    ? `https://x.com/intent/tweet?url=${url}`
    : `https://wa.me/?text=${url}`;
};

export const ShareSection = ({ children }: ShareSectionProps) => {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.info}>{children}</div>
      <div className={styles.share}>
        <a
          className={styles.social}
          href={generateShareLink("x", pathname)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="share twitter icon"
        >
          <RiTwitterXLine className={styles.icon} />
        </a>
        <a
          className={styles.social}
          href={generateShareLink("whatsapp", pathname)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="share whatsapp icon"
        >
          <RiWhatsappLine className={styles.icon} />
        </a>
      </div>
    </div>
  );
};
