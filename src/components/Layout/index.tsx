import { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";

import theme from "../../styles/theme";
import GlobalStyles from "../../styles/global";

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.main`
  max-width: 121.4rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>{children}</Container>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
