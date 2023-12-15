import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

interface ButtonDefaultProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size: "regular" | "small";
}

export const PrimaryText = ({ title, ...props }: ButtonDefaultProps) => {
  return (
    <button className={styles.primary} {...props}>
      <p>{title}</p>
    </button>
  );
};

export const PrimaryIcon = ({ children, size, ...props }: ButtonIconProps) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
