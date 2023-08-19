import { Gear } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import { getRemoteImage } from "@/utils/getImage";
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
                  .map(async (gear) => {
                    const { base64, img } = await getRemoteImage(
                      gear.thumbnail
                    );

                    return (
                      <Gear
                        key={gear.id}
                        thumbnail={img.src}
                        title={gear.title}
                        description={gear.description}
                        category={gear.category}
                        blurData={base64}
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
