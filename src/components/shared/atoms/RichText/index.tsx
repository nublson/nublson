import Titles from "../Titles";
import Texts from "../Texts";

interface RichTextProps {
  content: any;
}

function RichText({ content }: RichTextProps) {
  return <Texts.Medium content="Rich Text" />;
}

export default RichText;
