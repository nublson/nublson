import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  column-count: 3;
  column-gap: 2rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    column-count: 2;
    column-gap: 1rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    column-gap: 0.5rem;
  }
`;

export const Figure = styled.figure`
  position: relative;
  width: 100%;
  margin: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 2rem;
  break-inside: avoid;

  @media ${(props) => props.theme.mediaQueries.medium} {
    margin-bottom: 1rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    margin-bottom: 0.5rem;
  }
`;
