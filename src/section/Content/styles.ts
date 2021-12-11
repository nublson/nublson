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

export const StyledContent = styled.div`
  width: 100%;
  margin: 4rem auto 0;
  padding: 0 15rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding: 0 5rem;
    margin-top: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    padding: 0;
    margin-top: 1rem;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    margin: 2rem 0;
  }

  a {
    display: inline-block;
    color: inherit;
  }

  .title {
    cursor: default;
  }

  .rnr- {
    &heading_1 {
      width: 100%;
      margin: 5rem 0 2rem;
      color: ${(props) => props.theme.colors.title};
      font-size: 6.4rem;
      line-height: 66px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 3.6rem;
        line-height: 36px;
      }
    }

    &heading_2 {
      width: 100%;
      margin: 4rem 0 2rem;
      color: ${(props) => props.theme.colors.title};
      font-size: 4.8rem;
      line-height: 50px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 2.4rem;
        line-height: 32px;
      }
    }

    &heading_3 {
      width: 100%;
      margin: 3rem 0 1.5rem;
      color: ${(props) => props.theme.colors.title};
      font-size: 3.2rem;
      line-height: 34px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 2.2rem;
        line-height: 32px;
      }
    }

    &paragraph {
      font-size: 1.8rem;
      line-height: 30px;
      margin: 1rem 0;

      a {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.label};

        &:hover {
          color: ${(props) => props.theme.colors.off_white};
          transition: all 0.2s;
        }
      }

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 1.6rem;
        line-height: 25px;
      }
    }

    &empty-block {
      width: 100%;
      height: 2rem;

      @media ${(props) => props.theme.mediaQueries.medium} {
        height: 1rem;
      }

      @media ${(props) => props.theme.mediaQueries.medium} {
        height: 0.5rem;
      }
    }

    &callout {
      width: 100%;
      background-color: ${(props) => props.theme.colors.input_background};
      padding: 2rem;
      border-radius: 3px;
      margin: 2rem 0;

      @media ${(props) => props.theme.mediaQueries.medium} {
        margin: 1rem 0;
      }

      @media ${(props) => props.theme.mediaQueries.small} {
        padding: 1rem;
      }

      span {
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }
    }

    &quote {
      width: 100%;
      padding: 2rem;
      margin: 2rem 0;
      border-left: 3px solid ${(props) => props.theme.colors.off_white};
      font-size: 1.8rem;
      line-height: 25px;
      font-style: italic;

      @media ${(props) => props.theme.mediaQueries.medium} {
        margin: 1rem 0;
      }

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 1.6rem;
        padding: 1rem;
      }
    }

    &bulleted_list_item {
      width: 100%;
      list-style-position: inside;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }
    }

    &numbered_list_item {
      width: 100%;
      list-style-position: inside;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }
    }

    &to_do {
      width: 100%;
      list-style: none;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }

        input {
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 1rem;
        }
      }
    }

    &toggle {
      width: 100%;
      list-style: none;

      summary {
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }

      p {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0 0 2rem;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }
    }

    &video,
    &pdf,
    &embed {
      margin: 2rem 0;
      width: 100%;
      height: 51.638rem;

      @media ${(props) => props.theme.mediaQueries.large} {
        height: 41rem;
      }

      @media ${(props) => props.theme.mediaQueries.medium} {
        height: 39rem;
      }

      @media ${(props) => props.theme.mediaQueries.small} {
        height: 25rem;
      }

      @media ${(props) => props.theme.mediaQueries.smaller} {
        height: 21.7rem;
      }

      @media ${(props) => props.theme.mediaQueries.smallest} {
        height: 18.4rem;
      }
    }

    &pdf {
      margin: 2rem 0;
    }

    &file {
      position: relative;
      width: 100%;
      margin: 1rem 0;
      background-color: ${(props) => props.theme.colors.input_background}
        transparent;
      border-radius: 3px;
      padding: 1rem;
      color: ${(props) => props.theme.colors.off_white};

      font-size: 1.8rem;
      line-height: 25px;

      &:hover {
        background-color: ${(props) => props.theme.colors.input_background};
        transition: all 0.2s;
      }

      &::before {
        content: "📎";
        margin-right: 1rem;
      }

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 1.6rem;
      }
    }

    &bold {
      font-weight: 700;
    }

    &strikethrough {
      text-decoration: line-through;
    }

    &italic {
      font-style: italic;
    }

    &underline {
      text-decoration: underline;
    }
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
