import Image from "next/image";
import styles from "./styles.module.scss";

interface HeaderProps {
  label: string;
  title: string;
  description: string;
}

export const Header = ({ label, title, description }: HeaderProps) => {
  return (
    <main className={styles.container}>
      <div className={styles.heading}>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.thumbnail}>
        <Image
          src={
            "https://res.cloudinary.com/nublson/image/upload/v1687615248/Portfolio/Pages/AnyConv.com__Profile_Horizontal_Hight_nudv1c.webp"
          }
          alt="Nubelson Fernandes"
          fill
        />
      </div>
    </main>
  );
};
