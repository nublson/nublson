import styled from "styled-components";

interface PostListProps {
  center?: boolean;
}

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 11rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    gap: 5rem;
  }

  & > :last-child {
    font-weight: 600;
    color: ${(props) => props.theme.colors.off_white};
    text-decoration: underline transparent;

    &:hover {
      text-decoration: underline;
      transition: all 0.2s;
    }
  }
`;

export const PostList = styled.div<PostListProps>`
  width: 100%;
  height: 100%;
  text-align: center;

  display: grid;
  grid-template-columns: ${(props) =>
    props.center ? `0.5fr 1fr 0.5fr` : `repeat(2, 1fr)`};
  grid-template-rows: 1fr;
  grid-gap: ${(props) => (props.center ? `0` : `1.5rem`)};

  ${(props) =>
    props.center &&
    `
      & > :first-child {
        grid-column-start: 2;
        grid-column-end: 3;
      }
  `}

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 75%;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 100%;
  }
`;
