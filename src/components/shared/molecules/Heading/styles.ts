import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    gap: 0.5rem;
  }
`;
