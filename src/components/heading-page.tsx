import { Typography } from "@/components/typography";

interface HeadingPageProps {
  title: string;
  bottom?: React.ReactNode;
}

export function HeadingPage({ title, bottom }: HeadingPageProps) {
  return (
    <div className=" w-full flex flex-col items-start justify-start gap-[6px]">
      <Typography variant="h1">{title}</Typography>
      {bottom}
    </div>
  );
}
