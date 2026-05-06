"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { normalizeLanguage } from "../utils/normalize-language";

export type CodeBlockHighlightProps = {
  language?: string | null;
  code: string;
};

export function CodeBlockHighlight({
  language,
  code,
}: CodeBlockHighlightProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const prismLanguage = normalizeLanguage(language);
  const style = mounted && resolvedTheme === "dark" ? vscDarkPlus : oneLight;

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-md border border-border">
      <SyntaxHighlighter
        language={prismLanguage}
        style={style}
        customStyle={{
          margin: 0,
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          padding: "0.75rem",
          maxWidth: "100%",
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
