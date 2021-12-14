import styled from "styled-components";

export const Container = styled.header`
  width: 100%;
  max-width: 121.8rem;

  margin: 3rem auto 0rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 0rem 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    margin: 0 auto;
    padding: 4rem 2rem 1rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    background-color: ${(props) => props.theme.colors.background};
  }
`;
