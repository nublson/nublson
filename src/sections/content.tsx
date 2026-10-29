import { NotionCode } from "@/components/notion-code";
import {
  NotionEquation,
  NotionInlineEquation,
} from "@/components/notion-equation";
import { NotionImage } from "@/components/notion-image";
import { NotionLink } from "@/components/notion-link";
import { withMermaid } from "@/components/notion-mermaid";
import { parseEmbedHosts } from "@/lib/embed-hosts";
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

/** Sites whose embeds load live; every other embed stays a preview card. */
const EMBED_HOSTS = parseEmbedHosts(
  process.env.NOTION_EMBED_HOSTS,
  process.env.BASE_URL,
);

/**
 * The site's article type on notionic's defaults: `Typography`'s article size
 * for text and semibold headings, none smaller than the body. Notion's heading
 * levels render as the same HTML level; the page title is the h1, so sections
 * use heading 2. Captions and footnotes take `Typography`'s small size, a clear
 * step below the body. `!` because notionic's root classes aren't merged with these.
 */
const ARTICLE_CLASS = [
  "w-full gap-[18px]! text-[15px] leading-[26px]! text-muted-foreground!",
  "[&_:is(h1,h2,h3,h4)]:text-foreground [&_:is(h1,h2,h3,h4)]:font-semibold [&_:is(h1,h2,h3,h4)]:tracking-[-0.01em]",
  "[&_:is(h1,h2,h3,h4)]:text-[15px] [&_:is(h1,h2,h3,h4)]:leading-[26px]",
  "[&_:is(figcaption,[data-footnotes])]:text-[13px] [&_:is(figcaption,[data-footnotes])]:leading-5 [&_:is(figcaption,[data-footnotes])]:text-subtle-foreground",
].join(" ");

export default function ContentSection({ blocks }: ContentSectionProps) {
  // A blank Notion page renders nothing, so it adds no empty gap to the layout.
  if (blocks.length === 0) return null;

  return (
    <section id="content" className="w-full">
      <NotionRenderer
        blocks={blocks}
        components={components}
        embeds={EMBED_HOSTS}
        className={ARTICLE_CLASS}
      />
    </section>
  );
}
