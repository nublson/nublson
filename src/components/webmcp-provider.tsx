"use client";

import {
  getWebmcpTools,
  type ModelContextTool,
} from "@/utils/webmcp-tools";
import { useEffect } from "react";

type ModelContextLike = {
  provideContext?: (context: { tools: ModelContextTool[] }) => unknown;
  registerTool?: (tool: ModelContextTool) => unknown;
};

let registered = false;

/** Test-only helper: allows re-registration between test cases. */
export function resetWebmcpRegistration() {
  registered = false;
}

function findModelContext(): ModelContextLike | undefined {
  const fromNavigator = (
    globalThis.navigator as Navigator & { modelContext?: ModelContextLike }
  ).modelContext;
  const fromDocument = (
    globalThis.document as Document & { modelContext?: ModelContextLike }
  ).modelContext;
  return fromNavigator ?? fromDocument;
}

function registerWebmcpTools() {
  if (registered) return;
  registered = true;

  try {
    const modelContext = findModelContext();
    if (!modelContext) return;

    const tools = getWebmcpTools(fetch.bind(globalThis));

    if (typeof modelContext.provideContext === "function") {
      modelContext.provideContext({ tools });
      return;
    }

    if (typeof modelContext.registerTool === "function") {
      for (const tool of tools) {
        modelContext.registerTool(tool);
      }
    }
  } catch {
    // The WebMCP API is an unstable draft — a shape change must never
    // break the page for regular visitors.
  }
}

export function WebmcpProvider() {
  useEffect(() => {
    registerWebmcpTools();
  }, []);

  return null;
}
