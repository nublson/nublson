/**
 * First focusable control: moves keyboard users past the header into `#main-content`.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Skip to main content
    </a>
  );
}
