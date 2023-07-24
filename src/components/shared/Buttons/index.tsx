import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonDefaultProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size: "regular" | "small";
}

export const PrimaryText = ({ title, ...props }: ButtonDefaultProps) => {
  return (
    <button className={styles.primary} {...props}>
      <p>{title}</p>
    </button>
  );
};

export const PrimaryIcon = ({ icon, size, ...props }: ButtonIconProps) => {
  return (
    <button
      className={size === "regular" ? styles.icon_regular : styles.icon_small}
      {...props}
    >
      {icon}
    </button>
  );
};
