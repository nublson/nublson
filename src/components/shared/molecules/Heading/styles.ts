import styled from "styled-components";

interface ThumbnailProps {
  readonly article?: boolean;
}

export const Container = styled.div`
  width: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    gap: 0.5rem;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Thumbnail = styled.div<ThumbnailProps>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.article ? "68rem" : "46rem")};
`;
