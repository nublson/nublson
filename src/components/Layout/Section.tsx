import { SectionProps } from "@/utils/types";
import styles from "./styles.module.scss";

const Section = ({ title, children }: SectionProps) => {
  return (
    <section className={styles.section}>
      {title && <h3 className={styles.section_title}>{title}</h3>}

      {children}
    </section>
  );
};

export default Section;
