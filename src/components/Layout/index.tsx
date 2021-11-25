import { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../../styles/global";
import theme from "../../styles/theme";
import { Header, Footer } from "../shared/molecules";

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  padding-top: 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 100%;
  max-width: 121.8rem;

  margin: 0 auto;

  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Container>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
