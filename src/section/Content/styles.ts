import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rem;
`;

export const StyledContent = styled.div`
  width: 80%;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 90%;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 100%;
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
