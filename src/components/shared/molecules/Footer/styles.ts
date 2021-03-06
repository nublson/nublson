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

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    padding: 3rem 1rem;
  }

  .content {
    max-width: 121.8rem;
    width: 100%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;


    .menu {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      column-gap: 2.5rem;
      list-style: none;

      li {
        &.active {
          font-weight: 600;
          text-decoration: underline;

          & > :hover {
            text-decoration: none;
          }
        }
      }

      a {
        color: ${(props) => props.theme.colors.off_black};
        text-decoration: none;

        &:hover {
          text-decoration: underline;
          transition: all 0.2s;
        }
      }
    }

    @media ${(props) => props.theme.mediaQueries.medium_s} {
      .menu {
        row-gap: 1.5rem;
      }
    }
  }
`;
