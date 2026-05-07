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
  TableBlock,
  VideoBlock,
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
      className="w-full flex flex-col items-start justify-start space-y-0 [&>*+*]:mt-6"
    >
      <Render
        blocks={blocks as NotionBlock[]}
        simpleTitles
        linkAttributes={(link) => {
          const isRootRelativePath =
            link.startsWith("/") && !link.startsWith("//");
          const isHashLink = link.startsWith("#");
          const baseUrl = process.env.BASE_URL;
          const baseOrigin = baseUrl != null ? new URL(baseUrl).origin : null;
          const isSameOriginAbsoluteLink = (() => {
            if (baseOrigin == null) {
              return false;
            }
            try {
              return new URL(link).origin === baseOrigin;
            } catch {
              return false;
            }
          })();

          const isInternalLink =
            isRootRelativePath || isHashLink || isSameOriginAbsoluteLink;

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
          [blockEnum.VIDEO]: VideoBlock,
          [blockEnum.TABLE]: TableBlock,
        }}
      />
    </section>
  );
}
