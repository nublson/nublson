import assets from "@/assets/blur.json";
import Image from "next/image";
import styles from "./styles.module.scss";

interface HeaderProps {
  label: string;
  title: string;
  thumbnail: string;
  description?: string;
}

export const Header = ({
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

      <Image
        className={styles.thumbnail}
        src={thumbnail}
        alt={title}
        width={1920}
        height={1080}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        placeholder="blur"
        blurDataURL={assets.base64}
        priority
      />
    </main>
  );
};
