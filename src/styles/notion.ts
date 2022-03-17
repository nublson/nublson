import styled from "styled-components";

export const StyledBlocks = styled.div`
  width: 100%;
  height: 100%;
  margin: 4rem auto 0;

  @media ${(props) => props.theme.mediaQueries.medium} {
    margin-top: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    margin-top: 1rem;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    margin: 1.5rem 0 0;
  }

  hr {
    width: 100%;
    height: 0;
    margin: 0;
    border-color: ${(props) => props.theme.colors.line};
  }

  .title {
    cursor: default;
  }

  pre {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .rnr- {
    &heading_1 {
      width: 100%;
      margin: 4rem 0 1rem;
      color: ${(props) => props.theme.colors.title};
      font-size: 6.4rem;
      line-height: 66px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 3.6rem;
        line-height: 36px;
      }
    }

    &heading_2 {
      width: 100%;
      margin: 3rem 0 1rem;
      color: ${(props) => props.theme.colors.title};
      font-size: 4.8rem;
      line-height: 50px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 2.4rem;
        line-height: 32px;
      }
    }

    &heading_3 {
      width: 100%;
      margin: 2rem 0;
      color: ${(props) => props.theme.colors.title};
      font-size: 3.2rem;
      line-height: 34px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 2.1rem;
        line-height: 32px;
      }
    }

    &paragraph,
    &callout,
    &quote {
      a {
        color: ${(props) => props.theme.colors.off_white};
        font-weight: 600;
        display: inline;
        box-shadow: inset 0 -10px 0 ${(props) => props.theme.colors.primary};
        transition: all 0.2s;

        &:hover {
          box-shadow: inset 0 0 0 ${(props) => props.theme.colors.primary};
        }
      }
    }

    &paragraph {
      font-size: 1.8rem;
      line-height: 30px;
      margin: 1.5rem 0;

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 1.6rem;
        line-height: 25px;
      }
    }

    &callout {
      width: 100%;
      background-color: ${(props) => props.theme.colors.input_background};
      padding: 2rem;
      border-radius: 3px;
      margin: 1.5rem 0;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        padding: 1rem;
      }

      span {
        font-size: 1.8rem;
        line-height: 25px;
        margin: 0 1rem;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
          font-size: 1.6rem;
        }
      }
    }

    &quote {
      width: 100%;
      padding: 0 2rem;
      margin: 1.5rem 0;
      border-left: 3px solid ${(props) => props.theme.colors.off_white};
      font-size: 1.8rem;
      line-height: 25px;
      font-style: italic;
      color: ${(props) => props.theme.colors.off_white};

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 1.6rem;
        padding: 0 1rem;
      }
    }

    &bulleted_list_item {
      width: 100%;
      list-style-position: inside;
      margin: 1.5rem 0;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
          font-size: 1.6rem;
        }
      }
    }

    &numbered_list_item {
      width: 100%;
      list-style-position: inside;
      margin: 1.5rem 0;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
          font-size: 1.6rem;
        }
      }
    }

    &to_do {
      width: 100%;
      list-style: none;
      margin: 1.5rem 0;

      li {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
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
      margin: 1.5rem 0;

      summary {
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
          font-size: 1.6rem;
        }
      }

      p {
        width: 100%;
        font-size: 1.8rem;
        line-height: 25px;
        margin: 1rem 0 0 2rem;

        @media ${(props) => props.theme.mediaQueries.medium_s} {
          font-size: 1.6rem;
        }
      }
    }

    &video,
    &pdf,
    &embed {
      margin: 2rem 0 1rem;
      width: 100%;
      height: 51.638rem;

      @media ${(props) => props.theme.mediaQueries.large} {
        height: 41rem;
      }

      @media ${(props) => props.theme.mediaQueries.medium} {
        height: 39rem;
      }

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        height: 25rem;
      }

      @media ${(props) => props.theme.mediaQueries.smaller} {
        height: 21.7rem;
      }

      @media ${(props) => props.theme.mediaQueries.smallest} {
        height: 18.4rem;
      }
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

      @media ${(props) => props.theme.mediaQueries.medium_s} {
        font-size: 1.6rem;
      }
    }

    &bold {
      font-weight: 700;
    }

    &italic {
      font-style: italic;
    }

    &strikethrough {
      text-decoration: line-through;
    }

    &underline {
      text-decoration: underline;
    }

    &gray {
      color: ${(props) => props.theme.colors.block.gray};
    }

    &brown {
      color: ${(props) => props.theme.colors.block.brown};
    }

    &orange {
      color: ${(props) => props.theme.colors.block.orange};
    }

    &yellow {
      color: ${(props) => props.theme.colors.block.yellow};
    }

    &green {
      color: ${(props) => props.theme.colors.block.green};
    }

    &blue {
      color: ${(props) => props.theme.colors.block.blue};
    }

    &purple {
      color: ${(props) => props.theme.colors.block.purple};
    }

    &pink {
      color: ${(props) => props.theme.colors.block.pink};
    }

    &red {
      color: ${(props) => props.theme.colors.block.red};
    }
  }
`;
