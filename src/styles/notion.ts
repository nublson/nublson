import styled from "styled-components";

export const StyledBlocks = styled.div`
  width: 100%;
  height: 100%;
  margin: 4rem auto 0;

  .gumroad-button {
    margin: 1rem 0;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    margin-top: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    margin-top: 1rem;
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    margin: 0;
  }

  a {
    display: inline-block;
    color: ${(props) => props.theme.colors.block.yellow} !important;
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
      margin: 3rem 0 1rem;
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
      margin: 2rem 0 1rem;
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
      margin: 1rem 0;
      color: ${(props) => props.theme.colors.title};
      font-size: 3.2rem;
      line-height: 34px;
      font-weight: 700;
      text-align: left;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 2.1rem;
        line-height: 32px;
      }
    }

    &paragraph,
    &callout,
    &quote {
      a {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.label};

        &:hover {
          color: ${(props) => props.theme.colors.off_white};
          transition: all 0.2s;
        }
      }
    }

    &paragraph {
      font-size: 1.8rem;
      line-height: 30px;
      margin: 0;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 1.6rem;
        line-height: 25px;
      }
    }

    &empty-block {
      width: 100%;
      height: 0;
      margin: 1rem 0;
      padding: 0.5rem 0;

      @media ${(props) => props.theme.mediaQueries.medium} {
        margin: 0.5rem 0;
      }

      @media ${(props) => props.theme.mediaQueries.medium} {
        margin: 0.5rem 0;
      }
    }

    &callout {
      width: 100%;
      background-color: ${(props) => props.theme.colors.input_background};
      padding: 2rem;
      border-radius: 3px;
      margin: 0;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      @media ${(props) => props.theme.mediaQueries.small} {
        padding: 1rem;
      }

      span {
        font-size: 1.8rem;
        line-height: 25px;
        margin: 0 1rem;

        @media ${(props) => props.theme.mediaQueries.small} {
          font-size: 1.6rem;
        }
      }
    }

    &quote {
      width: 100%;
      padding: 0 2rem;
      margin: 0;
      border-left: 3px solid ${(props) => props.theme.colors.off_white};
      font-size: 1.8rem;
      line-height: 25px;
      font-style: italic;

      @media ${(props) => props.theme.mediaQueries.small} {
        font-size: 1.6rem;
        padding: 0 1rem;
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
      margin: 2rem 0 1rem;
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
      text-decoration-color: ${(props) =>
        props.theme.colors.block.gray} !important;
    }

    &brown {
      color: ${(props) => props.theme.colors.block.brown};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.brown} !important;
    }

    &orange {
      color: ${(props) => props.theme.colors.block.orange};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.orange} !important;
    }

    &yellow {
      color: ${(props) => props.theme.colors.block.yellow};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.yellow} !important;
    }

    &green {
      color: ${(props) => props.theme.colors.block.green};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.green} !important;
    }

    &blue {
      color: ${(props) => props.theme.colors.block.blue};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.blue} !important;
    }

    &purple {
      color: ${(props) => props.theme.colors.block.purple};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.purple} !important;
    }

    &pink {
      color: ${(props) => props.theme.colors.block.pink};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.pink} !important;
    }

    &red {
      color: ${(props) => props.theme.colors.block.red};
      text-decoration-color: ${(props) =>
        props.theme.colors.block.red} !important;
    }
  }
`;
