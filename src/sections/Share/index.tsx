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
        <PrimaryIcon size="small" icon={<RiTwitterLine size={"20px"} />} />
        <PrimaryIcon size="small" icon={<RiWhatsappLine size={"20px"} />} />
        <PrimaryIcon size="small" icon={<RiLinkedinLine size={"20px"} />} />
      </div>
    </div>
  );
};
