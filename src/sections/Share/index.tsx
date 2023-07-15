import { PrimaryIcon } from "@/components/shared/Buttons";
import { RiLinkedinLine, RiTwitterLine, RiWhatsappLine } from "react-icons/ri";
import styles from "./styles.module.scss";

interface ShareSectionProps {
  children: React.ReactNode;
}

export const ShareSection = (props: ShareSectionProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>{props.children}</div>
      <div className={styles.share}>
        <PrimaryIcon icon={<RiTwitterLine size={"24px"} />} />
        <PrimaryIcon icon={<RiWhatsappLine size={"24px"} />} />
        <PrimaryIcon icon={<RiLinkedinLine size={"24px"} />} />
      </div>
    </div>
  );
};
