# Portfolio micro-interactions: animation opportunities

Date: 2026-10-15
Source: `find-animation-opportunities` sweep of the rebuilt UI (branch `claude/portfolio-visual-rebuild-e0e863`).
Status: implemented on 2026-10-15 (rows 1–4, adapted: row 3 also nudges the project ↗; row 1 also stops skeletons replaying the entrance), plus a theme toggle swap to the contextual icon recipe (scale 0.25→1, blur 4px→0, opacity, `cubic-bezier(0.2, 0, 0, 1)`, 200ms).

Existing motion vocabulary to extend: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` in `src/app/globals.css`, 150ms color/background hovers, the `page-enter` stagger on `.article-layout`, and the reactions pill's own transitions.

## Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `src/app/writings/[slug]/page.tsx:80` (More posts), `:77` (reactions pill); same pattern for every `Suspense` list outside `.article-layout` | Skeleton swaps to streamed content instantly | Preventing a jarring change | Occasional (once per article view) | On the streamed section root: `transition: opacity 200ms var(--ease-out)` with `@starting-style { opacity: 0 }`. Opacity only, no translate, so it doesn't fight the skeleton's footprint. Reduced motion: keep the 200ms opacity fade (it carries no movement). |
| 2 | `src/sections/projects.tsx:26`, `src/sections/gears.tsx:27`, `src/components/post-list.tsx:33` | Rows give no press feedback; navigation starts with nothing acknowledging the tap | Feedback | Tens per visit at most | `:active { transform: scale(0.98) }` on the row link, `transition: transform 160ms var(--ease-out)`, added to the existing `background-color`/`color` transition list. 0.98 rather than 0.96 because the rows are full-width and a larger shrink reads as a jump. Reduced motion: drop the scale, keep the hover fill. |
| 3 | `src/components/article-header-parts.tsx:6` | "← Writing" back link only changes color | Spatial consistency (shows the direction you'll go) | Occasional | Arrow `span` gets `display: inline-block; transition: transform 150ms var(--ease-out)`; on link hover `transform: translateX(-2px)`. Gate with `@media (hover: hover) and (pointer: fine)`. Reduced motion: no translate, color change only. |
| 4 | `src/components/cover-image.tsx:24` (article and project covers) | Blur placeholder is replaced by the full image in a single frame | Preventing a jarring change | Occasional | Fade the loaded image over its placeholder: image starts `opacity: 0`, on `onLoad` set a `data-loaded` attribute, `transition: opacity 300ms var(--ease-out)`. Needs `"use client"` on a wrapper, so keep `CoverImage` itself a server component and add a small client `FadeInImage`. Reduced motion: same fade (no movement). |

## Rejected candidates

- `src/components/project-item.tsx` (hover lift, icon tile scale or tilt on row hover). **Rejected: Function.** Rows are a list people scan to choose. Movement on hover pulls the eye off the titles. The 150ms background fill already confirms the target.
- `src/components/theme-toggle.tsx` (richer sun/moon morph). **Rejected: Frequency, plus it's out of scope.** The toggle already cross-fades with rotate and scale. Redesigning existing motion belongs to `review-animations`, not this sweep.
- `src/components/post-list.tsx` (stagger the rows of the Writing archive). **Rejected: Speed / Frequency.** The `page-enter` stagger already moves the list as one block, and staggering 20+ rows inside it pushes the last row past the 300ms budget on a page people return to.
- `src/components/post-reactions.tsx` (animate view and like counts ticking up). **Rejected: Function.** Counts are data the reader checks. A rolling number adds noise and delays the real value. The existing `reaction-pop` on press is enough feedback.
- `src/components/favicon-link.tsx` (favicon wiggle or scale on hover). **Rejected: Purpose.** It's decoration at a tens-per-visit frequency. The opacity hover is the right weight.

## Verdict

This interface needs very little more motion. The rebuild already has the right base: a single entrance stagger, color-only hovers and an animated reactions pill. The highest-leverage addition is #1, fading in the streamed Suspense sections, because it fixes a visible pop that every article visitor sees. Press feedback on rows (#2) is the next most useful detail. #3 and #4 are polish. One thing to look at in the review pass: `page-enter` replays on every client-side navigation, so check it at full speed with `review-animations` and consider limiting it to the first load if it starts to feel slow.

To turn any row into an implementation plan, run `improve-animations plan <suggestion>`.
