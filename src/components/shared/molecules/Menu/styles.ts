import styled from "styled-components";

export const WebContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.small} {
    display: none;
  }

  ul {
    list-style: none;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }
`;

export const MobileContainer = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaQueries.small} {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 30px;
      color: ${(props) => props.theme.colors.off_white};

      &_close {
        position: fixed;
        right: 2rem;
        z-index: 10;
      }
    }

    .container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${(props) => props.theme.colors.background};
      width: 100vw;
      height: 100vh;
      z-index: 9;

      display: flex;
      align-items: center;
      justify-content: center;

      ul {
        list-style: none;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4rem;

        p {
          font-size: 2.2rem;
        }
      }
    }
  }
`;

export const StyledItem = styled.li`
  &.active {
    font-weight: 600;
    border-bottom: 2px solid ${(props) => props.theme.colors.off_white};

    & > :hover {
      text-decoration: none;
    }
  }

  a {
    color: ${(props) => props.theme.colors.off_white};
    text-decoration: underline transparent;

    &:hover {
      text-decoration: underline;
      transition: all 0.2s;
    }
  }
`;
