import { GearsCategoryProps } from "@/utils/types";
import styles from "./styles.module.scss";

interface GearsSectionProps {
  data: GearsCategoryProps[];
}

export const GearsSection = ({ data }: GearsSectionProps) => {
  return <div className={styles.container}></div>;
};
