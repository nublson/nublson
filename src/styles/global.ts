import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  html{
    font-size: 62.5%;

    @media ${(props) => props.theme.mediaQueries.larger} {
      font-size: 60%;
    }

    @media ${(props) => props.theme.mediaQueries.large} {
      font-size: 57.5%;
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      font-size: 55%;
    }
  }

  body{
    font: 400 1.8rem 'Poppins', sans-serif;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.body};
  }

  h1, h2, h3{
    font-weight: 700;
  }

  h1{
    font-size: 6.4rem;
    line-height: 66px;
  }

  h2{
    font-size: 4.8rem;
    line-height: 50px;
  }

  h3{
    font-size: 3.2rem;
    line-height: 34px;
  }

  p{
    line-height: 25px;
  }
`;
