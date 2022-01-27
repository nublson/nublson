import styled from "styled-components";

export const Container = styled.button`
  padding: 1rem 3.5rem;
  background-color: ${(props) => props.theme.colors.off_white};
  border: none;
  cursor: pointer;

  color: ${(props) => props.theme.colors.off_black};
  font-weight: 600;

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 0.5rem 2.5rem;
  }
`;

export const StyledIcon = styled.button`
  width: 4rem;
  height: 4rem;
  border: none;
  background-color: ${(props) => props.theme.colors.off_white};
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PurchaseContainer = styled.a`
  height: 5rem;
  padding: 0 2rem;
  margin: 2rem 0;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.block.yellow};
  color: ${(props) => props.theme.colors.off_black};
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-4px);
    transition: all 0.5s;
  }
`;
