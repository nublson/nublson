/**
 * Opens a book's `Path` (where to get it) in a new tab. A book without one
 * renders the same content, unlinked.
 */
export function BookLink({
  href,
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
