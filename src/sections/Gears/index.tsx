import assets from "@/assets/blur.json";
import { Gear } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import { GearProps } from "@/utils/types";
import styles from "./styles.module.scss";

interface GearSectionProps {
  data: GearProps[];
}

export const GearsSection = ({ data }: GearSectionProps) => {
  const getGearsCategory = (list: GearProps[]) => {
    const categories = list.map((item) => item.category);

    return categories.filter(
      (item, index) => categories.indexOf(item) === index
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.gears}>
        {getGearsCategory(data).map((category, index) => {
          return (
            <div
              key={index}
              className={styles.category}
              id={category.toLowerCase().replace(" ", "")}
            >
              <h2>{category}</h2>

              <div className={styles.items}>
                {data
                  .filter((item) => item.category === category)
                  .map((gear) => {
                    return (
                      <Gear
                        key={gear.id}
                        thumbnail={gear.thumbnail}
                        title={gear.title}
                        description={gear.description}
                        category={gear.category}
                        blurData={assets.base64}
                        path={gear.path}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      <Categories type="scroll" categories={getGearsCategory(data)} />
    </section>
  );
};
