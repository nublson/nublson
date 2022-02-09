import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 2.5rem;

  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;

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
