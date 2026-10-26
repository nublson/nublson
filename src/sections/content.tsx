import { NotionCode } from "@/components/notion-code";
import {
  NotionEquation,
  NotionInlineEquation,
} from "@/components/notion-equation";
import { NotionImage } from "@/components/notion-image";
import { NotionLink } from "@/components/notion-link";
import { withMermaid } from "@/components/notion-mermaid";
import { BlockWithChildren } from "@/services/notion";
import { NotionRenderer } from "notionic";

interface ContentSectionProps {
  blocks: BlockWithChildren[];
}

const components = {
  code: withMermaid(NotionCode),
  equation: NotionEquation,
  inline_equation: NotionInlineEquation,
  image: NotionImage,
  link: NotionLink,
};

/**
 * The site's article type on notionic's defaults: `Typography`'s article size
 * for text, and its h3/h4 for headings (Notion's heading 1 renders as an h2).
 * `!` because notionic's root classes aren't merged with these.
 */
const ARTICLE_CLASS = [
  "w-full gap-[18px]! text-[15px] leading-[26px]! text-muted-foreground!",
  "[&_:is(h2,h3,h4,h5)]:text-foreground [&_:is(h2,h3,h4,h5)]:tracking-[-0.01em]",
  "[&_:is(h2,h3)]:text-[15px] [&_:is(h2,h3)]:leading-[26px]",
  "[&_:is(h4,h5)]:text-sm [&_:is(h4,h5)]:leading-[22px]",
].join(" ");

export default function ContentSection({ blocks }: ContentSectionProps) {
  // A blank Notion page renders nothing, so it adds no empty gap to the layout.
  if (blocks.length === 0) return null;

  return (
    <section id="content" className="w-full">
      <NotionRenderer
        blocks={blocks}
        components={components}
        className={ARTICLE_CLASS}
      />
    </section>
  );
}
