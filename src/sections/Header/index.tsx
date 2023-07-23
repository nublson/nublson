import { getSingleImage } from "@/utils/getImage";
import Image from "next/image";
import styles from "./styles.module.scss";

interface HeaderProps {
  label: string;
  title: string;
  thumbnail: string;
  description: string;
}

export const Header = async ({
  label,
  title,
  thumbnail,
  description,
}: HeaderProps) => {
  const { base64, img } = await getSingleImage(thumbnail);

  return (
    <main className={styles.container}>
      <div className={styles.heading}>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.thumbnail}>
        <Image
          src={img.src}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={base64}
        />
      </div>
    </main>
  );
};
