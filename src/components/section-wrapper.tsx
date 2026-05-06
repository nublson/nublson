import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  path?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  title,
  path,
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
        "flex w-full flex-col items-center justify-start gap-8 pb-5",
        className,
      )}
    >
      <SectionHeader title={title} href={path} titleId={headingId} />

      {children}
    </section>
  );
}
