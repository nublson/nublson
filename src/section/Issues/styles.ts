import styled from "styled-components";

export const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  padding-bottom: 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  .feedback {
    color: ${(props) => props.theme.colors.off_white};
    text-align: center;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 80%;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 90%;
    padding-bottom: 0rem;
  }
`;
