import { plainText, RichText, type BlockProps, languageName } from "notionic"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { highlightCode } from "@/lib/highlighter"

// Not code to highlight: Notion draws mermaid as a diagram.
const PLAIN = new Set(["plain text", "mermaid"])

// The check pops in when the code is copied; only while copied, so the copy
// icon doesn't animate on page load. Reduced motion keeps only the fade.
const COPY_BUTTON =
  "data-copied:[&_svg]:transition-[scale,opacity,filter] data-copied:[&_svg]:duration-200 data-copied:[&_svg]:ease-[cubic-bezier(0.23,1,0.32,1)] data-copied:[&_svg]:starting:scale-50 data-copied:[&_svg]:starting:opacity-0 data-copied:[&_svg]:starting:blur-xs motion-reduce:data-copied:[&_svg]:transition-opacity"

/**
 * A Notion code block, highlighted on the server with shadcn/ui's Code
 * Block. Add languages in lib/highlighter.tsx; unlisted ones render plain.
 */
export async function NotionCode({ block, context }: BlockProps<"code">) {
  const { language, rich_text, caption } = block.code
  // A trailing newline would render as an extra empty line.
  const code = plainText(rich_text).replace(/\n$/, "")
  const lines = PLAIN.has(language)
    ? null
    : await highlightCode(code, language).catch(() => null)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{languageName(language)}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} className={COPY_BUTTON} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent aria-label={`Code, ${languageName(language)}`}>
        {lines
          ? lines.map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity beyond their position
              <CodeBlockLine key={index}>{line}</CodeBlockLine>
            ))
          : code}
      </CodeBlockContent>
      {caption.length > 0 ? (
        <CodeBlockFooter>
          <RichText text={caption} context={context} />
        </CodeBlockFooter>
      ) : null}
    </CodeBlock>
  )
}
