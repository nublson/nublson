import { ReactNode } from "react";
import GlobalStyles from "../../styles/global";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}
      <GlobalStyles />
    </>
  );
};

export default Layout;
