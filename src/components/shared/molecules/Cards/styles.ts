import styled from "styled-components";

export const WorkContainer = styled.a`
  width: 100%;
  padding: 5rem 5rem 3rem;
  border: 4px solid ${(props) => props.theme.colors.line};
  text-decoration: none;

  &:hover {
    border-color: ${(props) => props.theme.colors.off_white};
    transition: all 0.2s;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4.5rem;

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

export const BlogContainer = styled.div`
  position: relative;
  width: 100%;
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
`;
