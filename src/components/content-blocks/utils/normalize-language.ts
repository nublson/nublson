/**
 * Maps Notion code block language labels to Prism language identifiers.
 * Notion uses free-text values ("Plain Text", "JavaScript", "ts", etc.).
 */
const ALIAS_MAP: Record<string, string> = {
  "": "text",
  "plain text": "text",
  plaintext: "text",
  text: "text",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
  jsx: "jsx",
  shell: "bash",
  bash: "bash",
  zsh: "bash",
  sh: "bash",
  yml: "yaml",
  md: "markdown",
  markdown: "markdown",
  rb: "ruby",
  py: "python",
  rs: "rust",
  go: "go",
  wasm: "wasm",
};

export function normalizeLanguage(
  language: string | undefined | null,
): string {
  if (language == null || language === "") {
    return "text";
  }

  const key = language.trim().toLowerCase();
  if (key === "") {
    return "text";
  }

  return ALIAS_MAP[key] ?? key;
}
