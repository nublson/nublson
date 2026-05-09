## Learned User Preferences
- Prefers concise explanations after code fixes with explicit verification.
- Often asks to commit immediately after confirming a change works.

## Learned Workspace Facts
- Posts metadata includes Notion properties `Path` (url), `Figma` (url), and `Category` (select).
- Blog article pages expect `MorePosts` to exclude the current post and show the next three latest posts.
- Repository workflow uses `develop` as the integration/default branch for feature PRs before promotion to `main`.
- Content block renderers run as server components; avoid client-only hooks like `useEffect` unless explicitly making the component client-side.
- Published date rendering should prefer Notion datetime values when present and fall back to formatter utilities.
