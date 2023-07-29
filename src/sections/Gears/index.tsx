import { Gear } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import { getGears } from "@/services/notion";
import { getSingleImage } from "@/utils/getImage";
import { GearProps } from "@/utils/types";
import styles from "./styles.module.scss";

export const revalidate = 60;

export const GearsSection = async () => {
  const gears = await getGears(process.env.NOTION_DATABASE_GEARS_ID);

  const getGearsCategory = (list: GearProps[]) => {
    const categories = list.map((item) => item.category);

    return categories.filter(
      (item, index) => categories.indexOf(item) === index
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.gears}>
        {getGearsCategory(gears).map((category, index) => {
          return (
            <div
              key={index}
              className={styles.category}
              id={category.toLowerCase().replace(" ", "")}
            >
              <h2>{category}</h2>

              <div className={styles.items}>
                {gears
                  .filter((item) => item.category === category)
                  .map(async (gear, index) => {
                    const { base64, img } = await getSingleImage(
                      gear.thumbnail
                    );

                    return (
                      <Gear
                        key={index}
                        thumbnail={img.src}
                        title={gear.title}
                        description={gear.description}
                        category={gear.category}
                        blurData={base64}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      <Categories type="scroll" categories={getGearsCategory(gears)} />
    </section>
  );
};
