"use client";

import { PrimaryIcon } from "@/components/shared/Buttons";
import copy from "copy-to-clipboard";
import { usePathname } from "next/navigation";
import {
  RiFileCopyLine,
  RiLinkedinLine,
  RiTwitterLine,
  RiWhatsappLine,
} from "react-icons/ri";
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
    } else if (source === "whatsapp") {
      return `https://wa.me/?text=${url}`;
    } else {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>{props.children}</div>
      <div className={styles.share}>
        <PrimaryIcon
          icon={<RiFileCopyLine className={styles.icon} />}
          size="regular"
          onClick={() => copy(`${process.env.BASE_URL}${pathname}`)}
        />
        <a
          className={styles.social}
          href={generateShareLink("twitter", pathname)}
          target="_blank"
          rel="noopener"
          aria-label="share twitter icon"
        >
          <RiTwitterLine className={styles.icon} />
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
        <a
          className={styles.social}
          href={generateShareLink("linkedIn", pathname)}
          target="_blank"
          rel="noopener"
          aria-label="share linkedin icon"
        >
          <RiLinkedinLine className={styles.icon} />
        </a>
      </div>
    </div>
  );
};
