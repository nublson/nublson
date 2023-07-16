import { Gear } from "@/components/shared/Cards";
import { GearsCategoryProps } from "@/utils/types";
import styles from "./styles.module.scss";

interface GearsSectionProps {
  data: GearsCategoryProps[];
}

export const GearsSection = ({ data }: GearsSectionProps) => {
  return (
    <section className={styles.container}>
      <div className={styles.gears}>
        {data.map((category, index) => {
          return (
            <div key={index} className={styles.category}>
              <h3>{category.title}</h3>

              <div className={styles.items}>
                {category.gears.map((gear, index) => {
                  return <Gear key={index} {...gear} />;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.categories}>
        <p>Categories</p>
      </div>
    </section>
  );
};
