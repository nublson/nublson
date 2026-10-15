import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connecting to Purl",
  robots: { index: false, follow: false },
};

export default function PurlCallbackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
