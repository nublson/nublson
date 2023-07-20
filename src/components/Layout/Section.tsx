import { SectionProps } from "@/utils/types";
import styles from "./styles.module.scss";

const Section = ({ title, children }: SectionProps) => {
  return (
    <section className={styles.section}>
      {title && <h5 className={styles.section_title}>{title}</h5>}

      {children}
    </section>
  );
};

export default Section;
