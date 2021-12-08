import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 1.5rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    grid-template-columns: 1fr;
  }
`;
