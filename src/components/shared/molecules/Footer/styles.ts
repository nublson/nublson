import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
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

      & > :last-child {
        color: ${(props) => props.theme.colors.label};
      }

      .spotify {
        font-weight: 700;

        display: flex;
        align-items: center;
        gap: 0.5rem;

        .icon {
          color: ${(props) => props.theme.colors.off_black};
          font-size: 2.4rem;
        }

        & > :last-child {
          font-weight: normal;
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
  }
`;
