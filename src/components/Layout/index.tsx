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

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 0 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 0;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 121.8rem;
  min-height: 100vh;

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
      <Header />
      <Container>
        <Content>{children}</Content>
      </Container>
      <Footer />
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
