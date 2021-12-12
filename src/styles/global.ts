import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }

  html{
    height: 100%;
    font-size: 62.5%;

    @media ${(props) => props.theme.mediaQueries.large} {
      font-size: 60%;
    }

    @media ${(props) => props.theme.mediaQueries.medium} {
      font-size: 57.5%;
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      font-size: 55%;
    }
  }

  body{
    font: 400 1.8rem 'Poppins', sans-serif;
    font-display: optional;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.body};
  }

  a{
    text-decoration: none;
  }

`;
