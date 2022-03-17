import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../../styles/global";
import theme from "../../styles/theme";
import { ILayoutProps } from "../../utils/types";
import Footer from "../shared/molecules/Footer";
import Header from "../shared/molecules/Header";

const Container = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  width: 100%;
  max-width: 121.8rem;
  margin: 0 auto;
  height: 100%;

  padding: 0 2rem;
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    padding: 0;
  }
`;

const Layout = ({ children }: ILayoutProps) => {
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
