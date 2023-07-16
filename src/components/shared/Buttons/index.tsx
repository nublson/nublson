import styles from "./styles.module.scss";

interface ButtonDefaultProps {
  title: string;
}

interface ButtonIconProps {
  icon: React.ReactNode;
  size: "regular" | "small";
}

export const PrimaryText = ({ title }: ButtonDefaultProps) => {
  return (
    <button className={styles.primary}>
      <p>{title}</p>
    </button>
  );
};

export const PrimaryIcon = ({ icon, size }: ButtonIconProps) => {
  return (
    <button
      className={size === "regular" ? styles.icon_regular : styles.icon_small}
    >
      {icon}
    </button>
  );
};
