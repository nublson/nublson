import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 15rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 0 5rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 0;
  }
`;

export const CTA = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 5rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5rem;
`;
