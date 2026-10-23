"use client";

import {
  useMemo,
  useRef,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

/**
 * Index of the link's line box under the pointer. A link that wraps has one
 * box per line, and its bounding box spans them all.
 */
function lineAt(el: Element, x: number, y: number): number {
  const rects = Array.from(el.getClientRects());
  const hit = rects.findIndex(
    (r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom,
  );
  return Math.max(hit, 0);
}

/**
 * A hover card anchored to the line of the link it was opened from, so a
 * link that wraps doesn't place it mid-paragraph. Keyboard focus anchors it
 * to the first line. The line is kept as an index and measured on every
 * position update, so the card follows the link on scroll and resize.
 */
export function LinkHoverCard({
  trigger,
  children,
}: {
  /** The link: an anchor element, which becomes the trigger. */
  trigger: ReactElement;
  children: ReactNode;
}) {
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const line = useRef(0);
  const open = useRef(false);

  const anchor = useMemo(
    () => ({
      getBoundingClientRect: () => {
        const el = triggerRef.current;
        if (!el) return new DOMRect();
        return el.getClientRects()[line.current] ?? el.getBoundingClientRect();
      },
      get contextElement() {
        return triggerRef.current ?? undefined;
      },
    }),
    [],
  );

  // Track the line under the pointer until the card opens, so it doesn't jump
  // while the pointer moves onto it.
  const trackLine = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!open.current) {
      line.current = lineAt(event.currentTarget, event.clientX, event.clientY);
    }
  };

  return (
    <HoverCard
      onOpenChange={(next) => {
        open.current = next;
      }}
    >
      <HoverCardTrigger
        ref={triggerRef}
        render={trigger}
        delay={300}
        closeDelay={100}
        onPointerEnter={trackLine}
        onPointerMove={trackLine}
        onPointerLeave={() => {
          if (!open.current) line.current = 0;
        }}
      />
      <HoverCardContent
        anchor={anchor}
        collisionPadding={16}
        className="w-64 max-w-(--available-width) overflow-hidden p-0"
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}
