import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.off_white};
  color: ${(props) => props.theme.colors.off_black};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 5rem 2rem;

  .content {
    max-width: 121.8rem;
    width: 100%;
    margin: 0 auto;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;

      .spotify {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;

        a {
          color: ${(props) => props.theme.colors.off_black};
          text-decoration: underline;
        }

        .icon {
          color: ${(props) => props.theme.colors.off_black};
          font-size: 2.4rem;
        }

        & > :last-child {
          font-weight: 400;
        }

        @media ${(props) => props.theme.mediaQueries.small} {
          flex-wrap: wrap;
        }
      }
    }

    .menu {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 0.5rem;

      & > * {
        color: ${(props) => props.theme.colors.off_black};
        text-decoration: underline transparent;

        &:hover {
          text-decoration: underline;
          transition: all 0.2s;
        }
      }
    }

    @media ${(props) => props.theme.mediaQueries.small} {
      flex-direction: column-reverse;
      align-items: flex-start;
      justify-content: center;

      .menu {
        align-items: flex-start;
        text-align: left;
        gap: 1.5rem;
        margin-bottom: 5rem;
      }
    }
  }
`;
