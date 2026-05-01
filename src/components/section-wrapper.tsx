import { SectionHeader } from "./section-header";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  path?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  title,
  path,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      {...props}
      className="w-full flex flex-col items-center justify-start gap-8 pb-5"
    >
      <SectionHeader title={title} href={path} />

      {children}
    </section>
  );
}
