import { IMembersOnlyCardProps, ITextsProps } from "../../../../utils/types";
import { Container } from "./styles";
import { RiEmpathizeLine } from "react-icons/ri";
import dynamic from "next/dynamic";

const SmallTitle = dynamic<ITextsProps>(() =>
  import("../../atoms/Titles").then((module) => module.SmallTitle)
);

const MediumText = dynamic<ITextsProps>(() =>
  import("../../atoms/Texts").then((module) => module.MediumText)
);

function MembersOnly({ member_link }: IMembersOnlyCardProps) {
  return (
    <Container href={member_link} target="_blank" rel="noreferrer">
      <RiEmpathizeLine className="icon" />
      <div className="content">
        <SmallTitle content="This content is FREE for members only!" />
        <MediumText content="Join to become an Official Patron and get access." />
      </div>
    </Container>
  );
}

export default MembersOnly;
