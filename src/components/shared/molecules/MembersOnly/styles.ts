import styled from "styled-components";

export const Container = styled.a`
  width: 100%;
  height: 100%;
  padding: 5rem 1rem;
  color: ${(props) => props.theme.colors.off_white};
  border: 4px solid ${(props) => props.theme.colors.primary_light};
  -webkit-box-shadow: 5px 5px 25px 1px rgba(0, 0, 0, 0.27);
  box-shadow: 5px 5px 25px 1px rgba(0, 0, 0, 0.27);
  transition: all 0.2s;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  .icon {
    font-size: 5rem;
    transition: all 0.2s;
  }

  .content {
    width: 100%;
    text-align: center;

    p {
      color: ${(props) => props.theme.colors.body};
      margin-top: 1rem;
    }
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.buy_me_a_coffee};

    .icon {
      color: ${(props) => props.theme.colors.buy_me_a_coffee};
    }
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 3rem 1rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 2rem 1rem;

    border-color: ${(props) => props.theme.colors.buy_me_a_coffee};

    .icon {
      color: ${(props) => props.theme.colors.buy_me_a_coffee};
    }
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    padding: 1rem;
  }
`;
