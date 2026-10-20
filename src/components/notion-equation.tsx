import katex from "katex"
import "katex/dist/katex.min.css"
import type { BlockProps, InlineEquationProps } from "notionic"

// Rendered to HTML on the server: no math JavaScript reaches the browser.
// KaTeX escapes the source, and its `trust` option stays off, so commands
// like \href can't inject links.
function render(expression: string, displayMode: boolean) {
  return katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
    output: "htmlAndMathml",
  })
}

/** A Notion equation block, typeset with KaTeX. */
export function NotionEquation({ block }: BlockProps<"equation">) {
  return (
    <div
      className="overflow-x-auto py-1"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output, escaped with `trust` off (see render)
      dangerouslySetInnerHTML={{
        __html: render(block.equation.expression, true),
      }}
    />
  )
}

/** An equation inside text, typeset with KaTeX. */
export function NotionInlineEquation({ expression }: InlineEquationProps) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output, escaped with `trust` off (see render)
    <span dangerouslySetInnerHTML={{ __html: render(expression, false) }} />
  )
}
