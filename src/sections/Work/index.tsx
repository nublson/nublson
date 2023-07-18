import Section from "@/components/Layout/Section";
import { Work } from "@/components/shared/Cards";

import { CardItemProps } from "@/utils/types";
import styles from "./styles.module.scss";

interface WorkProps {
  title: string;
  workList: CardItemProps[];
}

export const WorkSection = ({ title, workList }: WorkProps) => {
  return (
    <Section title={title}>
      <div className={styles.grid}>
        {workList.map((item, index) => (
          <Work key={`${item.title}_${index}`} {...item} />
        ))}
      </div>
    </Section>
  );
};
