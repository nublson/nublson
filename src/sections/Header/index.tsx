import assets from "@/assets/blur.json";
import Image from "next/image";
import styles from "./styles.module.scss";

interface HeaderProps {
  label: string;
  title: string;
  thumbnail: string;
  description?: string;
}

export const Header = async ({
  label,
  title,
  thumbnail,
  description,
}: HeaderProps) => {
  return (
    <main className={styles.container}>
      <div className={styles.heading}>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.thumbnail}>
        <Image
          src={thumbnail}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={assets.base64}
          priority
        />
      </div>
    </main>
  );
};
