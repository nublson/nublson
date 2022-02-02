import styled from "styled-components";

export const WorkContainer = styled.a`
  width: 100%;
  max-width: 55rem;
  margin: 0 auto;
  padding: 3rem 3rem 1rem;
  border: 4px solid ${(props) => props.theme.colors.line};
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4.5rem;

  .icon {
    font-size: 4rem;
    color: ${(props) => props.theme.colors.off_white};
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.off_white};
    transition: all 0.2s;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 2rem 2rem 1rem;

    gap: 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    gap: 2rem;

    .icon {
      font-size: 3rem;
    }
  }

  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;

    p {
      color: ${(props) => props.theme.colors.body};
    }
  }

  .footer {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    & > :first-child {
      color: ${(props) => props.theme.colors.off_white};
      font-weight: 600;
      text-decoration: underline;
    }

    & > :last-child {
      font-weight: 600;
      color: ${(props) => props.theme.colors.label};
    }
  }
`;

export const PostContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  cursor: pointer;
  border: 4px solid transparent;

  & :hover {
    border-color: ${(props) => props.theme.colors.off_white};
    transition: all 0.2s;
  }

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .data {
    flex: 1;
    width: 100%;
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .heading {
      flex: 1;
      text-align: center;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      text-decoration: none;
      margin: 0;

      & > * {
        color: ${(props) => props.theme.colors.body};
      }
    }

    .footer {
      width: 100%;
      margin-top: 3rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      & > * {
        font-weight: 600;
        color: ${(props) => props.theme.colors.label};
      }
    }
  }
`;

export const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 35rem;

  @media ${(props) => props.theme.mediaQueries.large} {
    height: 30rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    height: 35rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    height: 25rem;
  }

  @media ${(props) => props.theme.mediaQueries.smaller} {
    height: 20rem;
  }
`;

export const ViewsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;

  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.off_black};
  border-radius: 3px;

  & > * {
    color: ${(props) => props.theme.colors.off_white};
    line-height: 1.3;
    text-align: right;
  }
`;

export const IssueContainer = styled.div`
  width: 100%;
  padding: 3rem 3rem 2rem;
  border: 4px solid ${(props) => props.theme.colors.line};
  text-decoration: none;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  &:hover {
    border-color: ${(props) => props.theme.colors.off_white};
    transition: all 0.2s;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 1rem;
  }

  .content {
    width: 100%;
    text-align: left;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;

    p {
      color: ${(props) => props.theme.colors.body};
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      gap: 1rem;
    }
  }

  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    color: ${(props) => props.theme.colors.off_white};

    & > :first-child {
      text-decoration: underline;
    }

    & > :last-child {
      color: ${(props) => props.theme.colors.label};
      text-align: right;
    }
  }
`;
