import type { ComponentType } from "react"
import { plainText, RichText, type BlockProps } from "notionic"

import { MermaidDiagram } from "@/components/mermaid-diagram"

type CodeComponent = ComponentType<BlockProps<"code">>

/**
 * Wraps a code component so Notion's `mermaid` code blocks draw as diagrams,
 * and every other language renders with `Code`:
 *
 *   code: withMermaid(NotionCode)
 *
 * The wrapped component renders the source on the server, and it stays as
 * the fallback until the diagram draws.
 */
export function withMermaid(Code: CodeComponent): CodeComponent {
  return function NotionMermaid(props) {
    const { block, context } = props
    if (block.code.language !== "mermaid") return <Code {...props} />

    const { rich_text, caption } = block.code
    // The figure shows the caption, so the fallback code leaves it out.
    const source = { ...block, code: { ...block.code, caption: [] } }
    return (
      <figure className="flex flex-col gap-2">
        <MermaidDiagram
          code={plainText(rich_text)}
          label={plainText(caption) || "Diagram"}
          fallback={<Code {...props} block={source} />}
        />
        {caption.length > 0 ? (
          <figcaption className="text-center text-[13px] leading-5 text-subtle-foreground">
            <RichText text={caption} context={context} />
          </figcaption>
        ) : null}
      </figure>
    )
  }
}
