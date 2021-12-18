import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    gap: 5rem;
  }
`;

export const ShareContent = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  color: ${(props) => props.theme.colors.label};

  .links {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;

    & > * {
      font-weight: 600;
      color: ${(props) => props.theme.colors.off_white};
    }
  }
`;
