"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
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

function subscribeToHtmlClass(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getHtmlIsDark() {
  return document.documentElement.classList.contains("dark");
}

function getServerIsDark() {
  return false;
}

export function CodeBlockHighlight({
  language,
  code,
}: CodeBlockHighlightProps) {
  const { resolvedTheme } = useTheme();
  const documentIsDark = useSyncExternalStore(
    subscribeToHtmlClass,
    getHtmlIsDark,
    getServerIsDark,
  );
  const isDark =
    resolvedTheme === "dark" ||
    (resolvedTheme !== "light" && documentIsDark);

  const prismLanguage = normalizeLanguage(language);
  const style = isDark ? vscDarkPlus : oneLight;

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
