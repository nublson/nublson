import { Typography } from "@/components/typography";

interface HeadingPageProps {
  title: string;
  bottom?: React.ReactNode;
  size?: "small" | "default";
}

export function HeadingPage({
  title,
  bottom,
  size = "default",
}: HeadingPageProps) {
  return (
    <div className=" w-full flex flex-col items-start justify-start gap-[6px]">
      <Typography component="h1" variant={size === "small" ? "h2" : "h1"}>
        {title}
      </Typography>
      {bottom}
    </div>
  );
}
