import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  path?: string;
  /** Controls for the header's right side (see `SectionHeader`). */
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionWrapper({
  title,
  path,
  action,
  children,
  id,
  className,
  ...props
}: SectionWrapperProps) {
  const headingId = typeof id === "string" ? `${id}-heading` : undefined;

  return (
    <section
      {...props}
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "flex w-full flex-col items-stretch justify-start gap-3.5",
        className,
      )}
    >
      <SectionHeader
        title={title}
        href={path}
        titleId={headingId}
        action={action}
      />

      {children}
    </section>
  );
}
