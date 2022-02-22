import dynamic from "next/dynamic";
import { RiEmpathizeLine } from "react-icons/ri";
import { IMembersOnlyCardProps, ITextsProps } from "../../../../utils/types";
import { Container } from "./styles";
import { useRouter } from "next/router";

const SmallTitle = dynamic<ITextsProps>(() =>
  import("../../atoms/Titles").then((module) => module.SmallTitle)
);

const MediumText = dynamic<ITextsProps>(() =>
  import("../../atoms/Texts").then((module) => module.MediumText)
);

function MembersOnly({ member_link, access }: IMembersOnlyCardProps) {
  const { pathname } = useRouter();

  return (
    <Container href={member_link} target="_blank" rel="noreferrer">
      <RiEmpathizeLine className="icon" />
      <div className="content">
        <SmallTitle
          content={`This ${
            pathname.includes("blog")
              ? "post"
              : pathname.includes("store")
              ? "product"
              : pathname.includes("podcast")
              ? "episode"
              : "content"
          } is ${
            access === "member_free"
              ? "FREE"
              : access === "member_exclusive"
              ? "EXCLUSIVE"
              : "PUBLIC"
          } for members only!`}
        />
        <MediumText content="Join to become an Official Patron and get access." />
      </div>
    </Container>
  );
}

export default MembersOnly;
