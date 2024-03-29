import { Header } from "../shared/Header";
import styles from "./styles.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
};
