"use client";

import { PrimaryIcon, PrimaryText } from "@/components/shared/Buttons";
import { usePathname } from "next/navigation";
import { RiLinkedinLine, RiTwitterLine, RiWhatsappLine } from "react-icons/ri";
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
        <a
          href={generateShareLink("twitter", pathname)}
          target="_blank"
          rel="noopener"
        >
          <PrimaryIcon
            size="small"
            icon={<RiTwitterLine className={styles.icon} />}
          />
        </a>
        <a
          href={generateShareLink("whatsapp", pathname)}
          target="_blank"
          rel="noopener"
        >
          <PrimaryIcon
            size="small"
            icon={<RiWhatsappLine className={styles.icon} />}
          />
        </a>
        <a
          href={generateShareLink("linkedIn", pathname)}
          target="_blank"
          rel="noopener"
        >
          <PrimaryIcon
            size="small"
            icon={<RiLinkedinLine className={styles.icon} />}
          />
        </a>
      </div>
    </div>
  );
};
