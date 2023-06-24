import Section from "@/components/Layout/Section";
import { Work } from "@/components/shared/Cards";

import { CardItemProps } from "@/utils/types";
import styles from "./styles.module.scss";

interface WorkProps {
  workList: CardItemProps[];
}

export const WorkSection = ({ workList }: WorkProps) => {
  return (
    <Section title="Amet lorem varius egestas fames facilisi dolor viverra massa lectus.">
      <div className={styles.grid}>
        {workList.map((item, index) => (
          <Work key={`${item.title}_${index}`} {...item} />
        ))}
      </div>
    </Section>
  );
};
