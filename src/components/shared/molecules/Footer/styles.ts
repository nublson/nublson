import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 8rem;
  background-color: ${(props) => props.theme.colors.off_white};
  color: ${(props) => props.theme.colors.off_black};

  display: flex;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 0rem 2rem;
  }

  .content {
    max-width: 121.8rem;
    width: 100%;
    margin: 0 auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
