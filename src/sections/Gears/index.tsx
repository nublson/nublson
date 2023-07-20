import { Gear } from "@/components/shared/Cards";
import { Categories } from "@/components/shared/Categories";
import { GearsCategoryProps } from "@/utils/types";
import styles from "./styles.module.scss";
import { getSingleImage } from "@/utils/getImage";

interface GearsSectionProps {
  data: GearsCategoryProps[];
}

export const GearsSection = async ({ data }: GearsSectionProps) => {
  return (
    <section className={styles.container}>
      <div className={styles.gears}>
        {data.map((category, index) => {
          return (
            <div
              key={index}
              className={styles.category}
              id={category.title.toLowerCase().replace(" ", "")}
            >
              <h3>{category.title}</h3>

              <div className={styles.items}>
                {category.gears.map(async (gear, index) => {
                  const { base64, img } = await getSingleImage(gear.image);

                  return (
                    <Gear
                      key={index}
                      image={img.src}
                      name={gear.name}
                      description={gear.description}
                      blurData={base64}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Categories
        type="scroll"
        categories={data.map((item) => item.title)}
        onClick={(item) => console.log(item)}
      />
    </section>
  );
};
