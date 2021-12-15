import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 80%;

    flex-direction: column;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 100%;
  }
`;
