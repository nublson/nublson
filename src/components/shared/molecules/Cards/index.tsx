import { Texts, Titles } from "../../atoms";
import { WorkContainer } from "./styles";
import { ReactNode } from "react";

import { IconContext } from "react-icons";

interface CardsProps {
  title: string;
  description: string;
}

interface WorkCard extends CardsProps {
  link: string;
  stats: string;
  icon: ReactNode;
}

function Work({ title, description, link, stats, icon }: WorkCard) {
  return (
    <WorkContainer>
      <IconContext.Provider
        value={{
          color: "#fcfcfc",
          size: "40",
        }}
      >
        {icon}
      </IconContext.Provider>
      <div className="body">
        <div className="content">
          <Titles.Small content={title} />
          <Texts.Medium content={description} />
        </div>

        <div className="footer">
          <a className="link" href={link} target="_blank" rel="noreferrer">
            <Texts.Small content="Visit" />
          </a>
          <Texts.Small content={stats} />
        </div>
      </div>
    </WorkContainer>
  );
}

const Cards = {
  Work,
};

export default Cards;
