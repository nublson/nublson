import { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../../styles/global";
import theme from "../../styles/theme";
import Footer from "../shared/molecules/Footer";
import Header from "../shared/molecules/Header";

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.main`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 100%;
  max-width: 121.8rem;
  min-height: 100vh;

  margin: 0 auto;

  padding: 0 2rem;
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 0;
  }
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
