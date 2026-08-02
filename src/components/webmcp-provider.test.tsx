import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WebmcpProvider, resetWebmcpRegistration } from "./webmcp-provider";

type TestGlobals = {
  navigator: { modelContext?: unknown };
  document: { modelContext?: unknown };
};

const globals = globalThis as unknown as TestGlobals;

afterEach(() => {
  delete globals.navigator.modelContext;
  delete globals.document.modelContext;
  resetWebmcpRegistration?.();
});

describe("WebmcpProvider", () => {
  it("registers tools via provideContext when available", () => {
    const provideContext = vi.fn();
    globals.navigator.modelContext = { provideContext };

    render(<WebmcpProvider />);

    expect(provideContext).toHaveBeenCalledTimes(1);
    const { tools } = provideContext.mock.calls[0]![0] as {
      tools: { name: string }[];
    };
    expect(tools.map((tool) => tool.name)).toEqual([
      "list_posts",
      "search_posts",
      "get_post",
    ]);
  });

  it("falls back to per-tool registerTool", () => {
    const registerTool = vi.fn();
    globals.navigator.modelContext = { registerTool };

    render(<WebmcpProvider />);

    expect(registerTool).toHaveBeenCalledTimes(3);
  });

  it("uses document.modelContext when navigator has none", () => {
    const provideContext = vi.fn();
    globals.document.modelContext = { provideContext };

    render(<WebmcpProvider />);

    expect(provideContext).toHaveBeenCalledTimes(1);
  });

  it("does nothing quietly when no API exists", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => render(<WebmcpProvider />)).not.toThrow();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it("registers only once across remounts", () => {
    const provideContext = vi.fn();
    globals.navigator.modelContext = { provideContext };

    const first = render(<WebmcpProvider />);
    first.unmount();
    render(<WebmcpProvider />);

    expect(provideContext).toHaveBeenCalledTimes(1);
  });

  it("survives a throwing registration API", () => {
    globals.navigator.modelContext = {
      provideContext: vi.fn(() => {
        throw new Error("spec changed");
      }),
    };

    expect(() => render(<WebmcpProvider />)).not.toThrow();
  });
});
