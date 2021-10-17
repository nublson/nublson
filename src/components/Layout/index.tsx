import { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";

import { Header } from "../shared";

import theme from "../../styles/theme";
import GlobalStyles from "../../styles/global";

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.main`
  max-width: 121.4rem;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;

  padding: 5rem 0 10rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header />
        {children}
      </Container>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
