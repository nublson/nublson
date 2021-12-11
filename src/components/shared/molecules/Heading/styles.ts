import styled from "styled-components";

interface ThumbnailProps {
  readonly article?: boolean;
}

export const Container = styled.div`
  position: relative;
  width: 100%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    gap: 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    gap: 2rem;
  }
`;

export const Content = styled.div`
  width: 80%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 100%;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    flex: 1;

    gap: 0.5rem;

    & > :last-child {
      width: 90%;
    }
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    h1 {
      font-size: 3rem;
    }

    & > :last-child {
      width: 100%;
    }
  }
`;

export const Thumbnail = styled.div<ThumbnailProps>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.article ? "68rem" : "46rem")};

  @media ${(props) => props.theme.mediaQueries.small} {
    height: ${(props) => (props.article ? "23.5rem" : "50.5rem")};
  }
`;
