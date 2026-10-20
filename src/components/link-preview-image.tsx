"use client";

import { useState } from "react";

/**
 * A linked page's Open Graph image. Sites often block hotlinking, so a failed
 * image is removed rather than left as an empty, broken frame.
 */
export function LinkPreviewImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    // A third-party image of unknown size: next/image would need every host allowlisted.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="aspect-[1.91/1] w-full border-b border-black/10 object-cover dark:border-white/10"
    />
  );
}
