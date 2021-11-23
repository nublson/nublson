import styled from "styled-components";

export const WorkContainer = styled.div`
  width: 100%;
  padding: 5rem 5rem 3rem;
  border: 4px solid ${(props) => props.theme.colors.line};

  &:hover {
    border-color: ${(props) => props.theme.colors.off_white};
    transition: all 0.2s;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4.5rem;

  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;
  }

  .footer {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .link {
      color: ${(props) => props.theme.colors.off_white};
      font-weight: 600;
    }

    & > :last-child {
      font-weight: 600;
      color: ${(props) => props.theme.colors.label};
    }
  }
`;
