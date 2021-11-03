import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 0 2rem;

  position: absolute;
  top: 5rem;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 3rem 2rem 1rem;

    top: 0;
  }
`;
