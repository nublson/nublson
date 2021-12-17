import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2.5rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 75%;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 100%;
    padding: 0;
  }
`;
