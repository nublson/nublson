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

  & > * {
    width: 100%;
  }

  .feedback {
    color: ${(props) => props.theme.colors.off_white};
    text-align: center;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 80%;
  }

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    width: 100%;
    padding-bottom: 0rem;
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 5rem;
`;

export const CategorySection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
`;
