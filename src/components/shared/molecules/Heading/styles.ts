import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  width: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    gap: 0.5rem;
  }
`;

export const Content = styled.div``;

export const Thumbnail = styled.div``;
