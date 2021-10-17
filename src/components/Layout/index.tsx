import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import theme from "../../styles/theme";
import GlobalStyles from "../../styles/global";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
