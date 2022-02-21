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

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }
`;
