import styles from "./styles.module.scss";

interface ButtonDefaultProps {
  title: string;
}

interface ButtonIconProps {
  icon: React.ReactNode;
}

export const PrimaryText = ({ title }: ButtonDefaultProps) => {
  return (
    <button className={styles.primary}>
      <p>{title}</p>
    </button>
  );
};

export const PrimaryIcon = ({ icon }: ButtonIconProps) => {
  return <button className={styles.icon}>{icon}</button>;
};
