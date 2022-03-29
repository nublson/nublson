import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2.5rem;

  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1.5rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 75%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media ${(props) => props.theme.mediaQueries.medium_m} {
    width: 100%;
  }

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    padding: 0;
    gap: 1rem;
  }
`;
