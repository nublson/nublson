import { ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../../styles/global";
import theme from "../../styles/theme";
import { Footer, Header } from "../shared";

interface LayoutProps {
  children: ReactNode;
}

const Container = styled.main`
  position: relative;

  max-width: 121.4rem;
  width: 100%;
  height: 100vh;
  margin: 0 auto;

  padding: 0rem 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header />
        {children}
        <Footer />
      </Container>
      <GlobalStyles />
    </ThemeProvider>
  );
};

export default Layout;
