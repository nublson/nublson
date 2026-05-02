import {
  BulletListBlock,
  CalloutBlock,
  CodeBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  ImageBlock,
  NumberedListBlock,
  ParagraphBlock,
  QuoteBlock,
} from "@/components/content-blocks";
import { BlockWithChildren } from "@/services/notion";
import { blockEnum, NotionBlock, Render } from "@9gustin/react-notion-render";

interface ContentSectionProps {
  blocks: BlockWithChildren[];
}

export default function ContentSection({ blocks }: ContentSectionProps) {
  return (
    <section
      id="content"
      className="w-full flex flex-col items-start justify-start gap-0 space-y-5"
    >
      <Render
        blocks={blocks as NotionBlock[]}
        simpleTitles
        linkAttributes={(link) => {
          const isInternalLink =
            link.startsWith(process.env.BASE_URL!) || link.startsWith("/");

          if (isInternalLink) {
            return {
              target: "_self",
            };
          }

          return {
            target: "_blank",
            rel: "noopener noreferrer",
          };
        }}
        blockComponentsMapper={{
          [blockEnum.IMAGE]: ImageBlock,
          [blockEnum.HEADING1]: Heading1Block,
          [blockEnum.HEADING2]: Heading2Block,
          [blockEnum.HEADING3]: Heading3Block,
          [blockEnum.PARAGRAPH]: ParagraphBlock,
          [blockEnum.DOTS_LIST]: BulletListBlock,
          [blockEnum.ENUM_LIST]: NumberedListBlock,
          [blockEnum.CODE]: CodeBlock,
          [blockEnum.CALLOUT]: CalloutBlock,
          [blockEnum.QUOTE]: QuoteBlock,
        }}
      />
    </section>
  );
}
