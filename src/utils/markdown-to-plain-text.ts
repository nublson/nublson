/** Strips Markdown syntax down to plain narration text for TTS input. */
export function markdownToPlainText(markdown: string): string {
  let text = markdown;

  // Footnotes: notionic drops the "Footnotes" heading and writes GFM footnotes,
  // so restore the heading before the first note, read each note without its
  // `[^1]:` label, and drop the `[^1]` marks from the sentences.
  text = text.replace(/^\[\^[^\]\s]+\]:[ \t]*/m, "Footnotes\n\n$&");
  text = text.replace(/^\[\^[^\]\s]+\]:[ \t]*/gm, "");
  text = text.replace(/\[\^[^\]\s]+\]/g, "");

  // Code fences: keep the code content, drop the fence/language markers.
  text = text.replace(/```[a-zA-Z0-9]*\n([\s\S]*?)```/g, "$1");

  // Toggle markup (`<details>`/`<summary>`): keep the summary text.
  text = text.replace(/<\/?(?:details|summary)>/g, "");

  // Images: nothing to narrate.
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  // Links: keep the label text only.
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Inline code, bold, italic, strikethrough markers.
  text = text.replace(/`([^`]*)`/g, "$1");
  text = text.replace(/\*\*([^*]*)\*\*/g, "$1");
  text = text.replace(/\*([^*]*)\*/g, "$1");
  text = text.replace(/~~([^~]*)~~/g, "$1");

  // Heading, blockquote, and list markers at line start.
  text = text
    .split("\n")
    .map((line) =>
      line
        .replace(/^#{1,6}\s+/, "")
        .replace(/^>\s?/, "")
        .replace(/^\s*[-*]\s+/, "")
        .replace(/^\s*\d+\.\s+/, ""),
    )
    .join("\n");

  // Table separator rows, then pipes turned into pauses.
  text = text
    .split("\n")
    .filter((line) => !/^\s*\|?\s*-{2,}(\s*\|\s*-{2,})*\s*\|?\s*$/.test(line))
    .map((line) =>
      line
        .replace(/^\s*\|/, "")
        .replace(/\|\s*$/, "")
        .replace(/\|/g, ","),
    )
    .join("\n");

  // Horizontal rules.
  text = text.replace(/^-{3,}$/gm, "");

  return text
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
