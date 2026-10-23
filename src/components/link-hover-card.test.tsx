import { renderHook } from "@testing-library/react";
import type { PointerEvent } from "react";
import { describe, expect, it } from "vitest";
import { useLineAnchor } from "./link-hover-card";

/** A link that wraps onto two lines. */
function wrappedLink() {
  const el = document.createElement("a");
  const lines = [new DOMRect(600, 100, 60, 20), new DOMRect(30, 120, 80, 20)];
  el.getClientRects = () => lines as unknown as DOMRectList;
  return { el, lines };
}

const pointerAt = (el: HTMLAnchorElement, rect: DOMRect) =>
  ({
    currentTarget: el,
    clientX: rect.left + 1,
    clientY: rect.top + 1,
  }) as unknown as PointerEvent<HTMLAnchorElement>;

describe("useLineAnchor", () => {
  it("anchors to the hovered line", () => {
    const { result } = renderHook(() => useLineAnchor());
    const { el, lines } = wrappedLink();
    result.current.triggerRef.current = el;

    result.current.triggerProps.onPointerEnter(pointerAt(el, lines[1]));
    expect(result.current.anchor.getBoundingClientRect()).toBe(lines[1]);
  });

  it("anchors a keyboard reopen to the first line after a hover on another line", () => {
    const { result } = renderHook(() => useLineAnchor());
    const { el, lines } = wrappedLink();
    result.current.triggerRef.current = el;

    // Hover the second line, open, leave while open, then close.
    result.current.triggerProps.onPointerEnter(pointerAt(el, lines[1]));
    result.current.onOpenChange(true);
    result.current.triggerProps.onPointerLeave();
    result.current.onOpenChange(false);

    // Keyboard focus reopens it with no pointer over the link.
    result.current.onOpenChange(true);
    expect(result.current.anchor.getBoundingClientRect()).toBe(lines[0]);
  });
});
