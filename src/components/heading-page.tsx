import { Typography } from "@/components/typography";

interface HeadingPageProps {
  title: string;
  bottom?: React.ReactNode;
  size?: "small" | "default";
  top?: React.ReactNode;
}

export function HeadingPage({
  title,
  top,
  bottom,
  size = "default",
}: HeadingPageProps) {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-5">
      {top}
      <div className="w-full flex flex-col items-start justify-start gap-[6px]">
        <Typography
          component="h1"
          variant={size === "small" ? "h2" : "h1"}
          className="break-words"
        >
          {title}
        </Typography>
        {bottom}
      </div>
    </div>
  );
}
