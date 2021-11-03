import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.label};

  position: absolute;
  bottom: 10rem;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  .icons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;

    a {
      color: ${(props) => props.theme.colors.off_white};
      font-size: 2.5rem;
    }
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    bottom: 5rem;
    gap: 1rem;

    .icons {
      gap: 1.5rem;

      a {
        font-size: 2.2rem;
      }
    }
  }
`;
