import styled from "styled-components";

interface BlogListProps {
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

export const BlogList = styled.div<BlogListProps>`
  width: 100%;
  height: 100%;
  text-align: center;

  display: grid;
  grid-template-columns: ${(props) =>
    props.center ? `0.5fr 1fr 0.5fr` : `repeat(2, 1fr)`};
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;

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
    grid-template-columns: 1fr;
    grid-gap: 3.5rem;

    ${(props) =>
      props.center &&
      `
      & > :first-child {
        grid-column-start: 1;
        grid-column-end: 2;
      }
    `}
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 100%;
  }
`;
