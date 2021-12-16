import styled from "styled-components";

export const StyledCategory = styled.p`
  font-size: 1.8rem;
  line-height: 25px;
  cursor: pointer;
  text-decoration: underline transparent;
  color: ${(props) => props.theme.colors.off_white};

  &.active {
    font-weight: 600;
    border-bottom: 2px solid ${(props) => props.theme.colors.off_white};

    &:hover {
      text-decoration: none;
    }
  }

  &:hover {
    text-decoration: underline;
    transition: all 0.2s;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    font-size: 1.6rem;
    line-height: 25px;
  }
`;
